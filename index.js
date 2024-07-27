import dotenv from "dotenv";
import { connectDB } from "./db/connectDB.js";
import { app } from "./main.js";

dotenv.config({
  path: "./env",
});

await connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("An error occured during connection", err);
  });
