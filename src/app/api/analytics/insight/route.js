import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Dream from "@/models/Dream";
import Insight from "@/models/Insight";
import { groq } from "@/lib/groq";

async function analyzeAllDreams(text) {
  const prompt = `
You are an expert dream analyst. Produce JSON ONLY:
{
 "summary":"2-4 concise sentences that connect recurring themes",
 "emotions":[{"label":"...","score":0.0}],
 "keywords":["..."]
}
If text is short, still produce helpful JSON guess.
Dreams:
${text}
`;
  const ai = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.25
  });

  try {
    return JSON.parse(ai.choices[0].message.content);
  } catch (err) {
    console.error("AI parse error", err);
    return { summary: "Dreams show psychological activity.", emotions: [], keywords: [] };
  }
}

/**
 * Shared logic to generate and save insights for a user.
 * Can be called from API routes or directly from other server actions/routes.
 */
export async function generateInsightForUser(userId) {
  await connectDB();
  const dreams = await Dream.find({ userId }).sort({ createdAt: -1 });

  if (!dreams.length) {
    await Insight.deleteMany({ userId });
    return { message: "No dreams" };
  }

  const text = dreams.map(d => d.content).join("\n\n");
  const ai = await analyzeAllDreams(text);

  const saved = await Insight.create({
    userId,
    dreamIds: dreams.map(d => d._id),
    summary: ai.summary,
    emotions: ai.emotions,
    keywords: ai.keywords,
    source: "groq"
  });

  return saved;
}

export async function POST(req) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  try {
    const result = await generateInsightForUser(session.user.id);
    return Response.json(result, { status: 200 });
  } catch (error) {
    console.error("Insight generation error:", error);
    return Response.json({ error: "Failed to generate insights" }, { status: 500 });
  }
}

export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const last = await Insight.findOne({ userId: session.user.id }).sort({ createdAt: -1 });
  if (!last) return Response.json({ message: "No insights yet" }, { status: 200 });
  return Response.json(last, { status: 200 });
}

