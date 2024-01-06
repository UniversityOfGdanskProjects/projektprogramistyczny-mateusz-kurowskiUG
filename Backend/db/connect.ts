import Neode, { Model, Node, NodeCollection } from "neode";
import dotenv from "dotenv";
import Envs from "../interfaces/envs";
import userSchema from "./models/User";
import { v4 as uuidv4 } from "uuid";
import newUserInterface from "../interfaces/newUser";
import { createHash, Hash } from "crypto";
import {
  DBMessage,
  UserCreationResponse,
  GetMovieResponse,
  GetGenresReponse,
  MovieCreationResponse,
  GetWatchlistResponse,
  AddToWatchlistResponse,
  DeleteFromWatchlistResponse,
  CreatePlaylistResponse,
  GetPlaylistsResponse,
  RenamePlaylistResponse,
  GetPlaylistResponse,
  AddToPlaylistResponse,
  RemoveFromPlaylistResponse,
  LoginResponse,
  AddReviewResponse,
  isReviewValidInterface,
} from "../interfaces/DBResponse";
// import jwt from "jsonwebtoken";
import { emailRegex, passwordRegex } from "../data/regex";
import Axios from "axios";
import testMovies from "../data/movie_ids_test.json";
import movieSchema from "./models/Movie";
import playlistSchema from "./models/Playlist";
import UserInterface from "../interfaces/User";
import MovieInterface from "../interfaces/Movie";
import PlaylistInterface from "../interfaces/Playlist";
import { ReviewInterface } from "../interfaces/ReviewInterface";

