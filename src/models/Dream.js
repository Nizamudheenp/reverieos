import mongoose from "mongoose";

const DreamSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    title: { type: String, default: "Dream" },
    content: { type: String, required: true },
    length: { type: Number, default: 0 }, 
    tags: [{ type: String }],             
    emotions: [
      { label: String, score: Number }    
    ],
    sentimentScore: { type: Number, default: 0 }, 
  },
  { timestamps: true }
);

export default mongoose.models.Dream || mongoose.model("Dream", DreamSchema);
