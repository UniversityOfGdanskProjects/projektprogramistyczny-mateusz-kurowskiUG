import { validator } from "hono/validator";
import { z } from "zod";

const passwordRegex =
	/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%.*?&])[A-Za-z\d@$!.%*?&]{8,}$/;

const newUserSchema = z.object({
	email: z.string().email(),
	password: z.string().regex(passwordRegex),
});

const delteUserSchema = z.object({
	id: z.string().cuid2(),
});

export const newUserValidator = () =>
	validator("json", (value, c) => {
		const parsed = newUserSchema.safeParse(value);
		if (!parsed.success)
			return c.json({ msg: "Invalid email or password" }, 400);
		return parsed.data;
	});

export const deleteUserValidator = () =>
	validator("param", (value, c) => {
		const parsed = delteUserSchema.safeParse(value);
		if (!parsed.success) return c.json({ msg: "Invalid user id " }, 400);
		return parsed.data;
	});
