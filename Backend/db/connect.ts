import Neode, { Model, Node, NodeCollection, Relationship } from "neode";
import dotenv, { parse } from "dotenv";
import Envs from "../interfaces/envs";
import userSchema from "./models/User";
import { v4 as uuidv4 } from "uuid";
import newUserInterface from "../interfaces/newUser";
// import UserInterface from "../interfaces/User";
import { createHash, Hash } from "crypto";
import {
  DBResponse,
  DBMessage,
  UserCreationResponse,
  GetMovieResponse,
  GetGenresReponse,
  WatchlistCreationResponse,
  MovieCreationResponse,
  GetWatchlistResponse,
  AddToWatchlistResponse,
  DeletionFromWatchlistResponse,
  DeleteFromWatchlistResponse,
} from "../interfaces/DBResponse";
// import jwt from "jsonwebtoken";
import { emailRegex, passwordRegex } from "../data/regex";
import Axios from "axios";
import watchlistSchema from "./models/Watchlist";
import testMovies from "../data/movie_ids_test.json";
import movieSchema from "./models/Movie";
import playlistSchema from "./models/Playlist";
import UserInterface from "../interfaces/User";
import MovieInterface from "../interfaces/Movie";
import { WatchlistInterface } from "../interfaces/Watchlist";

class Db {
  instance: Neode;
  envs: Envs;
  // models
  users: Model<User>;
  watchlists: Model<Watchlist>;
  movies: Model<Movie>;
  reviews: Model<Review>;
  playlists: Model<Playlist>;

