import express from "express";
import cors from "cors";
import usersRouter from "./routes/users.routes";
import TMDBRouter from "./routes/TMDB.routes";
import watchlistRouter from "./routes/watchlist.routes";
import playlistsRouter from "./routes/playlists.routes";
import moviesRouter from "./routes/movies.routes";
import adminRouter from "./routes/admin.routes";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use("/api/users", usersRouter);
app.use("/api/tmdb/movies", TMDBRouter);
app.use("/api/watchlist", watchlistRouter);
app.use("/api/playlists", playlistsRouter);
app.use("/api/movies", moviesRouter);
app.use("/api/admin", adminRouter);

app.get("/api/recommendations", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
