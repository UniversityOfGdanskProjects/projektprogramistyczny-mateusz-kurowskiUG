import _ from "lodash";

import type IMovie from "../../interfaces/movie/IMovie";
import { createId, isCuid } from "@paralleldrive/cuid2";
import UsersDB from "../../db/users/users";
import MoviesDB from "../../db/movies/movies";
import { Hono } from "hono";
import {
	addMovieBodyValidator,
	deleteMovieParamsValidator,
	updateMovieBodyValidator,
} from "../middleware/validators/adminValidators";
import type { IMovieUpdate } from "../../interfaces/movie/IMovieUpdate";

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
		genres,
		overview: overview || null,
	};
	const movie = await MoviesDB.createMovie(newMovie);
	if (!movie.result) return c.json(movie, 400);

	return c.json(movie, 201);
});
adminRouter.patch("/movies/:id", updateMovieBodyValidator(), async (c) => {
	const { id } = c.req.param();
	if (!id || isCuid(id)) return c.json({ msg: "Invalid movie ID" }, 400);
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
	}return c.json(updated, 200);
});
adminRouter.delete("/movies/:id", deleteMovieParamsValidator(), async (c) => {
	const { id } = c.req.valid("param");

	const movie = await MoviesDB.deleteMovie(id);
	if (!movie?.result) {
		return c.json(movie, 400);
	}

	return c.json(movie, 200);
});
export default adminRouter;
