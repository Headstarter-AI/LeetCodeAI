import { Router } from "express";
import { waitListUser } from "../controllers/waitlist.controller.js";

const router = Router();

router.route("/waitlist").post(waitListUser);

export default router;
