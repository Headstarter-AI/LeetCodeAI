import express from "express";

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

import solutionRouter from "./routes/solution.route.js";
import waitlistRouter from "./routes/waitlist.route.js";

app.use("/api/v1/solution", solutionRouter);
app.use("/api/v1/users", waitlistRouter);

export { app };
