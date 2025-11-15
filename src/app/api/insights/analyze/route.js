import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Dream from "@/models/Dream";
import Insight from "@/models/Insight";
import { groq } from "@/lib/groq";

async function analyzeWithGroq(text) {
  const prompt = `
You are an AI dream analyst. Analyze the following dream logs and return:
1. A short summary (2-4 sentences)
2. Top 3 emotions with score (0-1)
3. 3-6 important symbolic keywords

Return JSON ONLY with this structure:
{
 "summary": "...",
 "emotions": [{"label": "...", "score": 0.00}],
 "keywords": ["...", "..."]
}

Dream text:
${text}
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3
  });

  let result;
  try {
    result = JSON.parse(response.choices[0].message.content);
  } catch (err) {
    console.error("JSON parse error:", err);
    result = {
      summary: "Unable to interpret fully, but dreams show psychological activity.",
      emotions: [{ label: "neutral", score: 0.5 }],
      keywords: []
    };
  }

  return result;
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });

  const body = await req.json();
  const mode = body.mode || "lastN";
  const n = body.n || 5;

  await connectDB();

  let dreams;
  if (Array.isArray(body.dreamIds) && body.dreamIds.length) {
    dreams = await Dream.find({ _id: { $in: body.dreamIds }, userId: session.user.id });
  } else {
    dreams = await Dream.find({ userId: session.user.id }).sort({ createdAt: -1 }).limit(n);
  }

  const text = dreams.map(d => d.content || d.title || "").join("\n\n");

  const ai = await analyzeWithGroq(text);

  const saved = await Insight.create({
    userId: session.user.id,
    dreamIds: dreams.map(d => d._id),
    summary: ai.summary,
    emotions: ai.emotions,
    keywords: ai.keywords,
    source: "groq",
  });

  return new Response(JSON.stringify(saved), { status: 200 });
}
