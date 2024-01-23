import { Request, Response, Router } from "express";
import db from "../../db/connect";
const moviesRouter = Router();
moviesRouter.get("/", async (req: Request, res: Response) => {
  const movies = await db.getAllMovies();
  if (!movies.result) {
    return res.status(400).send(movies);
  }
  return res.status(200).send(movies);
});
moviesRouter.get("/random", async (req: Request, res: Response) => {
  const movies = await db.getFiveRandomMovies();
  if (!movies) return res.status(400).send(movies);
  return res.status(200).send(movies);
});

moviesRouter.get("/page/:pageNumber", async (req: Request, res: Response) => {
  const { pageNumber } = req.params;
  const movies = await db.getAllMovies();
  if (!movies.result) {
    return res.status(400).send(movies);
  }
  const page = movies.data?.slice((+pageNumber - 1) * 10, +pageNumber * 10);
  if (!page) {
    return res.status(400).send({ result: false, message: "Invalid page" });
  }
  return res.status(200).send({ result: true, data: page });
});
moviesRouter.get("/:movieId", async (req: Request, res: Response) => {
  const { movieId } = req.params;
  if (!movieId) {
    return res.status(400).send({ result: false, message: "Invalid movieId" });
  }
  const movie = await db.getMovieByTMDBId(+movieId);
  if (!movie.result) {
    return res.status(400).send(movie);
  }
  return res.status(200).send(movie);
});

moviesRouter.post("/:movieId/reviews", async (req: Request, res: Response) => {
  const { movieId } = req.params;
  if (!movieId) {
    return res.status(400).send({ message: "Invalid movieId" });
  }
  const { content, rating, userId } = req.body;
  const numRating = +rating;
  if (
    !content ||
    !numRating ||
    !userId ||
    numRating < 0 ||
    numRating > 10 ||
    content.length < 10 ||
    content.length > 500
  ) {
    return res
      .status(400)
      .send({ message: "Invalid content, rating or userId" });
  }
  const review = await db.addReview({
    userId,
    movieId,
    content,
    rating: numRating,
  });
  if (!review.result) {
    return res.status(400).send(review);
  }
  return res.status(200).send(review);
});
moviesRouter.get("/:movieId/reviews", async (req: Request, res: Response) => {
  const { movieId } = req.params;
  if (!movieId) {
    return res.status(400).send({ result: false, message: "Invalid movieId" });
  }
  const reviews = await db.getReviewsByMovie(+movieId);
  if (!reviews.result) {
    return res.status(400).send(reviews);
  }
  return res.status(200).send(reviews);
});
moviesRouter.delete(
  "/:movieId/reviews/:reviewId",
  async (req: Request, res: Response) => {
    const { movieId, reviewId } = req.params;
    if (!movieId || !reviewId) {
      return res
        .status(400)
        .send({ result: false, message: "Invalid movieId or reviewId" });
    }
    const review = await db.deleteReview(movieId, reviewId);
    if (!review.result) {
      return res.status(400).send(review);
    }
    return res.status(200).send(review);
  }
);

export default moviesRouter;
