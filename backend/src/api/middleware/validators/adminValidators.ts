import { validator } from "hono/validator";
import { z } from "zod";
const newMovieSchema = z.object(
	{
		title: z.string(),
		release_date: z.string().optional().nullable(),
		poster_path: z.string().optional().nullable(),
		backdrop_path: z.string().optional().nullable(),
		popularity: z.number().optional().nullable(),
		adult: z.boolean(),
		budget: z.number().optional().nullable(),
		status: z.string().optional().nullable(),
		TMDBId: z.number().optional().nullable(),
		genres: z.array(z.string()).optional().nullable(),
		overview: z.string().optional().nullable(),
	},
	{ message: "Invalid movie data" },
);

const updateMovieSchema = z.object(
	{
		title: z.string().optional().nullable(),
		release_date: z.string().optional().nullable(),
		poster_path: z.string().optional().nullable(),
		backdrop_path: z.string().optional().nullable(),
		popularity: z.number().optional().nullable(),
		adult: z.boolean().optional().nullable(),
		budget: z.number().optional().nullable(),
		status: z.string().optional().nullable(),
		TMDBId: z.number().optional().nullable(),
		overview: z.string().optional().nullable(),
	},
	{ message: "Invalid movie data" },
);

const deleteMovieSchema = z.object(
	{
		id: z.string().cuid2("Invalid movie ID"),
	},
	{ message: "Invalid movie ID" },
);

export const addMovieBodyValidator = () =>
	validator("json", (value, c) => {
		const parsed = newMovieSchema.safeParse(value);
		if (!parsed.success)
			return c.json({ message: `Invalid body ${parsed.error}` }, 400);
		return parsed.data;
	});

export const updateMovieBodyValidator = () =>
	validator("json", (value, c) => {
		const parsed = updateMovieSchema.safeParse(value);
		if (!parsed.success)
			return c.json({ message: `Invalid body ${parsed.error}` }, 400);
		return parsed.data;
	});

export const deleteMovieParamsValidator = () =>
	validator("param", (value, c) => {
		const parsed = deleteMovieSchema.safeParse(value);
		if (!parsed.success)
			return c.json({ message: `invalid param: id ${parsed.error}` }, 400);
		return parsed.data;
	});
