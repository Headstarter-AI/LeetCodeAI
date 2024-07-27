import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

import solutionRouter from "./src/routes/solution.route.js";
import waitlistRouter from "./src/routes/waitlist.route.js";

app.use("/api/v1/solution", solutionRouter);
app.use("/api/v1/users", waitlistRouter);

export { app };
