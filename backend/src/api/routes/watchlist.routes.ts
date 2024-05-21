import { type Request, type Response, Router } from "express";
import db from "../../db/connect";
import INewUser from "../../interfaces/user/INewUser";

const watchlistRouter = Router();
watchlistRouter.post("/", async (request: Request, res: Response) => {
	const { userId, movieId } = request.body;
	if (!userId || !movieId) {
		return res.status(400).json({ msg: "Please enter all fields" });
	}

	const watchlistResult = await db.addToWatchlist(userId, movieId);
	if (!watchlistResult.result) {
		return res.status(400).json(watchlistResult);
	}

	return res.status(200).json(watchlistResult);
});
watchlistRouter.get("/:userId", async (request: Request, res: Response) => {
	const { userId } = request.params;
	if (!userId) {
		return res.status(400).json({ msg: "Please enter all fields" });
	}

	const watchlistResult = await db.getWatchlist(userId);
	if (!watchlistResult.result) {
		return res.status(400).json(watchlistResult);
	}

	return res.status(200).json(watchlistResult);
});
watchlistRouter.delete("/:id", async (request: Request, res: Response) => {
	const movieId = request.params.id;
	const { userId } = request.body;
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
