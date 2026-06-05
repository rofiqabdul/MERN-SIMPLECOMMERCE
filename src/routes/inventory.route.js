import express from "express";
import {
	listInventories,
	getInventory,
	createInventory,
	updateInventory,
	deleteInventory,
} from "../controllers/inventory.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.use(verifyToken);
router.get("/", listInventories);
router.get("/:id", getInventory);
router.post("/", createInventory);
router.put("/:id", updateInventory);
router.delete("/:id", deleteInventory);

export default router;
