import { validator } from "hono/validator";
import { z } from "zod";

const passwordRegex =
	/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%.*?&])[A-Za-z\d@$!.%*?&]{8,}$/;

const newUserSchema = z.object({
	email: z.string().email(),
	password: z.string().regex(passwordRegex),
});

export const newUserValidator = () =>
	validator("json", (value, c) => {
		const parsed = newUserSchema.safeParse(value);
		if (!parsed.success) return c.json({ msg: "Invalid input" }, 400);
		return parsed.data;
	});
