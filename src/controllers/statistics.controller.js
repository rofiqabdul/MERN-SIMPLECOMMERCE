import prisma from "../config/prisma.js";
import { errorResponse, successRespone } from "../utils/response.js";

export const getRange = async (req, res) => {
	const { startDate, endDate } = req.query;

	const data = await prisma.invoice.findMany({
		where: {
			date: {
				gte: new Date(startDate),
				lte: new Date(endDate),
			},
		},
	});

	const totalOrders = data.reduce((sum, inv) => sum + 1, 0);
	const totalPaid = data.reduce((sum, inv) => sum + inv.total, 0);

	return successRespone(res, "Statistics with date range successful", {
		totalOrders,
		totalPaid,
	});
};
export const getSingle = async (req, res) => {
	const { date } = req.query;

	const target = new Date(date);
	const nextDay = new Date(date);

	const data = await prisma.invoice.findMany({
		where: {
			date: {
				gte: target,
				lte: nextDay,
			},
		},
	});

	const totalOrders = data.length;
	const totalPaid = data.reduce((sum, inv) => sum + inv.total, 0);

	return successRespone(res, "Statistics with single date successful", {
		totalOrders,
		totalPaid,
	});
};
