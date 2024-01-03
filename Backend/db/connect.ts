import Neode, { Model, Node, NodeCollection, Relationship } from "neode";
import dotenv, { parse } from "dotenv";
import Envs from "../interfaces/envs";
import userSchema from "./models/User";
import { v4 as uuidv4 } from "uuid";
import newUserInterface from "../interfaces/newUser";
// import UserInterface from "../interfaces/User";
import { createHash, Hash } from "crypto";
import DBResponse from "../interfaces/DBResponse";
// import jwt from "jsonwebtoken";
import { emailRegex } from "../data/regex";
import Axios from "axios";
import watchlistSchema from "./models/Watchlist";
import testMovies from "../data/movie_ids_test.json";
import movieSchema from "./models/Movie";
import Movie from "../interfaces/Movie";
import { json } from "express";

class Db {
  instance: Neode;
  envs: Envs;
  users: Model<User>;
  watchlists: Model<Watchlist>;
  movies: Model<Movie>;
  hash: Hash;
  regex: RegExp = emailRegex;
  tmdbHeaders = {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYjAxMzkxMjUxNjBjMTQzYWE5ZmUzZDgwYTA1YzQ5ZCIsInN1YiI6IjY1N2Y3NzI5NTI4YjJlMDcyNDNiMGViZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.-96365PpSY8BgLFO7CRfNrx8NBk1mXLiI_ycHcSOsKU",
  };
  constructor() {
    this.hash = createHash("sha256");
    this.getEnvs();
    this.setUp();
    this.dropAll().then(() => {
      this.loadTestMovies();
    });
  }

  async dropAll(): Promise<boolean> {
    this.users.deleteAll();
    this.watchlists.deleteAll();
    this.movies.deleteAll();
    return true;
  }

  async addToWatchlist(userId: string, movieId): Promise<DBResponse> {
    const user = await this.users.find(userId);
    if (!user) return { result: false, msg: "User not found" };
    const movie = await this.movies.find(movieId);
    if (!movie) return { result: false, msg: "Movie not found" };
    const watchlist_rel: Relationship = await user.get("watchlist");
    const watchlist: Node<Watchlist> = watchlist_rel.endNode();
    const result = await watchlist.relateTo(movie, "has");
    if (!result) return { result: false, msg: "Already in watchlist" };
    return {
      result: true,
      data: [
        {
          movie: await movie.toJson(),
          watchlist: await watchlist.toJson(),
        },
      ],
      msg: `Movie ${movie.get("title")} Added to watchlist`,
    };
  }

  async loadTestMovies(): void {
    const moviesIds = testMovies.map((movie) => movie.id);
    moviesIds.forEach((id) => {
      this.getTmdbMById(id).then(async (res) => {
        const movie = this.TmdbToMovie(res.data);
        await this.createMovie(movie);
      });
    });
  }

  TmdbToMovie(tmdbMovie: any): Movie {
    const movie: Movie = {
      id: uuidv4(),
      title: tmdbMovie.title,
      // overview: tmdbMovie.overview || "",
      popularity: tmdbMovie.popularity,
      release_date: tmdbMovie.release_date,
      poster_path: tmdbMovie.poster_path,
      adult: tmdbMovie.adult,
      backdrop_path: tmdbMovie.backdrop_path,
      budget: tmdbMovie.budget,
      status: tmdbMovie.status,
    };
    return movie;
  }

  getEnvs() {
    dotenv.config();
    const envs = {
      TMDB_ACCESS_TOKEN: process.env.TMDB_ACCESS_TOKEN || "",
      API_KEY: process.env.API_KEY || "",
      NEO4J_URI: process.env.NEO4J_URI || "",
      NEO4J_USERNAME: process.env.NEO4J_USERNAME || "",
      NEO4J_PASSWORD: process.env.NEO4J_PASSWORD || "",
    };
    this.envs = envs;
  }
  loadModels() {
    this.users = this.instance.model("User", userSchema);
    this.watchlists = this.instance.model("Watchlist", watchlistSchema);
    this.movies = this.instance.model("Movie", movieSchema);
  }

