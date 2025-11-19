import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Dream from "@/models/Dream";

export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });

  const userId = session.user.id;
  const now = new Date();

  const total = await Dream.countDocuments({ userId });
  const todayStart = new Date(); todayStart.setHours(0,0,0,0);
  const today = await Dream.countDocuments({ userId, createdAt: { $gte: todayStart } });

  const weekStart = new Date(); weekStart.setDate(now.getDate()-6); weekStart.setHours(0,0,0,0);
  const last7 = await Dream.countDocuments({ userId, createdAt: { $gte: weekStart } });

  return new Response(JSON.stringify({ total, today, last7 }), { status: 200 });
}
