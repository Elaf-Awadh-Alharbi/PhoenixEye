import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    location: { type: String },
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);

export default Report;
