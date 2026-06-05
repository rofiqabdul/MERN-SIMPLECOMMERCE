import express from "express";
import { upload } from "../middleware/upload.js";
import { verifyToken } from "../middleware/verifyToken.js";
import {
	getAllProduct,
	getProductByInventoryId,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

router.get("/", getAllProduct);
router.get("/inventory/:id", getProductByInventoryId);
router.get("/:id", getProductById);
router.post("/", verifyToken, upload.single("image"), createProduct);
router.put("/:id", verifyToken, upload.single("image"), updateProduct);
router.delete("/:id", verifyToken, deleteProduct);

export default router;
