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

export async function POST(req) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });

  const dreams = await Dream.find({ userId: session.user.id }).sort({ createdAt: -1 });
  if (!dreams.length) {
    await Insight.deleteMany({ userId: session.user.id });
    return new Response(JSON.stringify({ message: "No dreams" }), { status: 200 });
  }

  const text = dreams.map(d => d.content).join("\n\n");
  const ai = await analyzeAllDreams(text);

  const saved = await Insight.create({
    userId: session.user.id,
    dreamIds: dreams.map(d => d._id),
    summary: ai.summary,
    emotions: ai.emotions,
    keywords: ai.keywords,
    source: "groq"
  });

  return new Response(JSON.stringify(saved), { status: 200 });
}

export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });

  const last = await Insight.findOne({ userId: session.user.id }).sort({ createdAt: -1 });
  if (!last) return new Response(JSON.stringify({ message: "No insights yet" }), { status: 200 });
  return new Response(JSON.stringify(last), { status: 200 });
}
