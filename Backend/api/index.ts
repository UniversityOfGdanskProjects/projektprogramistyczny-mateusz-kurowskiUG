import express, { Router } from "express";
import cors from "cors";
import usersRouter from "./routes/users.routes";
import TMDBRouter from "./routes/TMDB.routes";
import watchlistRouter from "./routes/watchlist.routes";
import playlistsRouter from "./routes/playlists.routes";
import moviesRouter from "./routes/movies.routes";
import adminRouter from "./routes/admin.routes";

const app = express();
const port = 3000;
app.use(cors());
const router = Router();
router.use("/api/users", usersRouter);
router.use("/api/tmdb", TMDBRouter);
router.use("/api/watchlist", watchlistRouter);
router.use("/api/playlists", playlistsRouter);
router.use("/api/movies", moviesRouter);
router.use("/api/admin", adminRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.get("/api/recommendations", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
