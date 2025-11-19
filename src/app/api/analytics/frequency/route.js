import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Dream from "@/models/Dream";
import dayjs from "dayjs";

export async function GET(req) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });

  const userId = session.user.id;
  const url = new URL(req.url);
  const days = parseInt(url.searchParams.get("days") || "14", 10);

  const today = dayjs().startOf('day');
  const start = today.subtract(days - 1, 'day').toDate();

  const dreams = await Dream.find({ userId, createdAt: { $gte: start } }, { createdAt: 1 }).sort({ createdAt: 1 });

  const map = {};
  for (let i = 0; i < days; i++) {
    const key = today.subtract(days - 1 - i, 'day').format('YYYY-MM-DD');
    map[key] = 0;
  }

  for (const d of dreams) {
    const key = dayjs(d.createdAt).format('YYYY-MM-DD');
    if (map[key] !== undefined) map[key] += 1;
  }

  const result = Object.keys(map).map(date => ({ date, count: map[date] }));
  return new Response(JSON.stringify(result), { status: 200 });
}
