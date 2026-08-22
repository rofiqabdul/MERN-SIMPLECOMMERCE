import express from "express";
import { getRange, getSingle } from "../controllers/statistics.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();
router.use(verifyToken);

router.get("/range", getRange);
router.get("/single", getSingle);

export default router;
