import express from "express";
import bodyParser from "body-parser";
import solutionRoutes from "./routes/solution.route.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(bodyParser.json());

app.use("/solutions", solutionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