class Db {
  instance: Neode;
  envs: Envs;
  // models
  users: Model<UserInterface>;
  movies: Model<MovieInterface>;
  playlists: Model<PlaylistInterface>;

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
    this.movies = this.instance.model("Movie", movieSchema);
    this.playlists = this.instance.model("Playlist", playlistSchema);
  }

  async testData() {
    const u1 = {
      email: "email@mail.com",
      password: "Admin123.",
      id: "fca4b1e4-2f59-4352-bd61-8b3bf804686e",
      role: "admin",
    };
    const u2 = {
      email: "email@mail2.com",
      password: "Admin123.",
      id: "4ff3819b-501d-458a-a335-c75ec2510a1e",
      role: "user",
    };

    const user1 = this.users.create(u1);
    const user2 = this.users.create(u2);

    const movie1 = {
      id: "6f191db4-2f47-4477-8f0c-f303b1bf6e90",
      title: "title",
      // overview: tmdbMovie.overview || "",
      popularity: 1,
      release_date: "2021-01-01",
      poster_path: "path",
      adult: false,
      backdrop_path: "path",
      budget: 1,
      status: "status",
    };
    const movie2 = {
      id: "b47fa852-dec5-408f-a7d7-f8ab62297608",
      title: "title",
      // overview: tmdbMovie.overview || "",
      popularity: 1,
      release_date: "2021-01-01",
      poster_path: "path",
      adult: false,
      backdrop_path: "path",
      budget: 1,
      status: "status",
    };

    const m1 = db.createMovie(movie1);
    const m2 = db.createMovie(movie2);

    const m3 = db.createMovie({
      id: "b47fa852-dec5-408f-a7d7-f8ab62297609",
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
    const playlist12: PlaylistInterface = {
      id: "b47fa852-dec5-408f-a7d7-f8ab62297610",
      name: "p1234",
      date: new Date(),
    };
    const emptyPlaylist: PlaylistInterface = {
      id: "b47fa852-dec5-408f-a7d7-f8ab62297611",
      name: "emptyPlaylist",
      date: new Date(),
    };
    const playlistCreate = this.playlists.create(playlist12);
    const emptyPlaylistCreate = this.playlists.create(emptyPlaylist);

    const [
      newUser,
      newUser2,
      movie1R,
      movie2R,
      movie3,
      newPlaylist,
      emptyPlaylistR,
    ] = await Promise.all([
      user1,
      user2,
      m1,
      m2,
      m3,
      playlistCreate,
      emptyPlaylistCreate,
    ]);
    newUser.relateTo(newPlaylist, "playlist", { date: new Date() });
    newUser.relateTo(emptyPlaylistR, "playlist", { date: new Date() });
    return { u1, u2, movie1, movie2, movie3, playlist12, emptyPlaylist };
  }

  setUp() {
    // this.instance = new Neode(
    //   this.envs.NEO4J_URI,
    //   this.envs.NEO4J_USERNAME,
    //   this.envs.NEO4J_PASSWORD
    // );
    this.instance = new Neode("neo4j://localhost:7687", "neo4j", "test1234");

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

    const newUser = { ...user, id, password: hashedPassword, role: "user" };
    const createdUser = await this.users.create(newUser);
    const userResponse = createdUser.properties();

    return {
      result: true,
      data: userResponse,
      msg: DBMessage.USER_CREATED,
    };
  }

  async loginUser(email: string, password: string): Promise<LoginResponse> {
    const user = await (await this.users.all({ email })).first();
    if (!user) {
      return {
        result: false,
        msg: DBMessage.USER_NOT_FOUND,
        data: undefined,
      };
    }
    if (user.get("password") !== this.hash.update(password).digest("hex")) {
      return {
        result: false,
        msg: DBMessage.INVALID_CREDIENTIALS,
        data: undefined,
      };
    }
    const userJson = await user.properties();
    delete userJson.password;
    return { result: true, msg: DBMessage.USER_LOGGED_IN, data: userJson };
  }

  async getMovieById(movieId: string): Promise<GetMovieResponse> {
    const movie = await this.movies.find(movieId);
    if (!movie)
      return { result: false, msg: DBMessage.MOVIE_NOT_FOUND, data: undefined };
    const movieJson = movie.properties();
    return { result: true, msg: DBMessage.MOVIE_FOUND, data: movieJson };
  }

  async createMovie(movie: MovieInterface): Promise<MovieCreationResponse> {
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

  TmdbToMovie(tmdbMovie: MovieInterface): MovieInterface {
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

  async getMovie(movieId: string): Promise<Node<MovieInterface>> {
    const movie = await this.movies.find(movieId);
    return movie;
  }
  // WATCHLISTS
  async addToWatchlist(
    userId: string,
    movieId: string
  ): Promise<AddToWatchlistResponse> {
    const user = await this.users.find(userId);
    if (!user)
      return { result: false, msg: DBMessage.USER_NOT_FOUND, data: undefined };
    const movie = await this.movies.find(movieId);
    if (!movie)
      return { result: false, msg: DBMessage.MOVIE_NOT_FOUND, data: undefined };
    const watchlist: NodeCollection = await user.get("watchlist");

    if (!watchlist)
      return {
        result: false,
        msg: DBMessage.WATCHLIST_NOT_FOUND,
        data: undefined,
      };
    if (!watchlist.length) {
      await user.relateTo(movie, "watchlist", { date: new Date() });
      return {
        result: true,
        msg: DBMessage.WATCHLIST_UPDATED,
        data: movie.properties(),
      };
    }
    const isInWatchlist = watchlist.find(
      (movie) => movie.properties().id === movieId
    );
    if (!isInWatchlist) {
      await user.relateTo(movie, "watchlist", { date: new Date() });
      return {
        result: true,
        msg: DBMessage.WATCHLIST_UPDATED,
        data: movie.properties(),
      };
    }
    return {
      result: false,
      msg: DBMessage.ALREADY_IN_WATCHLIST,
      data: undefined,
    };
  }
  async getWatchlist(userId: string): Promise<GetWatchlistResponse> {
    const user = await this.users.find(userId);
    if (!user)
      return { result: false, msg: DBMessage.USER_NOT_FOUND, data: undefined };
    const watchlist: NodeCollection = await user.get("watchlist");

    if (!watchlist.length)
      return {
        result: false,
        msg: DBMessage.WATCHLIST_EMPTY,
        data: [],
      };
    const watchlistMovies: MovieInterface[] = watchlist.map((movie) =>
      movie.properties()
    );
    return {
      result: true,
      msg: DBMessage.WATCHLIST_FOUND,
      data: watchlistMovies,
    };
  }

  async deleteFromWatchlist(
    userId: string,
    movieId: string
  ): Promise<DeleteFromWatchlistResponse> {
    const user = await this.users.find(userId);
    if (!user)
      return { result: false, msg: DBMessage.USER_NOT_FOUND, data: undefined };
    const movie = await this.movies.find(movieId);
    if (!movie)
      return { result: false, msg: DBMessage.MOVIE_NOT_FOUND, data: undefined };
    const watchlist: NodeCollection = await user.get("watchlist");
    if (!watchlist)
      return {
        result: false,
        msg: DBMessage.WATCHLIST_NOT_FOUND,
        data: undefined,
      };
    const empty = watchlist.length === 0;
    if (empty)
      return {
        result: false,
        msg: DBMessage.WATCHLIST_EMPTY,
        data: undefined,
      };
    const isInWatchlist = watchlist.find(
      (movie) => movie.properties().id === movieId
    );
    if (!isInWatchlist)
      return {
        result: false,
        msg: DBMessage.NOT_IN_WATCHLIST,
        data: undefined,
      };
    const result = await user.detachFrom(movie);
    if (!result)
      return {
        result: false,
        msg: DBMessage.WATCHLIST_NOT_UPDATED,
        data: undefined,
      };
    return {
      result: true,
      msg: DBMessage.WATCHLIST_UPDATED,
      data: movie.properties(),
    };
  }

  async createPlaylist(
    userId: string,
    name: string
  ): Promise<CreatePlaylistResponse> {
    const user = await this.users.find(userId);
    if (!name)
      return { result: false, msg: DBMessage.INVALID_NAME, data: undefined };
    if (!user)
      return { result: false, msg: DBMessage.USER_NOT_FOUND, data: undefined };

    const newPlaylist: PlaylistInterface = {
      id: uuidv4(),
      name: name,
      date: new Date(),
      // movies: [],
    };
    const createdPlaylist = await this.playlists.create(newPlaylist);
    if (!createdPlaylist)
      return {
        result: false,
        msg: DBMessage.PLAYLIST_NOT_CREATED,
        data: undefined,
      };
    const related = user.relateTo(createdPlaylist, "playlist", {
      date: new Date(),
    });
    if (!related)
      return {
        result: false,
        msg: DBMessage.PLAYLIST_NOT_CREATED,
        data: undefined,
      };
    return {
      result: true,
      msg: DBMessage.PLAYLIST_CREATED,
      data: createdPlaylist.properties(),
    };
  }

  // async getPlaylists(userId: string): Promise<GetPlaylistsResponse> {
  //   const playlists = (await this.playlists.all()).forEach(async (playlist) => {
  //     const playlistJson = await playlist.toJson();
  //     console.log(playlistJson);
  //   });
  //   // console.log(await playlists);
  // }

  async getMoviesInPlaylist(playlistId: string): Promise<MovieInterface[]> {
    const playlist = await this.playlists.find(playlistId);
    if (!playlist) return [];
    const movies_rel: NodeCollection = await playlist.get("has");
    if (!movies_rel) return [];
    if (!movies_rel.length) return [];
    const movies = movies_rel.map((rel: Node<MovieInterface>) =>
      rel.properties()
    );
    return movies;
  }

  async getPlaylists(userId: string): Promise<GetPlaylistsResponse> {
    const user = await this.users.find(userId);
    if (!user)
      return { result: false, msg: DBMessage.USER_NOT_FOUND, data: undefined };

    const playlists_rel: NodeCollection = await user.get("playlist");
    if (!playlists_rel)
      return {
        result: false,
        msg: DBMessage.NO_PLAYLISTS,
        data: [],
      };
    if (!playlists_rel.length) {
      return {
        result: false,
        msg: DBMessage.NO_PLAYLISTS,
        data: [],
      };
    }
    const playlists = playlists_rel.map((rel: Node<PlaylistInterface>) => {
      const playlist = rel.properties();
      return playlist;
    });
    if (!playlists)
      return {
        result: false,
        msg: DBMessage.PLAYLIST_NOT_FOUND,
        data: undefined,
      };

    const playlistsWithMovies = await Promise.all(
      playlists.map(async (playlist) => {
        const movies = await this.getMoviesInPlaylist(playlist.id);
        return { ...playlist, movies };
      })
    );
    return {
      result: true,
      msg: DBMessage.PLAYLIST_FOUND,
      data: playlistsWithMovies,
    };
  }

  async addToPlaylist(
    playlistId: string,
    movieId: string
  ): Promise<AddToPlaylistResponse> {
    const playlist = await this.playlists.find(playlistId);
    if (!playlist)
      return {
        result: false,
        msg: DBMessage.PLAYLIST_NOT_FOUND,
        data: undefined,
      };
    const movie = await this.movies.find(movieId);
    if (!movie)
      return { result: false, msg: DBMessage.MOVIE_NOT_FOUND, data: undefined };
    const isInPlaylist: NodeCollection = await playlist.get("has");
    if (!isInPlaylist)
      return {
        result: false,
        msg: DBMessage.PLAYLIST_NOT_FOUND,
        data: undefined,
      };
    const alreadyInPlaylist = isInPlaylist.find(
      (movie) => movie.properties().id === movieId
    );
    if (alreadyInPlaylist)
      return {
        result: false,
        msg: DBMessage.ALREADY_IN_PLAYLIST,
        data: undefined,
      };
    const related = await playlist.relateTo(movie, "has", { date: new Date() });
    if (!related)
      return {
        result: false,
        msg: DBMessage.PLAYLIST_NOT_UPDATED,
        data: undefined,
      };
    return {
      result: true,
      msg: DBMessage.PLAYLIST_UPDATED,
      data: movie.properties(),
    };
  }

  async removeFromPlaylist(
    playlistId: string,
    movieId: string
  ): Promise<RemoveFromPlaylistResponse> {
    const playlist = await this.playlists.find(playlistId);
    if (!playlist)
      return {
        result: false,
        msg: DBMessage.PLAYLIST_NOT_FOUND,
        data: undefined,
      };
    const movie = await this.movies.find(movieId);
    if (!movie)
      return { result: false, msg: DBMessage.MOVIE_NOT_FOUND, data: undefined };
    const isInPlaylist: NodeCollection = await playlist.get("has");
    if (!isInPlaylist)
      return {
        result: false,
        msg: DBMessage.PLAYLIST_NOT_FOUND,
        data: undefined,
      };
    const alreadyInPlaylist = await isInPlaylist.find(
      (movie) => movie.properties().id === movieId
    );
    if (!alreadyInPlaylist)
      return {
        result: false,
        msg: DBMessage.NOT_IN_PLAYLIST,
        data: undefined,
      };
    const related = await playlist.detachFrom(movie);
    if (!related)
      return {
        result: false,
        msg: DBMessage.PLAYLIST_NOT_UPDATED,
        data: undefined,
      };
    return {
      result: true,
      msg: DBMessage.PLAYLIST_UPDATED,
      data: movie.properties(),
    };
  }

  async renamePlaylist(
    playlistId: string,
    name: string
  ): Promise<RenamePlaylistResponse> {
    const playlist = await this.playlists.find(playlistId);
    if (!playlist)
      return {
        result: false,
        msg: DBMessage.PLAYLIST_NOT_FOUND,
        data: undefined,
      };
    const date = new Date();
    const result = await playlist.update({ name, date });
    if (!result)
      return {
        result: false,
        msg: DBMessage.PLAYLIST_NOT_UPDATED,
        data: undefined,
      };
    return {
      result: true,
      msg: DBMessage.PLAYLIST_UPDATED,
      data: playlist.properties(),
    };
  }

  async getPlaylistById(playlistId: string): Promise<GetPlaylistResponse> {
    const playlist = await this.playlists.find(playlistId);
    if (!playlist)
      return {
        result: false,
        msg: DBMessage.PLAYLIST_NOT_FOUND,
        data: undefined,
      };
    return {
      result: true,
      msg: DBMessage.PLAYLIST_FOUND,
      data: playlist.properties(),
    };
  }
  async deletePlaylist(playlistId: string): Promise<DeletePlaylistResponse> {
    const playlist = await this.playlists.find(playlistId);
    if (!playlist)
      return {
        result: false,
        msg: DBMessage.PLAYLIST_NOT_FOUND,
        data: undefined,
      };
    const result = await playlist.delete();
    if (!result)
      return {
        result: false,
        msg: DBMessage.PLAYLIST_NOT_DELETED,
        data: undefined,
      };
    return {
      result: true,
      msg: DBMessage.PLAYLIST_DELETED,
      data: playlist.properties(),
    };
  }
  // REVIEWS
  validateReview(review: ReviewInterface): isReviewValidInterface {
    if (review.rating < 0 || review.rating > 10)
      return { result: false, msg: DBMessage.INVALID_RATING };
    if (review.content.length < 10 || review.content.length > 500)
      return { result: false, msg: DBMessage.INVALID_CONTENT };
    if (!review.movieId)
      return { result: false, msg: DBMessage.MOVIE_NOT_FOUND };
    if (!review.userId) return { result: false, msg: DBMessage.USER_NOT_FOUND };
    return { result: true, msg: DBMessage.REVIEW_VALID };
  }

  async addReview({
    userId,
    movieId,
    content,
    rating,
  }: {
    userId: string;
    movieId: string;
    content: string;
    rating: number;
  }): Promise<AddReviewResponse> {
    const review: ReviewInterface = {
      id: uuidv4(),
      date: new Date(),
      content,
      rating,
      movieId,
      userId,
    };
    const isValid = this.validateReview(review);
    if (!isValid.result)
      return {
        result: false,
        msg: isValid.msg,
        data: undefined,
      };
    const user = await this.users.find(userId);
    if (!user)
      return { result: false, msg: DBMessage.USER_NOT_FOUND, data: undefined };
    const movie = await this.movies.find(movieId);
    if (!movie)
      return { result: false, msg: DBMessage.MOVIE_NOT_FOUND, data: undefined };
    const usersReviews: NodeCollection = await user.get("reviewed");
    if (!usersReviews)
      return {
        result: false,
        msg: DBMessage.REVIEW_NOT_CREATED,
        data: undefined,
      };

    if (usersReviews.length) {
      const alreadyReviewed = await usersReviews.find(async (review) => {
        const reviewProps = review.properties();
        const movie = await review.endNode();
        console.log(await movie.toJson());

        return movie.properties().id === movieId;
      });
      // console.log(alreadyReviewed.properties());

      if (alreadyReviewed)
        return {
          result: false,
          msg: DBMessage.ALREADY_REVIEWED,
          data: undefined,
        };
    }
    const create = await user.relateTo(movie, "reviewed", {
      content: review.content,
      rating: review.rating,
      date: review.date,
    });
    if (!create)
      return {
        result: false,
        msg: DBMessage.REVIEW_NOT_CREATED,
        data: undefined,
      };
    return { result: true, msg: DBMessage.REVIEW_CREATED, data: review };
  }
  async getReviewsByMovie() {}
  async deleteReview() {}
}
const db = new Db();

(async () => {
  // await db.users.deleteAll();
  // await db.watchlists.deleteAll();
  // const users0 = await db.getUsers();
  // console.log(users0);

  //users

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

  // watchlists
  // const getWatchlist = await db.getWatchlist(newUser.data.id);
  // console.log(getWatchlist);

  const { u1, u2, movie1, movie2, movie3, playlist12 } = await db.testData();

  const addedToWatchlist = await db.addToWatchlist(u1.id, movie1.id);
  const addedToWatchlist2 = await db.addToWatchlist(u1.id, movie2.id);
  const addedToWatchlist3 = await db.addToWatchlist(u2.id, movie1.id);
  const addedToWatchlist4 = await db.addToWatchlist(u2.id, movie2.id);
  const addedToWatchlist5 = await db.addToWatchlist(u2.id, movie2.id);
  // console.log(addedToWatchlist);
  // console.log(addedToWatchlist2);
  // console.log(addedToWatchlist3);
  // console.log(addedToWatchlist4);
  // console.log(addedToWatchlist5);

  // const watchlist1 = await db.getWatchlist(newUser.data.id);
  // const watchlist2 = await db.getWatchlist(newUser2.data.id);
  // const deleted = await db.deleteFromWatchlist(newUser.data.id, movie.data.id);
  // const deleted2 = await db.deleteFromWatchlist(
  //   newUser2.data.id,
  //   movie2.data.id
  // );
  // const deleted3 = await db.deleteFromWatchlist(newUser.data.id, "asdasd");
  // const watchlist3 = await db.getWatchlist(newUser.data.id);
  // const watchlist4 = await db.getWatchlist(newUser2.data.id);
  // console.log(watchlist1);
  // console.log(watchlist2);
  // console.log(watchlist3);
  // console.log(watchlist4);
  // console.log(deleted);
  // console.log(deleted2);
  // console.log(deleted3);

  // console.log(deleted);
  // console.log(watchlistMovies);
  // PLAYLISTS
  const playlist1 = await db.createPlaylist(u1.id, "playlist1");
  const playlist2 = await db.createPlaylist(u1.id, "playlist2");
  const added1 = await db.addToPlaylist(playlist12.id, movie1.id);
  const added2 = await db.addToPlaylist(playlist12.id, movie2.id);
  const added3 = await db.addToPlaylist(playlist2.data?.id, movie1.id);
  const added4 = await db.addToPlaylist(playlist2.data?.id, movie2.id);

  const deletedFromPlaylist = await db.removeFromPlaylist(
    playlist12.id,
    movie1.id
  );
  // console.log(deletedFromPlaylist);

  const playlists = await db.getPlaylists(u1.id);
  // console.dir(playlists, { depth: null });
  // const delPlaylist = await db.deletePlaylist(playlist1.data.id);
  // console.log(delPlaylist);

  // const playlists = await db.getPlaylists(newUser.data?.id);
  // console.log(playlists);

  const rename = await db.renamePlaylist(playlist12.id, "newName");
  // console.log(rename);

  const u1Reviews = await db.addReview({
    userId: u1.id,
    movieId: movie1.id,
    content: "contentasdsa",
    rating: 10,
  });
  const u2Reviews = await db.addReview({
    userId: u2.id,
    movieId: movie1.id,
    content: "contentasdsa",
    rating: 10,
  });
  const u3Reviews = await db.addReview({
    userId: u1.id,
    movieId: movie2.id,
    content: "contentasdsasasd",
    rating: 1,
  });
  // console.log(u1Reviews);
  // console.log(u2Reviews);
  // console.log(u3Reviews);
})();

export default db;
