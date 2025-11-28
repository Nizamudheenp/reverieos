import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },

    // Appearance preferences
    theme: {
      type: String,
      enum: ["light", "dark", "system"],
      default: "system",
    },

    // Export preferences (future use)
    autoExport: {
      type: Boolean,
      default: false,
    },

    // Notifications (future use)
    notifications: {
      email: { type: Boolean, default: false },
      push: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);
