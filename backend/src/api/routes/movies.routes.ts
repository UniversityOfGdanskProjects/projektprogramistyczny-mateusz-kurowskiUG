import { type Request, type Response, Router } from "express";
import db from "../../db/connect";
import MoviesDB from "../../db/movies/movies";
import IMovie from "../../interfaces/movie/IMovie";
import { createId, isCuid } from "@paralleldrive/cuid2";
import IReview from "../../interfaces/review/IReview";
import type INewReview from "../../interfaces/review/INewReview";
import { Hono } from "hono";
import {
	getMovieValidator,
	moviesPaginatedValidator,
} from "../middleware/validators/movieValidators";

const moviesRouter = new Hono();
moviesRouter.get("/", async (c) => {
	const movies = await MoviesDB.getAllMovies();
	if (!movies.result) return c.json(movies, 400);

	return c.json(movies, 200);
});

moviesRouter.get("/page", moviesPaginatedValidator(), async (c) => {
	const { pageNumber, pageSize } = c.req.valid("query");

	const moviesResponse = await MoviesDB.getPaginatedMovies(
		+pageNumber,
		+pageSize,
	);
	if (!moviesResponse.result || !moviesResponse.data)
		return c.json(moviesResponse, 400);
	return c.json(moviesResponse, 200);
});

moviesRouter.get("/:id", getMovieValidator(), async (c) => {
	const { id } = c.req.param();
	if (!isCuid(id)) return c.json({ result: false, message: "Invalid id" }, 400);
	const trimmedId = id.trim();
	if (!trimmedId) return c.json({ result: false, message: "Invalid id" }, 400);

	const movie = await MoviesDB.getMovieById(id);
	if (!movie.result) return c.json(movie, 400);

	return c.json(movie, 200);
});
//todo: add a review to a movie
moviesRouter.post("/:id/reviews", async (c) => {
	const { id } = c.req.param();
	if (!id || !isCuid(id)) return c.json({ message: "Invalid movieId" }, 400);

	const { content, rating, userId } = await c.req.json();
	const numberRating = Number.parseInt(rating, 10);
	if (
		!content ||
		!numberRating ||
		!userId ||
		numberRating < 0 ||
		numberRating > 10 ||
		content.length < 10 ||
		content.length > 256
	)
		return c.json({ message: "Invalid content, rating or userId" }, 400);

	const newReview: INewReview = {
		id: createId(),
		content,
		rating: numberRating,
		userId,
	};

	const review = await MoviesDB.addAReview(id, newReview);
	if (!review.result) return c.json(review, 400);

	return c.json(review, 200);
});
// moviesRouter.get(
// 	"/:movieId/reviews",
// 	async (request: Request, res: Response) => {
// 		const { movieId } = request.params;
// 		if (!movieId) {
// 			return res
// 				.status(400)
// 				.send({ result: false, message: "Invalid movieId" });
// 		}

// 		const reviews = await db.getReviewsByMovie(Number(movieId));
// 		if (!reviews.result) {
// 			return res.status(400).send(reviews);
// 		}

// 		return res.status(200).send(reviews);
// 	},
// );
// moviesRouter.delete(
// 	"/:movieId/reviews/:reviewId",
// 	async (request: Request, res: Response) => {
// 		const { movieId, reviewId } = request.params;
// 		if (!movieId || !reviewId) {
// 			return res
// 				.status(400)
// 				.send({ result: false, message: "Invalid movieId or reviewId" });
// 		}

// 		const review = await db.deleteReview(movieId, reviewId);
// 		if (!review.result) {
// 			return res.status(400).send(review);
// 		}

// 		return res.status(200).send(review);
// 	},
// );

export default moviesRouter;
