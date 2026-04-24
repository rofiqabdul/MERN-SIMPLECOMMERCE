import prisma from "../config/prisma.js";
import fs from "fs";
import path from "path";
import { errorResponse, successRespone } from "../utils/response.js";

const cleanImageUrl = (base, imagePath) =>
	base.replace(/\/$/, "") + imagePath.replace(/^\//, "");

export const getAllProduct = async (req, res) => {};
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
