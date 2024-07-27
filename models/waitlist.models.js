import mongoose from "mongoose";

const waitListSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const WaitListUser = mongoose.model("WaitListUser", waitListSchema);
