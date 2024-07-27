import { Router } from "express";
import {
  generateHints,
  generateAlgorithms,
  generateCode,
} from "../controllers/solution.controller.js";

const router = Router();

router.route("/hints").post(generateHints);
router.route("/algorithms").post(generateAlgorithms);
router.route("/code").post(generateCode);

export default router;
