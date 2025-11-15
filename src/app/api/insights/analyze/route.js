import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Dream from "@/models/Dream";
import Insight from "@/models/Insight";

function mockAnalyzeText(text) {
  // Very simple mock: counts some words and picks random tones
  const lower = text.toLowerCase();
  const keywords = [];
  if (lower.includes("water")) keywords.push("water");
  if (lower.includes("flight")) keywords.push("flight");
  if (lower.includes("chase")) keywords.push("chase");
  if (lower.includes("friend")) keywords.push("friend");

  const emotions = [
    { label: "calm", score: Math.random() * 0.5 },
    { label: "anxious", score: Math.random() * 0.5 },
    { label: "happy", score: Math.random() * 0.5 },
  ].sort((a,b)=>b.score-a.score);

  const summary = `A short reflection: your dreams include ${keywords.slice(0,3).join(", ") || "various symbols"} and show a mix of ${emotions[0].label} and ${emotions[1].label}.`;

  return { summary, emotions, keywords };
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });

  const body = await req.json();
  const mode = body.mode || "lastN";
  const n = body.n || 5;

  await connectDB();

  // fetch the relevant dreams
  let dreams;
  if (Array.isArray(body.dreamIds) && body.dreamIds.length) {
    dreams = await Dream.find({ _id: { $in: body.dreamIds }, userId: session.user.id });
  } else {
    dreams = await Dream.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(n);
  }

  const text = dreams.map(d => d.content || d.title || "").join("\n\n");

  // Use mock analysis for now
  const analysis = mockAnalyzeText(text);

  // store insight for later quick retrieval
  const saved = await Insight.create({
    userId: session.user.id,
    dreamIds: dreams.map(d => d._id),
    summary: analysis.summary,
    emotions: analysis.emotions,
    keywords: analysis.keywords,
    source: "mock",
  });

  return new Response(JSON.stringify(saved), { status: 200 });
}
