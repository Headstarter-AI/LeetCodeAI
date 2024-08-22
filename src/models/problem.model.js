import mongoose from "mongoose";

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    required: true,
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Problem = mongoose.model("Problem", problemSchema);

export default Problem;
