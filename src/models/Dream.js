import mongoose from "mongoose";

const DreamSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    title: { type: String, default: "Dream" },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Dream || mongoose.model("Dream", DreamSchema);
