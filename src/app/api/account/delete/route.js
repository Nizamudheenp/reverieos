import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Dream from "@/models/Dream";
import Insight from "@/models/Insight";
import Settings from "@/models/Settings";

export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session) return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });

  await connectDB();

  const userEmail = session.user.email; // optional
  const userId = session.user.id;

  // remove user's documents
  await Promise.all([
    User.deleteOne({ email: userEmail }),
    Dream.deleteMany({ userId }),
    Insight.deleteMany({ userId }),
    Settings.deleteMany({ userId }),
  ]);

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
