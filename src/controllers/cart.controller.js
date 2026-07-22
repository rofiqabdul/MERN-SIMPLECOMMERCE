import prisma from "../config/prisma.js";
import { successRespone, errorResponse } from "../utils/response.js";

export const addToCart = async (req, res) => {
	const { productId, quantity } = req.body;
	const product = await prisma.product.findUnique({
		where: { id: productId },
	});

	if (!product) {
		return errorResponse(
			res,
			"Product not found",
			{ error: "Product not found" },
			404
		);
	}

	const total = product.price * quantity;

	const cart = await prisma.cart.create({
		data: {
			product,
			quantity,
			total,
			userId: req.user.id,
		},
	});

	return successRespone(res, "Add to cart successful", cart);
};

export const getAllCart = async (req, res) => {
	const cartItems = await prisma.cart.findMany({
		where: { userId: req.user.userId },
		include: { product: true },
	});

	return successRespone(res, "get all cart successful", cartItems);
};
