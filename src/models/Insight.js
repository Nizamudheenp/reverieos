import mongoose from "mongoose";

const InsightSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  dreamIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Dream" }],
  type: { type: String, default: "summary" }, 
  summary: { type: String },
  emotions: [
    {
      label: String,
      score: Number,
    },
  ],
  keywords: [String],
  source: { type: String, default: "mock" },
}, { timestamps: true });

export default mongoose.models.Insight || mongoose.model("Insight", InsightSchema);
