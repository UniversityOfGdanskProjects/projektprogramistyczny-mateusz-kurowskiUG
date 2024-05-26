import { validator } from "hono/validator";
import { z } from "zod";

const paginatedMoviesSchema = z.object({
	pageSize: z.string().optional().default("10"),
	pageNumber: z.string().optional().default("1"),
});

const getMovieSchema = z.object({
	id: z.string().cuid2(),
});

export const moviesPaginatedValidator = () =>
	validator("query", (value, c) => {
		const result = paginatedMoviesSchema.safeParse(value);
		if (!result.success) return c.json(result.error, 400);
		return result.data;
	});

export const getMovieValidator = () =>
	validator("param", (value, c) => {
		const result = getMovieSchema.safeParse(value);
		if (!result.success) return c.json(result.error, 400);
		return result.data;
	});
