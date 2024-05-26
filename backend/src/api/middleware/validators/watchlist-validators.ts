import { validator } from "hono/validator";
import { z } from "zod";

const watchlistBodySchema = z.object({
	userId: z.string().cuid2(),
	movieId: z.string().cuid2(),
});

export const addToWatchlistValidator = () =>
	validator("json", (value, c) => {
		const result = watchlistBodySchema.safeParse(value);
		if (!result.success) return c.json("Invalid body", 400);

		return result.data;
	});
