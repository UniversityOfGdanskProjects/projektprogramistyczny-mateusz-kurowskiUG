import { type Request, type Response, Router } from "express";
import db from "../../db/connect";
import MoviesDB from "../../db/movies/movies";
import IMovie from "../../interfaces/movie/IMovie";
import { createId, isCuid } from "@paralleldrive/cuid2";
import IReview from "../../interfaces/review/IReview";
import INewReview from "../../interfaces/review/INewReview";

const moviesRouter = Router();
moviesRouter.get("/", async (request: Request, res: Response) => {
	const movies = await MoviesDB.getAllMovies();
	if (!movies.result) return res.status(400).send(movies);

	return res.status(200).send(movies);
});

moviesRouter.get("/page", async (request: Request, res: Response) => {
	const { pageNumber, pageSize } = request.query;
	const page = Number.parseInt(pageNumber as string, 10) || 1;
	const size = Number.parseInt(pageSize as string, 10) || 10;
	const moviesResponse = await MoviesDB.getAllMovies();
	if (!moviesResponse.result || !moviesResponse.data)
		return res.status(400).send(moviesResponse);
	const movies = moviesResponse.data.slice((page - 1) * size, page * size);
	if (!page)
		return res.status(400).send({ result: false, message: "Invalid page" });

	return res
		.status(200)
		.send({ result: true, data: movies, message: "Movies found" });
});

moviesRouter.get("/:id", async (request: Request, res: Response) => {
	const { id } = request.params;
	if (!isCuid(id))
		return res.status(400).send({ result: false, message: "Invalid id" });
	const trimmedId = id.trim();
	if (!trimmedId)
		return res.status(400).send({ result: false, message: "Invalid id" });

	const movie = await MoviesDB.getMovieById(id);
	if (!movie.result) return res.status(400).send(movie);

	return res.status(200).send(movie);
});

moviesRouter.post("/:id/reviews", async (request: Request, res: Response) => {
	const { id } = request.params;
	if (!id || !isCuid(id))
		return res.status(400).send({ message: "Invalid movieId" });

	const { content, rating, userId, email } = request.body;
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
		return res
			.status(400)
			.send({ message: "Invalid content, rating or userId" });

	const newReview: INewReview = {
		id: createId(),
		content,
		rating: numberRating,
		userId,
	};

	const review = await MoviesDB.addAReview(id, newReview);
	if (!review.result) return res.status(400).send(review);

	return res.status(200).send(review);
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
