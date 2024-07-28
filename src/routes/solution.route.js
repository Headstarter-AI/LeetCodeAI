import { Router } from "express";
import {
  generateHints,
  generateAlgorithms,
  generateCode,
  addProblem,
} from "../controllers/solution.controller.js";

const router = Router();
router.route("/hints").post(generateHints);
router.route("/algorithms").post(generateAlgorithms);
router.route("/code").post(generateCode);
router.route("/addProblem").post(addProblem);

export default router;
