import { Request, Response, Router } from "express";
import db from "../../db/connect";
import newUserInterface from "../../interfaces/newUser";
import MovieInterface from "../../interfaces/Movie";
import uuidv4 from "uuid";
const adminRouter = Router();
adminRouter.use((req: Request, res: Response, next) => {
  // TODO: Check if user is admin
  next();
});
adminRouter.get("/users", async (req: Request, res: Response) => {
  const users = await db.getUsers();
  if (!users) return res.status(400).json(users);
  return res.status(200).send(users);
});
adminRouter.put("/users/:id", async (req: Request, res: Response) => {});
adminRouter.post("/movies", async (req: Request, res: Response) => {
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
    genres,
  } = req.body;
  if (
    !title ||
    !release_date ||
    !poster_path ||
    !backdrop_path ||
    !popularity ||
    !adult === undefined ||
    !budget ||
    !status ||
    TMDBId === undefined ||
    !genres
  ) {
    return res
      .status(400)
      .json({ result: false, msg: "Please enter all fields" });
  }
  const newMovie: MovieInterface = {
    id: crypto.randomUUID(),
    title,
    release_date,
    poster_path,
    backdrop_path,
    popularity,
    adult,
    budget,
    status,
    TMDBId,
  };
  const movie = await db.createMovie(newMovie, genres);
  if (!movie.result) return res.status(400).json(movie);
  return res.status(200).send(movie);
});
adminRouter.put("/movies/:movieId", async (req: Request, res: Response) => {
  const { movieId } = req.params;
  if (!movieId) return res.status(400).json({ msg: "Please enter movieId" });
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
    genres,
  } = req.body;
  if (
    !title ||
    !release_date ||
    !poster_path ||
    !backdrop_path ||
    !popularity ||
    !adult === undefined ||
    !budget ||
    !status ||
    TMDBId === undefined ||
    !genres
  ) {
    return res
      .status(400)
      .json({ result: false, msg: "Please enter all fields" });
  }
  const updatedMovie: MovieInterface = {
    id: crypto.randomUUID(),
    title,
    release_date,
    poster_path,
    backdrop_path,
    popularity,
    adult,
    budget,
    status,
    TMDBId,
  };
  const updated = await db.updateMovie(movieId, updatedMovie);
  if (!updated.result) return res.status(400).json(updated);
  return res.status(200).send(updated);
});
adminRouter.delete("/movies/:movieId", async (req: Request, res: Response) => {
  const { movieId } = req.params;
  if (!movieId)
    return res
      .status(400)
      .json({ result: false, msg: "Please enter all fields" });
  const movie = await db.deleteMovie(movieId);
  if (!movie) return res.status(400).json(movie);
  return res.status(200).send(movie);
});
export default adminRouter;
