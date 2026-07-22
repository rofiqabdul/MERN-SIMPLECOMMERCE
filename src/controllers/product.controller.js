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
		const productWithImageUrl = {
			...item,
			image: item.image ? cleanImageUrl(base, item.image) : null,
		};

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

export const updateProduct = async (req, res) => {
	try {
		const { id } = req.params;
		const { name, price, stock, description, inventoryId } = req.body;
		const image = req.file ? `/uploads/${req.file.filename}` : undefined;

		const product = await prisma.product.findUnique({ where: { id } });
		if (!product) return errorResponse(res, "product not found", null, 404);

		if (image && product.image) {
			const oldImagePath = path.join(
				process.cwd(),
				"uploads",
				path.basename(product.image)
			);

			fs.unlink(oldImagePath, (err) => {
				if (err) {
					console.warn("Gagal hapus file lama: ", oldImagePath);
				} else {
					console.log("File lama terhapus: ", oldImagePath);
				}
			});
		}
		const changedProduct = {
			name,
			price: parseFloat(price),
			stock: parseInt(stock),
			description,
			inventoryId,
		};
		if (image) changedProduct.image = image;

		const updatedProduct = await prisma.product.update({
			where: { id },
			data: changedProduct,
		});

		const baseUrl = `${req.protocol}://${req.get("host")}`;

		return successRespone(res, "Update product successful", {
			...updatedProduct,
			image: updatedProduct.image ? `${baseUrl}${updatedProduct.image}` : null,
		});
	} catch (error) {
		return errorResponse(
			res,
			"Upload product failed",
			{ error: error.message },
			500
		);
	}
};

export const deleteProduct = async (req, res) => {
	try {
		const { id } = req.params;

		const product = await prisma.product.findUnique({ where: { id } });
		if (!product) return errorResponse(res, "product not found", null, 404);

		if (product.image) {
			const oldImagePath = path.join(
				process.cwd(),
				"uploads",
				path.basename(product.image)
			);

			fs.unlink(oldImagePath, (err) => {
				if (err) {
					console.warn("Gagal hapus file lama: ", oldImagePath);
				} else {
					console.log("File lama terhapus: ", oldImagePath);
				}
			});
		}

		await prisma.product.delete({ where: { id } });
		return successRespone(res, "Delete product successful");
	} catch (error) {
		return errorResponse(
			res,
			"Delete product failed",
			{ error: error.message },
			500
		);
	}
};
