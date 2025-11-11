import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Dream from "@/models/Dream";

export async function GET() {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session) {
        return Response.json({ error: "Not authenticated" }, { status: 401 });
    }

    const dreams = await Dream.find({ userId: session.user.id }).sort({
        createdAt: -1,
    });

    return Response.json(dreams);
}

export async function POST(req) {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session)
        return Response.json({ error: "Not authenticated" }, { status: 401 });

    const { title, content } = await req.json();

    const newDream = await Dream.create({
        userId: session.user.id,
        title,
        content,
    });

    return Response.json(newDream);
}
