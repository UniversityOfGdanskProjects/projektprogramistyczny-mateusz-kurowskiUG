import { validator } from "hono/validator";
import { z } from "zod";

const newPlaylistSchema = z.object({
	userId: z.string().cuid2(),
	name: z.string().min(3).max(20),
});

export const newPlaylistValidator = () =>
	validator("json", (value, c) => {
		const result = newPlaylistSchema.safeParse(value);
		if (!result.success) return c.json("Invalid body", 400);

		return result.data;
	});
