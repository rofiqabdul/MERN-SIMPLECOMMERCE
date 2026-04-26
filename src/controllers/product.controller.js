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

export const getProductByInventoryId = async (req, res) => {
	try {
		const { id } = req.params;
		const product = await prisma.product.findMany({
			where: { inventoryId: id },
		});

		if (!product || product.length === 0) {
			return errorResponse(
				res,
				"No product found on this inventory",
				null,
				404
			);
		}

		const base = `${req.protocol}://${req.get("host")}`;
		const productWithImageUrl = product.map((item) => ({
			...item,
			image: item.image ? cleanImageUrl(base, item.image) : null,
		}));

		return successRespone(
			res,
			"Get product by inventory id successful",
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

export const getProductById = async (req, res) => {
	try {
		const { id } = req.params;
		const product = await prisma.product.findUnique({
			where: { id },
		});

		if (!product) {
			return errorResponse(res, "Product not found", null, 404);
		}

		const base = `${req.protocol}://${req.get("host")}`;
		const productWithImageUrl = product.map((item) => ({
			...item,
			image: item.image ? cleanImageUrl(base, item.image) : null,
		}));

		return successRespone(
			res,
			"Get product by id successful",
			productWithImageUrl
		);
	} catch (error) {
		return errorResponse(
			res,
			"Get product by id failed",
			{ error: error.message },
			500
		);
	}
};

export const createProduct = async (req, res) => {
	try {
		const { name, price, stock, description, inventoryId } = req.body;
		const image = req.file ? `/uploads/${req.file.filename}` : null;

		const product = await prisma.product.create({
			data: {
				name,
				price: parseFloat(price),
				stock: parseFloat(stock),
				description,
				image,
				inventoryId,
			},
		});

		if (!product) {
			return errorResponse(res, "Product not found", null, 404);
		}

		const baseUrl = `${req.protocol}://${req.get("host")}`;

		return successRespone(res, "Create product successful", {
			...product,
			image: product.image ? `${baseUrl}${product.image}` : null,
		});
	} catch (error) {
		return errorResponse(
			res,
			"Create product failed",
			{ error: error.message },
			500
		);
	}
};
// updateProduct,
export const updateProduct = async (req, res) => {};
// deleteProduct,
export const deleteProduct = async (req, res) => {};
