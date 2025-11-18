import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Dream from "@/models/Dream";
import Insight from "@/models/Insight";
import { groq } from "@/lib/groq";

async function analyze(text) {
  const prompt = `
You are an expert dream psychologist and emotional analysis system.

Your job: Read the dream logs and ALWAYS provide helpful, meaningful output
even if the dream is only one word, unclear, short, or repeated.

Return ONLY valid JSON string in this format:

{
  "summary": "Short but meaningful reflection (2-4 sentences).",
  "emotions": [
    { "label": "Emotion1", "score": 0.0 },
    { "label": "Emotion2", "score": 0.0 }
  ],
  "keywords": ["word1", "word2", "word3"]
}

Rules:
Only output valid JSON.
No explanation. No markdown. No notes. No commentary.
If unsure, still guess and return full valid JSON.


Dreams:
${text}

`;


  const ai = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" }
  });


  let output = ai.choices[0].message.content?.trim();

  if (!output) {
    return { summary: "Dreams show psychological activity.", emotions: [], keywords: [] };
  }

  try {
    return JSON.parse(output);
  } catch (err) {
    console.log("JSON Parse Failed:", output);
    return { summary: "Dreams show psychological activity.", emotions: [], keywords: [] };
  }

}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });

  await connectDB();

  const lastInsight = await Insight.findOne({ userId: session.user.id }).sort({ createdAt: -1 });
  if (!lastInsight) {
    return new Response(JSON.stringify({ message: "No insights yet" }), { status: 200 });
  }

  return new Response(JSON.stringify(lastInsight), { status: 200 });
}

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });

  await connectDB();

  const dreams = await Dream.find({ userId: session.user.id }).sort({ createdAt: -1 });
  if (dreams.length === 0) {
    await Insight.deleteMany({ userId: session.user.id }); // clear old
    return new Response(JSON.stringify({ message: "No dreams" }), { status: 200 });
  }

  const text = dreams.map(d => d.content).join("\n");
  const aiResult = await analyze(text);

  const newInsight = await Insight.create({
    userId: session.user.id,
    summary: aiResult.summary,
    emotions: aiResult.emotions,
    keywords: aiResult.keywords,
    dreamIds: dreams.map(d => d._id),
    source: "ai"
  });

  return new Response(JSON.stringify(newInsight), { status: 200 });
}
