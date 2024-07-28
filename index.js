import { connectDB } from "./src/db/connectDB.js";
import { app } from "./main.js";
import dotenv from "dotenv";

dotenv.config({});

await connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("An error occured during connection", err);
  });
