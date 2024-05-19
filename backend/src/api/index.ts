import bodyParser from "body-parser";
import cors from "cors";
import express, { type Request, type Response } from "express";
import TMDBRouter from "./routes/TMDB.routes";
import adminRouter from "./routes/admin.routes";
import castRouter from "./routes/cast.routes";
import moviesRouter from "./routes/movies.routes";
import playlistsRouter from "./routes/playlists.routes";
import usersRouter from "./routes/users.routes";
import watchlistRouter from "./routes/watchlist.routes";

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// app.use("/api/users", usersRouter);
// app.use("/api/tmdb/movies", TMDBRouter);
// app.use("/api/watchlist", watchlistRouter);
// app.use("/api/playlists", playlistsRouter);
// app.use("/api/movies", moviesRouter);
app.use("/api/admin", adminRouter);
// app.use("/api/cast", castRouter);

app.get("/api/recommendations", (request: Request, res: Response) => {
	res.send("Hello World!");
});

export default app;
