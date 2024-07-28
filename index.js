import { connectDB } from "./src/db/connectDB.js";
import { app } from "./main.js";
import dotenv from "dotenv";

dotenv.config();

console.log("MONGO_URI:", process.env.MONGO_URI); // Add this debug log

await connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server is running at port: ${process.env.PORT || 3000}`);
    });
  })
  .catch((err) => {
    console.log("An error occurred during connection", err);
  });
