import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Dream from "@/models/Dream";

export async function PUT(req, context) {
    await connectDB();

    const params = await context.params;

    if (!params?.id) {
        return new Response(JSON.stringify({ error: "Missing dream ID" }), { status: 400 });
    }

    const session = await getServerSession(authOptions);
    if (!session) {
        return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
    }

    const { content } = await req.json();

    const updatedDream = await Dream.findOneAndUpdate(
        { _id: params.id, userId: session.user.id },
        { content },
        { new: true }
    );

    if (!updatedDream) {
        return new Response(JSON.stringify({ error: "Dream not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(updatedDream));
}
