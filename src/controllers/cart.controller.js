import prisma from "../config/prisma.js";
import { successRespone, errorResponse } from "../utils/response.js";

export const addToCart = async (req, res) => {};

export const getAllCart = async (req, res) => {
	const cartItems = await prisma.cart.findMany({
		where: { userId: req.user.userId },
		include: { product: true },
	});
};
