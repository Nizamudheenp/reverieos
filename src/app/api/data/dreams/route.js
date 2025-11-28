import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/mongodb";
import Dream from "@/models/Dream";
import Insight from "@/models/Insight";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session) return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });

  await connectDB();

  await Promise.all([
    Dream.deleteMany({ userId: session.user.id }),
    Insight.deleteMany({ userId: session.user.id }),
  ]);

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
