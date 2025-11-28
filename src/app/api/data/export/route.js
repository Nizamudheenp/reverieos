import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/mongodb";
import Dream from "@/models/Dream";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });

  await connectDB();

  const dreams = await Dream.find({ userId: session.user.id }).sort({ createdAt: -1 }).lean();
  return new Response(JSON.stringify(dreams), { status: 200 });
}
