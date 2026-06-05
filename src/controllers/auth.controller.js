import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import dotenv from "dotenv";
import { successRespone, errorResponse } from "../utils/response.js";
import cookieOptions from "../utils/cookieOptions.js";

// dotenv.config();
// const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req, res) => {
	const { name, email, password } = req.body;

	const emailExisted = await prisma.user.findUnique({
		where: {
			email,
		},
	});

	if (emailExisted)
		return errorResponse(res, "Email allready in use", null, 400);

	// hash password before sending to database
	const hasedPassword = await bcrypt.hash(password, 10);

	const user = await prisma.user.create({
		data: {
			name,
			email,
			password: hasedPassword,
		},
	});

	return successRespone(res, "Register Successful", {
		id: user.id,
		name: user.name,
		email: user.email,
	});
};

export const login = async (req, res) => {
	const { email, password } = req.body;

	const user = await prisma.user.findUnique({ where: { email } });
	if (!user) return errorResponse(res, "Email tidak ditemukan!", null, 401);

	const userMatch = await bcrypt.compare(password, user.password);
	if (!userMatch) return errorResponse(res, "Password salah!", null, 401);

	const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
		expiresIn: "1d",
	});
	res.cookie("token", token, cookieOptions(req));

	return successRespone(res, "Login successful", {
		userId: user.id,
		email: email,
		token: token,
	});
};

export const logout = (req, res) => {
	res.clearCookie("token", {
		...cookieOptions(req),
		maxAge: undefined,
	});

	return successRespone(res, "Logout successful");
};
