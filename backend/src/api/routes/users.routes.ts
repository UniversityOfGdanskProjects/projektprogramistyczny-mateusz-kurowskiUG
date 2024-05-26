import { type Request, type Response, Router } from "express";
import { emailRegex, passwordRegex } from "../../data/regex";
import db from "../../db/connect";
import type INewUser from "../../interfaces/user/INewUser";
import { query, body, validationResult, matchedData } from "express-validator";
import { createId } from "@paralleldrive/cuid2";
import UsersDB from "../../db/users/users";
import {
	deleteUserValidator,
	newUserValidator,
} from "../middleware/validators/user-validators";
import { Hono } from "hono";

const usersRouter = new Hono();

usersRouter.post(
	"/register",

	newUserValidator(),

	async (c) => {
		const { email, password }: { email: string; password: string } =
			c.req.valid("json");
		// check if user exists
		const userExists = await UsersDB.doesUserExist(email);

		if (userExists)
			return c.json({ msg: "User already exists", result: false }, 400);

		const id = createId();
		const newUser: INewUser = {
			id,
			email,
			password,
			role: "user",
		};
		const registerResult = await UsersDB.createUser(newUser);
		if (!registerResult.result || !registerResult.data)
			return c.json(registerResult, 200);

		return c.json({ msg: registerResult.msg, data: { id, email } }, 200);
	},
);

// usersRouter.post("/login", async (request: Request, res: Response) => {
// 	const { email, password } = request.body;
// 	if (!email || !password) {
// 		return res.status(400).json({ msg: "Please enter all fields" });
// 	}

// 	const loginResult = await db.loginUser(email.trim(), password.trim());
// 	if (!loginResult?.result) {
// 		return res.status(400).json({ msg: "User does not exist" });
// 	}

// 	return res.status(200).json(loginResult);
// });
// todo: Delete ???
// usersRouter.get("/profile/:id", async (request: Request, res: Response) => {
// 	const { id } = request.params;
// 	if (!id) {
// 		return res.status(400).json({ msg: "Please enter all fields" });
// 	}

// 	const profileResult = await db.getUserProfile(id);
// 	if (!profileResult.result) {
// 		return res.status(400).json(profileResult);
// 	}

// 	return res.status(200).json(profileResult);
// });
// todo: implement with express validation and lodash, change do patch
// usersRouter.put("/profile", async (request: Request, res: Response) => {
// 	const { id, name, password, email, role, new_password } = request.body;
// 	if (!id) {
// 		return res.status(400).json({ msg: "Please enter userId" });
// 	}

// 	if (!name && !password && !email) {
// 		return res.status(400).json({ msg: "Please enter all fields" });
// 	}

// 	const updateProfileResult = await db.updateUserProfile({
// 		id,
// 		password,
// 		email,
// 		role,
// 		new_password,
// 	});
// 	if (role) {
// 		return res.status(403).json({ msg: "Updating role is not permitted" });
// 	}

// 	if (!updateProfileResult.result) {
// 		return res.status(400).json(updateProfileResult);
// 	}

// 	return res.status(200).json(updateProfileResult);
// });
// todo: overall stats of user
// usersRouter.get("/:id/stats", async (request: Request, res: Response) => {
// 	const { id } = request.params;
// 	if (!id) {
// 		return res.status(400).json({ msg: "Please enter all fields" });
// 	}

// 	const statsResult = await db.getUserStats(id);
// 	if (!statsResult.result) {
// 		return res.status(400).json(statsResult);
// 	}

// 	return res.status(200).json(statsResult);
// });

usersRouter.delete("/:id", deleteUserValidator(), async (c) => {
	const { id } = c.req.valid("param");
	const deleteResult = await UsersDB.deleteUser(id);
	return c.json(deleteResult, 200);
});

export default usersRouter;
