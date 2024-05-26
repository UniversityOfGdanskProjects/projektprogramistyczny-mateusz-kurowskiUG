import db from "../../db/connect";
import INewUser from "../../interfaces/user/INewUser";
import { Hono } from "hono";
import { addToWatchlistValidator } from "../middleware/validators/watchlist-validators";
import Watchlist from "../../db/watchlists/watchlist";
import idParamValidator, {
	movieIdParamValidator,
	userIdParamValidator,
} from "../middleware/validators/id-param-validator";

// TODO: TEST THIS FILE
const watchlistRouter = new Hono();

watchlistRouter.post("/", addToWatchlistValidator(), async (c) => {
	const { userId, movieId } = c.req.valid("json");

	const watchlistResult = await Watchlist.addToWatchlist(userId, movieId);
	if (!watchlistResult.result) return c.json(watchlistResult, 400);

	return c.json(watchlistResult, 200);
});

// INFO: This is user ID below in the slug.
watchlistRouter.get("/:userId", userIdParamValidator(), async (c) => {
	const { userId } = c.req.valid("param");

	const watchlistResult = await Watchlist.getWatchlist(userId);
	if (!watchlistResult.result) return c.json(watchlistResult, 400);

	return c.json(watchlistResult, 200);
});
watchlistRouter.delete(
	"/:userId/:movieId:",
	userIdParamValidator(),
	movieIdParamValidator(),
	async (c) => {
		const { userId, movieId } = c.req.valid("param");

		const watchlistResult = await db.deleteFromWatchlist(userId, movieId);
		if (!watchlistResult.result) return c.json(watchlistResult, 400);

		return c.json(watchlistResult, 200);
	},
);
export default watchlistRouter;
