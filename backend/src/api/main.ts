import TMDBRouter from "./routes/TMDB.routes";
import adminRouter from "./routes/admin.routes";
import castRouter from "./routes/cast.routes";
import moviesRouter from "./routes/movies.routes";
import playlistsRouter from "./routes/playlists.routes";
import usersRouter from "./routes/users.routes";
import watchlistRouter from "./routes/watchlist.routes";
import { Hono } from "hono";

const app = new Hono({ strict: true }).basePath("/api");
// app.route("/users", usersRouter);
// app.route("/tmdb/movies", TMDBRouter);
// app.route("/watchlist", watchlistRouter);
// app.route("/playlists", playlistsRouter);
app.route("/movies", moviesRouter);
app.route("/admin", adminRouter);
// app.route("/cast", castRouter);

app.get("/api/recommendations", (c) => c.text("Recommendations", 200));

app.notFound((c) => c.text("Not Found", 404));
app.onError((err, c) => {
	console.error(`${err}`);
	return c.text("Custom Error Message", 500);
});
export default app;
