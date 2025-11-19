import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Dream from "@/models/Dream";
import Insight from "@/models/Insight";
import { groq } from "@/lib/groq";

async function classifyDreamWithGroq(text) {
  const prompt = `
You are a concise dream classifier. Given a short dream text, return JSON ONLY:
{
  "tags": ["water", "flight"],
  "emotions": [{"label":"anxious","score":0.7},{"label":"curious","score":0.3}],
  "sentiment": 0.25
}
Rules:
- Always output valid JSON only.
- Provide top 3 tags (if available).
- Provide up to 3 emotions with scores that sum <= 1.
- 'sentiment' is 0..1 (0 negative, 1 positive).
Dream:
${text}
`;
  const ai = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2
  });

  try {
    return JSON.parse(ai.choices[0].message.content);
  } catch (err) {
    console.error("groq parse error:", err);
    return { tags: [], emotions: [], sentiment: 0.5 };
  }
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

  const { content } = await req.json();
  if (!content || content.trim() === "") {
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

  try {
    const result = await classifyDreamWithGroq(content);
    await Dream.findByIdAndUpdate(created._id, {
      tags: result.tags || [],
      emotions: result.emotions || [],
      sentimentScore: typeof result.sentiment === "number" ? result.sentiment : 0.5
    });
  } catch (err) {
    console.error("classification failed", err);
  }


  try {
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/analytics/insight`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ triggerFrom: "dreamCreate" }),
    }).catch((e) => console.warn("insight regen error:", e));
  } catch (e) {
    console.warn("insight regen top-level", e);
  }

  return Response.json(created);
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

  try {
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/analytics/insight`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ triggerFrom: "dreamDelete" }),
    }).catch((e) => console.warn("insight regen error:", e));
  } catch (e) { console.warn(e); }

  return Response.json({ success: true });
}