  hash: Hash;
  emailRegex: RegExp = emailRegex;
  passwordRegex: RegExp = passwordRegex;
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
    this.playlists.deleteAll();
    return true;
  }

  async loadTestMovies(): Promise<boolean> {
    const moviesIds = testMovies.map((movie) => movie.id);
    moviesIds.forEach((id) => {
      this.getTmdbMById(id).then(async (res) => {
        const movie = this.TmdbToMovie(res.data);
        await this.createMovie(movie);
      });
    });
    return true;
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
    this.playlists = this.instance.model("Playlist", playlistSchema);
  }

  setUp() {
    this.instance = new Neode(
      this.envs.NEO4J_URI,
      this.envs.NEO4J_USERNAME,
      this.envs.NEO4J_PASSWORD
    );
    this.loadModels();
  }

  async getUsers(): Promise<UserInterface[]> {
    const users = await this.users.all();
    if (!users) return [];
    const jsoned = await Promise.all(
      users.map(async (user) => {
        const json = await user.properties();
        return json;
      })
    );
    return jsoned;
  }

  async createUser(user: newUserInterface): Promise<UserCreationResponse> {
    const id = uuidv4();
    if (!this.emailRegex.test(user.email)) {
      return { result: false, msg: DBMessage.INVALID_EMAIL, data: undefined };
    }

    if (!this.passwordRegex.test(user.password)) {
      return {
        result: false,
        msg: DBMessage.INVALID_PASSWORD,
        data: undefined,
      };
    }

    const foundEmail = (await this.users.all({ email: user.email })).length;
    if (foundEmail) {
      return { result: false, msg: DBMessage.USER_EXISTS, data: undefined };
    }
    const hashedPassword = createHash("sha256")
      .update(user.password)
      .digest("hex");

    const newUser = { ...user, id, password: hashedPassword };
    const createdUser = await this.users.create(newUser);
    const userResponse = await createdUser.properties();
    await this.createWatchlist(createdUser);

    return {
      result: true,
      data: userResponse,
      msg: DBMessage.USER_CREATED,
    };
  }
  async createWatchlist(
    userNode: Node<User>
  ): Promise<WatchlistCreationResponse> {
    const id = uuidv4();
    const watchlist = await this.watchlists.create({ id });
    if (!watchlist)
      return {
        result: false,
        msg: DBMessage.WATCHLIST_NOT_CREATED,
        data: undefined,
      };
    await userNode.relateTo(watchlist, "watchlist");
    return {
      result: true,
      msg: DBMessage.WATCHLIST_CREATED,
      data: watchlist.properties(),
    };
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

  async createMovie(movie: Movie): Promise<MovieCreationResponse> {
    const createdMovie = await this.movies.create(movie);
    if (!createdMovie)
      return {
        result: false,
        msg: DBMessage.MOVIE_NOT_CREATED,
        data: undefined,
      };
    const movieJson = await createdMovie.toJson();
    return { result: true, data: movieJson, msg: DBMessage.MOVIE_CREATED };
  }

  TmdbToMovie(tmdbMovie: Movie): MovieInterface {
    const movie: MovieInterface = {
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

  async getTmdbMPopular(): Promise<GetMovieResponse> {
    const url = "https://api.themoviedb.org/3/movie/popular?language=pl&page=1";
    try {
      const popular = await Axios.get(url, {
        headers: this.tmdbHeaders,
      });

      const movies = popular.data.results.map((movie: MovieInterface) => {
        return this.TmdbToMovie(movie);
      });
      return {
        result: true,
        msg: DBMessage.MOVIE_FOUND,
        data: movies,
      };
    } catch (err) {
      return { result: false, msg: DBMessage.TMDB_API_ERROR, data: [] };
    }
  }
  async getTmdbMById(id: number): Promise<GetMovieResponse> {
    const url = `https://api.themoviedb.org/3/movie/${id}`;
    try {
      const details = await Axios.get(url, { headers: this.tmdbHeaders });
      const movie = this.TmdbToMovie(details.data);
      return { result: true, msg: DBMessage.MOVIE_FOUND, data: movie };
    } catch (err) {
      return { result: false, msg: DBMessage.TMDB_API_ERROR, data: undefined };
    }
  }
  async getGenres(): Promise<GetGenresReponse> {
    const url = "https://api.themoviedb.org/3/genre/movie/list?language=pl";
    try {
      const genres = await Axios.get(url, { headers: this.tmdbHeaders });
      return {
        result: true,
        msg: DBMessage.GENRES_FOUND,
        data: genres.data.genres,
      };
    } catch (err) {
      return { result: false, msg: DBMessage.TMDB_API_ERROR, data: undefined };
    }
  }
  async searchTmdb(query: string): Promise<GetMovieResponse> {
    if (!query)
      return { result: false, msg: DBMessage.INVALID_QUERY, data: undefined };
    const url = `https://api.themoviedb.org/3/search/movie?query=${query}&language=pl&page=1&include_adult=true`;
    try {
      const search = await Axios.get(url, { headers: this.tmdbHeaders });
      const movies = search.data.results.map((movie: MovieInterface) => {
        return this.TmdbToMovie(movie);
      });
      return { result: true, data: movies, msg: DBMessage.MOVIE_FOUND };
    } catch (err) {
      return { result: false, msg: DBMessage.TMDB_API_ERROR, data: undefined };
    }
  }

  async watchlistGetter(userId: string): Promise<Node<Watchlist> | undefined> {
    const user = await this.users.find(userId);
    if (!user) return undefined;
    const watchlist_rel: Relationship = await user.get("watchlist");
    if (!watchlist_rel) return undefined;
    const watchlist: Node<Watchlist> = watchlist_rel.endNode();
    if (!watchlist) return undefined;
    return watchlist;
  }

  async getMovie(movieId: string): Promise<Node<Movie>> {
    const movie = await this.movies.find(movieId);
    return movie;
  }
  // WATCHLISTS
  async addToWatchlist(
    userId: string,
    movieId
  ): Promise<AddToWatchlistResponse> {
    const userNode = await this.users.find(userId);
    if (!userNode)
      return { result: false, msg: DBMessage.USER_NOT_FOUND, data: undefined };
    const movieNode = await this.getMovie(movieId);
    if (!movieNode)
      return { result: false, msg: DBMessage.MOVIE_NOT_FOUND, data: undefined };
    const watchlistNode = await this.watchlistGetter(userId);
    if (!watchlistNode)
      return {
        result: false,
        msg: DBMessage.WATCHLIST_NOT_FOUND,
        data: undefined,
      };
    const movies = await (await this.getWatchlist(userId)).data;
    if (!movies)
      return {
        result: false,
        msg: DBMessage.WATCHLIST_NOT_FOUND,
        data: undefined,
      };

    const alreadyAdded = movies.find((movie) => movie.id === movieId);
    if (alreadyAdded)
      return {
        result: false,
        msg: DBMessage.ALREADY_IN_WATCHLIST,
        data: alreadyAdded,
      };
    const result = await movieNode.relateTo(watchlistNode, "has");
    if (!result)
      return {
        result: false,
        msg: DBMessage.WATCHLIST_NOT_UPDATED,
        data: undefined,
      };
    return { result: true, msg: DBMessage.WATCHLIST_UPDATED, data: undefined };
  }
  async getWatchlist(userId: string): Promise<GetWatchlistResponse> {
    const watchlist = await this.watchlistGetter(userId);
    if (!watchlist)
      return {
        result: false,
        msg: DBMessage.WATCHLIST_NOT_FOUND,
        data: undefined,
      };
    const movies_rel: NodeCollection = await watchlist.get("has");

    if (!movies_rel)
      return { result: true, msg: DBMessage.WATCHLIST_EMPTY, data: [] };
    if (movies_rel.length === 0)
      return { result: true, msg: DBMessage.WATCHLIST_EMPTY, data: [] };

    const movies = await Promise.all(
      movies_rel.map(async (rel: Node<Movie>) => {
        const movie = await rel.toJson();
        const parsed = JSON.parse(JSON.stringify(movie));
        delete parsed.node._id;
        delete parsed.node._labels;
        return parsed.node;
      })
    );
    return { result: true, msg: DBMessage.WATCHLIST_FOUND, data: movies };
  }

  async deleteFromWatchlist(
    userId: string,
    movieId: string
  ): Promise<DeleteFromWatchlistResponse> {
    const watchlist = await this.watchlistGetter(userId);
    if (!watchlist)
      return {
        result: false,
        msg: DBMessage.WATCHLIST_NOT_FOUND,
        data: undefined,
      };

    const movie = await this.getMovie(movieId);
    const result = await movie.detachFrom(watchlist);
    if (!result)
      return {
        result: false,
        msg: DBMessage.MOVIE_NOT_UPDATED,
        data: undefined,
      };
    return { result: true, msg: DBMessage.MOVIE_UPDATED, data: undefined };
  }

  async createPlaylist(userId: string) {
    const user = await this.users.find(userId);
    if (!user) return
  }
  async getPlaylists(userId: string) {}
  async getPlaylist(playlistId: string) {}
  async deletePlaylist(playlistId: string) {}
}
const db = new Db();

(async () => {
  // await db.users.deleteAll();
  // await db.watchlists.deleteAll();
  // const users0 = await db.getUsers();
  // console.log(users0);

  //users

  const newUser = await db.createUser({
    email: "email@mail.com",
    password: "Admin123.",
  });
  const newUser2 = await db.createUser({
    email: "email@mail2.com",
    password: "Admin123.",
  });

  // const users = await db.getUsers();
  // console.log(users);

  //tmdbMovies
  // const tmdbPopular = await db.getTmdbMPopular();
  // console.log(tmdbPopular);

  // const tmdbMovie = await db.getTmdbMById(22);
  // console.log(tmdbMovie);

  // const genres = await db.getGenres();
  // console.log(genres);

  // const search = await db.searchTmdb("matrix");
  // console.log(search);

  //movies
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
  // watchlists
  const addedToWatchlist = await db.addToWatchlist(
    newUser.data.id,
    movie.data.id
  );
  const addedToWatchlist2 = await db.addToWatchlist(
    newUser.data.id,
    movie2.data.id
  );
  const addedToWatchlist3 = await db.addToWatchlist(
    newUser2.data.id,
    movie.data.id
  );
  const addedToWatchlist4 = await db.addToWatchlist(
    newUser2.data.id,
    movie2.data.id
  );

  // const watchlist1 = await db.getWatchlist(newUser.data.id);
  // const watchlist2 = await db.getWatchlist(newUser2.data.id);
  // const deleted = await db.deleteFromWatchlist(newUser.data.id, movie.data.id);
  // const watchlist3 = await db.getWatchlist(newUser.data.id);
  // const watchlist4 = await db.getWatchlist(newUser2.data.id);
  // console.log(watchlist1);
  // console.log(watchlist2);
  // console.log(watchlist3);
  // console.log(watchlist4);

  // console.log(deleted);
  // console.log(watchlistMovies);
})();

export default db;
