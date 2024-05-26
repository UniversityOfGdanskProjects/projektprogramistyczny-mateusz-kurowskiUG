import _ from "lodash";

import type IMovie from "../../interfaces/movie/IMovie";
import { createId, isCuid } from "@paralleldrive/cuid2";
import UsersDB from "../../db/users/users";
import MoviesDB from "../../db/movies/movies";
import { Hono } from "hono";
import {
	addMovieBodyValidator,
	updateMovieBodyValidator,
} from "../middleware/validators/admin-validators";
import idValidator, {
	idParamValidator,
} from "../middleware/validators/id-param-validator";
import type IMovieUpdate from "../../interfaces/movie/IMovieUpdate";

const adminRouter = new Hono();
adminRouter.get("/users", async (c) => {
	const users = await UsersDB.getUsers();
	if (!users) return c.json({ result: false, msg: "No users found" }, 400);

	return c.json(users);
});

adminRouter.post("/movies", addMovieBodyValidator(), async (c) => {
	const {
		title,
		adult,
		genres,
		TMDBId,
		backdrop_path,
		budget,
		overview,
		popularity,
		poster_path,
		release_date,
		status,
	} = c.req.valid("json");
	// undefined is fine for me, but not for neo4j driver, so null instead of it.
	const newMovie: IMovie = {
		id: createId(),
		title,
		release_date: release_date || null,
		poster_path: poster_path || null,
		backdrop_path: backdrop_path || null,
		popularity: popularity || null,
		adult,
		budget: budget || null,
		status: status || null,
		TMDBId: TMDBId || null,
		genres: genres || null,
		overview: overview || null,
	};
	const movie = await MoviesDB.createMovie(newMovie);
	if (!movie.result) return c.json(movie, 400);

	return c.json(movie, 201);
});
adminRouter.patch(
	"/movies/:id",
	updateMovieBodyValidator(),
	idParamValidator(),
	async (c) => {
		const { id } = c.req.valid("param");
		const {
			title,
			release_date,
			poster_path,
			backdrop_path,
			popularity,
			adult,
			budget,
			status,
			TMDBId,
			overview,
		} = await c.req.valid("json");
		const updatedMovie: IMovieUpdate = {
			id,
			title: title || null,
			release_date: release_date || null,
			poster_path: poster_path || null,
			backdrop_path: backdrop_path || null,
			popularity: popularity || null,
			adult: adult || null,
			budget: budget || null,
			status: status || null,
			TMDBId: TMDBId || null,
			overview: overview || null,
		};
		const movieValues = _.values(updatedMovie).slice(1);
		if (movieValues.every((value) => !value))
			return c.json(
				{ result: false, msg: "Please add some fields to replace" },
				400,
			);

		const updated = await MoviesDB.updateMovie(updatedMovie);
		if (!updated.result) return c.json(updated, 400);

		return c.json(updated, 200);
	},
);
adminRouter.delete("/movies/:id", idParamValidator(), async (c) => {
	const { id } = c.req.valid("param");

	const movie = await MoviesDB.deleteMovie(id);
	if (!movie.result) return c.json(movie, 400);

	return c.json(movie, 200);
});
export default adminRouter;
