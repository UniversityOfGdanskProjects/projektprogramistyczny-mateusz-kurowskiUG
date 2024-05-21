import { type Request, type Response, Router } from "express";
import { emailRegex, passwordRegex } from "../../data/regex";
import db from "../../db/connect";
import type INewUser from "../../interfaces/user/INewUser";
import { query, body, validationResult, matchedData } from "express-validator";
import { newEmailChain, newPasswordChain } from "../../validation/usersChains";
import { createId } from "@paralleldrive/cuid2";
import UsersDB from "../../db/users/users";

const usersRouter = Router();

usersRouter.post(
	"/register",
	newEmailChain(),
	newPasswordChain(),

	async (request: Request, res: Response) => {
		const validationErrors = validationResult(request);
		if (!validationErrors.isEmpty())
			return res.status(400).send({ msg: "Invalid input" });
		const { email, password }: { email: string; password: string } =
			matchedData(request);
		// check if user exists
		const userExists = await UsersDB.doesUserExist(email);

		if (userExists)
			return res
				.status(400)
				.send({ msg: "User already exists", result: false });

		const id = createId();
		const newUser: INewUser = {
			id,
			email,
			password,
			role: "user",
		};
		const registerResult = await UsersDB.createUser(newUser);
		if (!registerResult.result || !registerResult.data)
			return res.status(400).send(registerResult);

		return res
			.status(200)
			.send({ msg: registerResult.msg, data: { id, email } });
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

export default usersRouter;
