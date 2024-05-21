import { body } from "express-validator";

export const newEmailChain = () => body("email").isString().isEmail().escape();

export const newPasswordChain = () =>
	body("password")
		.isString()
		.trim()
		.isStrongPassword({
			minNumbers: 1,
			minSymbols: 1,
			minUppercase: 1,
			minLowercase: 1,
		})
		.escape();
