import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },

    theme: {
      type: String,
      enum: ["light", "dark", "system"],
      default: "system",
    },

    autoExport: {
      type: Boolean,
      default: false,
    },

    notifications: {
      email: { type: Boolean, default: false },
      push: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);