  setUp() {
    this.instance = new Neode(
      this.envs.NEO4J_URI,
      this.envs.NEO4J_USERNAME,
      this.envs.NEO4J_PASSWORD
    );
    this.loadModels();
  }

  async getUsers(): Promise<DBResponse> {
    const users = await (await this.users.all()).toJson();
    return { result: true, data: users };
  }

  async createUser(user: newUserInterface): Promise<DBResponse> {
    const id = uuidv4();
    if (!this.regex.test(user.email)) {
      return { result: false, msg: "Invalid email" };
    }
    const foundEmail = (await this.users.all({ email: user.email })).length;
    if (foundEmail) {
      return { result: false, msg: "User already exists" };
    }
    const hashedPassword = createHash("sha256")
      .update(user.password)
      .digest("hex");

    const newUser = { ...user, id, password: hashedPassword };
    const createdUser = await this.users.create(newUser);
    const userResponse = await createdUser.toJson();
    const watchlist = await this.createWatchlist(createdUser);

    return {
      result: true,
      data: [userResponse, watchlist.data],
      msg: "User created",
    };
  }
  async createWatchlist(userNode: Node<User>): Promise<DBResponse> {
    const id = uuidv4();
    const watchlist = await this.watchlists.create({ id });
    await userNode.relateTo(watchlist, "watchlist");
    return { result: true, data: watchlist, msg: "Watchlist created" };
  }

  async loginUser(email: string, password: string): Promise<DBResponse> {
    const user = await (await this.users.all({ email })).first();
    if (!user) {
      return { result: false, msg: "Wrong email or password" };
    }
    if (user.get("password") !== this.hash.update(password).digest("hex")) {
      return { result: false, msg: "Wrong email or password" };
    }
    const userJson = await user.toJson();
    return { result: true, data: userJson };
  }

  async createMovie(movie: Movie): Promise<DBResponse> {
    const createdMovie = await this.movies.create(movie);
    if (!createdMovie) return { result: false, msg: "No movies created" };
    const movieJson = await createdMovie.toJson();
    return { result: true, data: movieJson };
  }

  async getTmdbMPopular(): Promise<DBResponse> {
    const url = "https://api.themoviedb.org/3/movie/popular?language=pl&page=1";
    try {
      const popular = await Axios.get(url, {
        headers: this.tmdbHeaders,
      });
      return { result: true, data: popular.data.results };
    } catch (err) {
      return { result: false, msg: err };
    }
  }
  async getTmdbMById(id: number): Promise<DBResponse> {
    const url = `https://api.themoviedb.org/3/movie/${id}`;
    try {
      const details = await Axios.get(url, { headers: this.tmdbHeaders });
      return { result: true, data: details.data };
    } catch (err) {
      return { result: false, msg: err };
    }
  }
  async getGenres(): Promise<DBResponse> {
    const url = "https://api.themoviedb.org/3/genre/movie/list?language=pl";
    try {
      const genres = await Axios.get(url, { headers: this.tmdbHeaders });
      return { result: true, data: genres.data.genres };
    } catch (err) {
      return { result: false, msg: err };
    }
  }
  async searchTmdb(query: string): Promise<DBResponse> {
    if (!query) return { result: false, msg: "No query" };
    const url = `https://api.themoviedb.org/3/search/movie?query=${query}&language=pl&page=1&include_adult=true`;
    try {
      const search = await Axios.get(url, { headers: this.tmdbHeaders });
      return { result: true, data: search.data.results };
    } catch (err) {
      return { result: false, msg: "1" };
    }
  }

  async watchlistGetter(
    userId: string
  ): Promise<Node<Watchlist>> | Promise<boolean> {
    const user = await this.users.find(userId);
    if (!user) return false;
    const watchlist_rel: Relationship = await user.get("watchlist");
    if (!watchlist_rel) return false;
    const watchlist: Node<Watchlist> = watchlist_rel.endNode();
    if (!watchlist) return false;
    return watchlist;
  }

