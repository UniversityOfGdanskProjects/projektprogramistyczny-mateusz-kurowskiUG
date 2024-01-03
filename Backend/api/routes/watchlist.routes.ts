import { Request, Response, Router } from "express";
import db from "../../db/connect";
import newUserInterface from "../../interfaces/newUser";
const watchlistRouter = Router();
watchlistRouter.post("/", async (req: Request, res: Response) => {
  const { userId, movieId } = req.body;
  if (!userId || !movieId) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  const watchlistResult = await db.addToWatchlist(userId, movieId);
  if (!watchlistResult.result) {
    return res.status(400).json(watchlistResult);
  }
  return res.status(200).json(watchlistResult);
});
watchlistRouter.get("/", async (req: Request, res: Response) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  const watchlistResult = await db.getWatchlist(userId);
  if (!watchlistResult.result) {
    return res.status(400).json(watchlistResult);
  }
  return res.status(200).json(watchlistResult);
});
watchlistRouter.delete("/:id", async (req: Request, res: Response) => {
  const movieId = req.params.id;
  const { userId } = req.body;
  if (!userId || !movieId) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  const watchlistResult = await db.deleteFromWatchlist(userId, movieId);
  if (!watchlistResult.result) {
    return res.status(400).json(watchlistResult);
  }
  return res.status(200).json(watchlistResult);
});
export default watchlistRouter;
