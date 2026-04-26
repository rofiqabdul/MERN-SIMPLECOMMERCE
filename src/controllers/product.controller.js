import prisma from "../config/prisma.js";
import fs from "fs";
import path from "path";
import { errorResponse, successRespone } from "../utils/response.js";
import { cleanImageUrl } from "../utils/helper.js";

export const getAllProduct = async (req, res) => {
	try {
		const products = await prisma.product.findMany({
			include: { inventory: true },
		});
		const base = `${req.protocol}://${req.get("host")}`;
		const productWithImageUrl = products.map((product) => ({
			...product,
			image: product.image ? cleanImageUrl(base, product.image) : null,
		}));

		return successRespone(
			res,
			"Get all products successful",
			productWithImageUrl
		);
	} catch (error) {
		return errorResponse(
			res,
			"Get product failed",
			{ error: error.message },
			500
		);
	}
};
// getProductByInventoryId,
export const getProductByInventoryId = async (req, res) => {};
// getProductById,
export const getProductById = async (req, res) => {};
// createProduct,
export const createProduct = async (req, res) => {};
// updateProduct,
export const updateProduct = async (req, res) => {};
// deleteProduct,
export const deleteProduct = async (req, res) => {};
