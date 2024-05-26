import { validator } from "hono/validator";
import { z } from "zod";

const userIdValidationSchema = z.object(
	{
		userId: z.string().cuid2("Invalid ID provided"),
	},
	{ message: "Invalid ID provided" },
);
const movieIdValidationSchema = z.object(
	{
		movieId: z.string().cuid2("Invalid ID provided"),
	},
	{ message: "Invalid ID provided" },
);

export const userIdParamValidator = () =>
	validator("param", (value, c) => {
		const parsed = userIdValidationSchema.safeParse(value);
		if (!parsed.success)
			return c.json({ message: `invalid param: id ${parsed.error}` }, 400);
		return parsed.data;
	});
export const movieIdParamValidator = () =>
	validator("param", (value, c) => {
		const parsed = movieIdValidationSchema.safeParse(value);
		if (!parsed.success)
			return c.json({ message: `invalid param: id ${parsed.error}` }, 400);
		return parsed.data;
	});
