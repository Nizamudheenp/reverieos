import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Dream from "@/models/Dream";

export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const dreams = await Dream.find({ userId: session.user.id }).sort({ createdAt: -1 });
  return Response.json(dreams);
}

export async function POST(req) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const { content } = await req.json();

  if (!content || content.trim() === "") {
    return Response.json({ error: "Dream content is required" }, { status: 400 });
  }

  const todayStart = new Date();
  todayStart.setHours(0,0,0,0);

  const todayCount = await Dream.countDocuments({
    userId: session.user.id,
    createdAt: { $gte: todayStart }
  });

  if (todayCount >= 2) {
    return Response.json({ error: "Daily limit reached (2 dreams)" }, { status: 403 });
  }

  const dream = await Dream.create({
    userId: session.user.id,
    content
  });

  return Response.json(dream);
}

export async function DELETE(req) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const { id } = await req.json();
  const dream = await Dream.findOne({ _id: id, userId: session.user.id });

  if (!dream) return Response.json({ error: "Dream not found" }, { status: 404 });

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  if (dream.createdAt < oneHourAgo) {
    return Response.json({ error: "Delete not allowed after 1 hour" }, { status: 403 });
  }

  await Dream.deleteOne({ _id: id });
  return Response.json({ success: true });
}
