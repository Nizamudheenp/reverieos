import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Settings from "@/models/Settings";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
  await connectDB();

  let settings = await Settings.findOne({ userId: session.user.id });
  if (!settings) {
    settings = await Settings.create({ userId: session.user.id });
  }

  return new Response(JSON.stringify(settings), { status: 200 });
}

export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
  await connectDB();
  const body = await req.json();

  const updated = await Settings.findOneAndUpdate(
    { userId: session.user.id },
    { $set: body },
    { new: true, upsert: true }
  );

  return new Response(JSON.stringify(updated), { status: 200 });
}
