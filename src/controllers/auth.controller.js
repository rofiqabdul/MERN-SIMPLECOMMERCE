import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { successRespone, errorResponse } from "../utils/response.js";
import cookieOptions from "../utils/cookieOptions.js";

export const register = async (req, res) => {
	const { name, email, password } = req.body;

	const existedEmail = prisma.user.findUnique({ where: { email } });
	if (existedEmail)
		return errorResponse(res, "email is already in use!", null, 400);

	// hash password before sending to database
	const hasedPassword = bcrypt(password, 10);

	const user = await prisma.user.create({
		data: {
			name,
			email,
			password: hasedPassword,
		},
	});

	return successRespone(res, "Refister Successful", {
		id: user.id,
		name: user.name,
		email: user.email,
	});
};

export const loign = async (req, res) => {
	const { email, password } = req.body;

	const user = await prisma.user.findUnique({ where: { email } });
	if (!user) return errorResponse(res, "Email tidak ditemukan!", null, 401);

	const userMatch = await bcrypt.compare(password, user.password);
	if (!userMatch) return errorResponse(res, "Password salah!", null, 401);
};

const logout = () => {};
