import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Dream from "@/models/Dream";

export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });

  const userId = session.user.id;
  const dreams = await Dream.find({ userId }, { tags: 1 });

  const counts = {};
  for (const d of dreams) {
    for (const t of (d.tags || [])) {
      counts[t] = (counts[t] || 0) + 1;
    }
  }

  const arr = Object.keys(counts).map(k => ({ tag: k, count: counts[k] })).sort((a,b)=>b.count-a.count);
  return new Response(JSON.stringify(arr.slice(0, 30)), { status: 200 });
}
