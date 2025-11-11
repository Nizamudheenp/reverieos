import mongoose from "mongoose";

const DreamSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            default: "Untitled Dream",
        },
        content: {
            type: String,
            default: "",
        },
        emotion: {
            type: String,
            default: "neutral",
        },
    },
    { timestamps: true }
);

export default mongoose.models.Dream || mongoose.model("Dream", DreamSchema);
