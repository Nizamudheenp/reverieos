import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/mongodb";
import Dream from "@/models/Dream";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });

  const userId = session.user.id;
  const dreams = await Dream.find({ userId }, { emotions: 1 });

  const bucket = {};
  for (const d of dreams) {
    if (!Array.isArray(d.emotions)) continue;
    for (const e of d.emotions) {
      if (!e?.label) continue;
      bucket[e.label] = (bucket[e.label] || 0) + (e.score || 0);
    }
  }

  const result = Object.keys(bucket).map(k => ({ label: k, value: +(bucket[k].toFixed(3)) }));
  return new Response(JSON.stringify(result), { status: 200 });
}
