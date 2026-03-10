import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Dream from "@/models/Dream";
import { groq } from "@/lib/groq";
import { generateInsightForUser } from "../analytics/insight/route";

async function classifyDreamWithGroq(text) {
  const prompt = `
You are an expert mystical astrologer. 
Analyze the dream and provide top 3 tags, emotions, and a deep traditional/astrological meaning.

Important: You MUST provide a "meaning" that is at least 2 sentences long. 
Interpret symbols like animals, water, or flight based on folklore and tradition.

Return JSON ONLY:
{
  "tags": ["symbol1", "symbol2"],
  "emotions": [{"label":"emotion","score":0.5}],
  "sentiment": 0.5,
  "meaning": "Since you saw [X], it traditionally signifies [Y]. This suggests that in the coming days you should [Z]."
}

Dream:
${text}
`;

  console.log("Consulting Groq for dream:", text.substring(0, 50) + "...");

  const ai = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: "You are a mystical astrologer who always responds in JSON with a 'meaning' field." },
      { role: "user", content: prompt }
    ],
    temperature: 0.7,
    response_format: { type: "json_object" }
  });

  const content = ai.choices[0].message.content;
  console.log("Groq raw response:", content);

  try {
    return JSON.parse(content);
  } catch (err) {
    console.error("groq parse error:", err);
    return { tags: [], emotions: [], sentiment: 0.5, meaning: "The celestial bodies are obscured today. Try reflecting deeper." };
  }
}

function sanitizeInput(content) {
  // Basic sanitization: trim and remove excessive whitespace/control characters
  return content.trim().replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
}

export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const dreams = await Dream.find({ userId: session.user.id }).sort({ createdAt: -1 });
  return Response.json(dreams);
}

export async function POST(req) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const body = await req.json();
  const content = sanitizeInput(body.content || "");

  if (!content || content === "") {
    return Response.json({ error: "Dream content is required" }, { status: 400 });
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayCount = await Dream.countDocuments({
    userId: session.user.id,
    createdAt: { $gte: todayStart }
  });
  if (todayCount >= 2) {
    return Response.json({ error: "Daily limit reached (2 dreams)" }, { status: 403 });
  }

  const created = await Dream.create({
    userId: session.user.id,
    content,
    length: content.split(/\s+/).filter(Boolean).length
  });

  let result = { tags: [], emotions: [], sentiment: 0.5, meaning: "The stars are silent on this vision." };
  try {
    result = await classifyDreamWithGroq(content);
  } catch (err) {
    console.error("classification failed", err);
  }

  const updatedDream = await Dream.findByIdAndUpdate(
    created._id,
    {
      tags: result.tags || [],
      emotions: result.emotions || [],
      sentimentScore: typeof result.sentiment === "number" ? result.sentiment : 0.5,
      meaning: result.meaning || "The celestial alignment is unclear for this vision. Seek wisdom within."
    },
    { new: true } // Return the modified document
  );

  // Directly call insight generation logic instead of internal fetch
  try {
    await generateInsightForUser(session.user.id);
  } catch (e) {
    console.warn("Failed to regenerate insights directly:", e);
  }

  return Response.json(updatedDream);
}

export async function DELETE(req) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const { id } = await req.json();
  const dream = await Dream.findOne({ _id: id, userId: session.user.id });
  if (!dream) return Response.json({ error: "Dream not found" }, { status: 404 });

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  if (dream.createdAt < oneHourAgo) {
    return Response.json({ error: "Delete not allowed after 1 hour" }, { status: 403 });
  }

  await Dream.deleteOne({ _id: id });

  // Directly call insight generation logic
  try {
    await generateInsightForUser(session.user.id);
  } catch (e) {
    console.warn("Failed to regenerate insights on delete:", e);
  }

  return Response.json({ success: true });
}

