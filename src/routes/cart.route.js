import express from "express";
import { addToCart, getAllCart } from "../controllers/cart.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.use(verifyToken);
router.post("/", addToCart);
router.get("/:id", getAllCart);

export default router;
