import prisma from "../config/prisma.js";
import { successRespone, errorResponse } from "../utils/response.js";

export const checkout = async (req, res) => {
	const { email, name, phone, date } = req.body;

	const carts = await prisma.cart.findMany({
		where: { userId: req.user.userId },
		include: { product: true },
	});

	if (carts.length === 0) return errorResponse(res, "Empty cart");

	const items = carts
		.map((cart) => `${cart.product.name} x ${cart.quantity}`)
		.join(", ");
	const total = carts.reduce((sum, item) => sum + item.total, 0);

	const invoice = await prisma.invoice.create({
		data: {
			email,
			name,
			phone,
			date: new Date(date),
			items,
			total,
			userId: req.user.id,
		},
	});

	await prisma.cart.deleteMany({
		where: { userId: req.user.userId },
	});

	return successRespone(res, "Checkout successful", invoice);
};

export const getAllInvoice = async (req, res) => {
	try {
		const invoices = await prisma.invoice.findMany();
		return successRespone(res, "Get all invoices", invoices);
	} catch (error) {
		return errorResponse(res, "Failed to get invoice");
	}
};

export const getInvoiceById = async (req, res) => {
	try {
		const invoice = await prisma.invoice.findUnique({
			where: { id: req.params.id },
		});
		return successRespone(res, "Get invoice by id successful", invoice);
	} catch (error) {
		return errorResponse(
			res,
			"Failed to get invoice by id",
			{ error: error.message },
			500
		);
	}
};

export const getInvoiceByUserEmail = async (req, res) => {
	try {
		const invoices = await prisma.invoice.findMany({
			where: { email: req.params.email },
		});
		return successRespone(
			res,
			"Get invoice by user email successful",
			invoices
		);
	} catch (error) {
		return errorResponse(
			res,
			"Failed to get invoice by user email",
			{ error: error.message },
			500
		);
	}
};