  async getWatchlist(userId: string): Promise<DBResponse> {
    const watchlist = await this.watchlistGetter(userId);
    if (!watchlist) return { result: false, msg: "No watchlist" };
    const movies_rel: NodeCollection = await watchlist.get("has");

    if (!movies_rel)
      return { result: true, msg: "No movies in watchlist", data: [] };
    if (movies_rel.length === 0)
      return { result: true, msg: "No movies in watchlist", data: [] };

    const movies = await Promise.all(
      movies_rel.map(async (rel: Node<Movie>) => {
        const movie = await rel.toJson();
        const parsed = JSON.parse(JSON.stringify(movie));
        delete parsed.node._id;
        delete parsed.node._labels;
        return parsed.node;
      })
    );
    return { result: true, data: movies };
  }

  async deleteFromWatchlist(
    userId: string,
    movieId: string
  ): Promise<DBResponse> {
    const watchlist = await this.watchlistGetter(userId);
    if (!watchlist) return { result: false, msg: "No watchlist" };
    if (watchlist === true) return { result: false, msg: "No watchlist" };
    const movies_rel: NodeCollection = await watchlist.get("has");
    if (!movies_rel)
      return { result: true, msg: "No movies in watchlist", data: [] };
    if (movies_rel.length === 0)
      return { result: true, msg: "No movies in watchlist", data: [] };
    const deleted = await movies_rel.find((movie) => movie["id"] === movieId);
    if (!deleted) return { result: false, msg: "Movie not found in watchlist" };
    await deleted.detachFrom(watchlist);
    return { result: true, msg: "Movie deleted" };
  }
}
const db = new Db();

(async () => {
  await db.users.deleteAll();
  await db.watchlists.deleteAll();
  const newUser = await db.createUser({
    email: "email@mail.com",
    password: "password",
  });

  const movie = await db.createMovie({
    id: uuidv4(),
    title: "title",
    // overview: tmdbMovie.overview || "",
    popularity: 1,
    release_date: "2021-01-01",
    poster_path: "path",
    adult: false,
    backdrop_path: "path",
    budget: 1,
    status: "status",
  });

  const movie2 = await db.createMovie({
    id: uuidv4(),
    title: "title",
    // overview: tmdbMovie.overview || "",
    popularity: 1,
    release_date: "2021-01-01",
    poster_path: "path",
    adult: false,
    backdrop_path: "path",
    budget: 1,
    status: "status",
  });

  const watchlist = await db.getWatchlist(newUser.data[0].id);

  const addedToWatchlist = await db.addToWatchlist(
    newUser.data[0].id,
    movie.data.id
  );
  const addedToWatchlist2 = await db.addToWatchlist(
    newUser.data[0].id,
    movie2.data.id
  );
  const watchlistMovies = await db.getWatchlist(newUser.data[0].id);
  console.log(watchlistMovies);
  const deleted = await db.deleteFromWatchlist(
    newUser.data[0].id,
    movie.data.id
  );
  console.log(deleted);

  // console.log(watchlistMovies);

  //   const y = await db.loginUser("", "");
  //   console.log(y);
  // const logged = await db.loginUser("email@mail.com", "password");
  // console.log(logged);
  // const popular = await db.getTmdbMPopular();
  // console.log(popular);
  // const moviesById = await db.getTmdbMById(22);
  // console.log(moviesById);
  // const genres = await db.getGenres();
  // console.log(genres);
  // const search = await db.searchTmdb("matrix");
  // console.log(search);
  // const watchlist = await db.createWatchlist("Watchlist", newUser.data.id);
  // console.log(watchlist.data);
  // const watchlists = await db.getWatchlist("1");
  // console.log(watchlists);
  // const deleted = await db.deleteWatchlist("1");
  // console.log(deleted);
})();

export default db;
