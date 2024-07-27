import mongoose from "mongoose";
import { DB_NAME } from "../../constant.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_DB_URI}/${DB_NAME}`);
    console.log("mongodb database conected sucessfully");
  } catch (error) {
    console.log("mongodb database connection failed", error);
  }
};
