import prisma from "../config/prisma.js";
import { successRespone, errorResponse } from "../utils/response.js";

export const getInventories = async (req, res) => {
	const inventories = await prisma.inventory.findMany();
	return successRespone(res, "get inventory successful", inventories);
};

export const getInventory = async (req, res) => {
	const { id } = req.params;
	const inventory = await prisma.inventory.findUnique({ where: { id } });

	if (!inventory) {
		return errorResponse(res, "id not found!", null, 401);
	} else {
		return successRespone(res, "get inventory by successful", inventory);
	}
};

export const createInventory = async (req, res) => {
	const { name, description } = req.body;

	if (!name || !description) {
		return errorResponse(res, "data can't be empty", null, 401);
	}

	const inventory = await prisma.inventory.create({
		data: { name, description },
	});

	return successRespone(res, "inventory created", inventory);
};

export const updateInventory = async (req, res) => {
	const { id } = req.params;
	const { name, description } = req.body;

	if (!name || !description) {
		return errorResponse(res, "data can't be empty", null, 401);
	}

	const inventory = await prisma.inventory.update({
		where: { id },
		data: { name, description },
	});

	return successRespone(res, "inventory updated", inventory);
};

export const deleteInventory = async (req, res) => {
	const { id } = req.params;

	const inventory = await prisma.inventory.delete({ where: { id } });

	return successRespone(res, "inventory deleted", inventory);
};
