import Neode, { Model, Node, NodeCollection } from "neode";
import dotenv from "dotenv";
import Envs from "../interfaces/envs";
import userSchema from "./models/User";
import { v4 as uuidv4 } from "uuid";
import newUserInterface from "../interfaces/newUser";
import {
  DBMessage,
  UserCreationResponse,
  GetMovieResponse,
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
  GetReviewsResponse,
  DeleteReviewResponse,
  MovieUpdateResponse,
  GetGenresReponse,
  GetUserResponse,
  UpdateUserProfileResponse,
  MovieDeletionResponse,
} from "../interfaces/DBResponse";
// import jwt from "jsonwebtoken";
import { emailRegex, passwordRegex } from "../data/regex";
import Axios, { AxiosResponse } from "axios";
import movieSchema from "./models/Movie";
import playlistSchema from "./models/Playlist";
import UserInterface from "../interfaces/User";
import MovieInterface from "../interfaces/Movie";
import PlaylistInterface from "../interfaces/Playlist";
import { ReviewInterface } from "../interfaces/ReviewInterface";
import { MovieUpdateInterface } from "../interfaces/MovieUpdate";
import GenreInterface from "../interfaces/Genre";
import genreSchema from "./models/Genre";
import { CastInterface } from "../interfaces/CastInterface";
import castSchema from "./models/Cast";
import bcrypt from "bcrypt";
import neo4j from "neo4j-driver";
class Db {
  instance: Neode;
  cDriver: any;
  cSession: any;
  envs: Envs;
  // models
  users: Model<UserInterface>;
  movies: Model<MovieInterface>;
  playlists: Model<PlaylistInterface>;
  genres: Model<GenreInterface>;
  cast: Model<CastInterface>;
  salt: string;
  emailRegex: RegExp = emailRegex;
  passwordRegex: RegExp = passwordRegex;
  tmdbHeaders = {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYjAxMzkxMjUxNjBjMTQzYWE5ZmUzZDgwYTA1YzQ5ZCIsInN1YiI6IjY1N2Y3NzI5NTI4YjJlMDcyNDNiMGViZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.-96365PpSY8BgLFO7CRfNrx8NBk1mXLiI_ycHcSOsKU",
  };
  constructor() {
    bcrypt.genSalt(10, (err, salt) => {
      this.salt = salt;
    });
    this.getEnvs();
    this.setUp();
    this.dropAll().then(() => {
      this.testData().then((res) => {
        console.log("loaded test data");
      });
    });
    this.connectToClassicDriver();
  }

  async connectToClassicDriver(): Promise<any> {
    const driver = neo4j.driver(
      "neo4j://localhost:7687",
      neo4j.auth.basic("neo4j", "test1234")
    );
    this.cDriver = driver;
    console.log("connected to neo4j classic driver");

    return driver;
  }

  async dropAll(): Promise<boolean> {
    Promise.all([
      this.users.deleteAll(),
      this.movies.deleteAll(),
      this.playlists.deleteAll(),
      this.genres.deleteAll(),
      this.cast.deleteAll(),
    ])
      .then(() => console.log("Dropped all database"))
      .catch(() => console.log("could not drop all db"));
  }

  async loadTestMovies(): Promise<void> {
    const pages = 5;
    const promises: Promise<AxiosResponse>[] = [];
    const pagesArray = Array.from(Array(pages).keys()).map((i) => i + 1);
    pagesArray.map((page) => {
      const URL = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=plS&page=${page}&sort_by=popularity.desc`;
      const testMovies = Axios.get(URL, { headers: this.tmdbHeaders });
      promises.push(testMovies);
    });
    Promise.all(promises)
      .then((res) => {
        res.forEach((response) => {
          const movies = response.data.results.forEach(
            async (movie: MovieInterface) => {
              const movieWithDetaisl = await this.getTMDBMovieDetails(movie.id);
              const { genres }: { genres: { id: number; name: string }[] } =
                movieWithDetaisl;
              const movieNode = await this.movies.create(movieWithDetaisl);

              genres.forEach(async ({ id }) => {
                const genreNode = await this.genres.first("TMDBId", id);
                if (!genreNode) return;
                await movieNode.relateTo(genreNode, "genre", {
                  date: new Date(),
                });
              });
            }
          );
        });
      })
      .catch((e) => console.log(e));
  }
  async getTMDBMovieDetails(id: number): Promise<MovieInterface> {
    const URL = `https://api.themoviedb.org/3/movie/${id}?language=pl`;
    try {
      const movie = await Axios.get(URL, { headers: this.tmdbHeaders });
      const movieDetails = movie.data;
      const movieToAppend: MovieInterface & { genres: object[] } =
        this.TmdbToMovie(movieDetails);
      return movieToAppend;
    } catch (e) {
      throw new Error("Unable to get movie details");
    }
  }
  async getMovieByTMDBId(movieId: number) {
    const movie = await this.movies.first("TMDBId", movieId);
    if (!movie)
      return { result: false, msg: DBMessage.MOVIE_NOT_FOUND, data: undefined };
    const genres = (await movie.get("genre")).toJson();

    const movieJson = movie.properties();
    return {
      result: true,
      msg: DBMessage.MOVIE_FOUND,
      data: { ...movieJson, genres },
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
    this.movies = this.instance.model("Movie", movieSchema);
    this.playlists = this.instance.model("Playlist", playlistSchema);
    this.genres = this.instance.model("Genre", genreSchema);
    this.cast = this.instance.model("Cast", castSchema);
  }

  async testData() {
    const testGenre = await this.genres.create({
      id: "fca4b1e4-2f59-4352-bd61-8b3bf804686e",
      name: "testGenre",
      TMDBId: 404,
    });

    const u1 = {
      email: "email@mail.com",
      password: "Admin123!",
      id: "fca4b1e4-2f59-4352-bd61-8b3bf804686e",
      role: "admin",
    };
    const u2 = {
      email: "email@mail2.com",
      password: "Admin123!",
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
      TMDBId: 10_000,

      release_date: "2021-01-01",
      poster_path:
        "https://image.tmdb.org/t/p/original/pA4sNvcohTNPx3AhEEeIu8gSt7h.jpg",
      adult: false,
      backdrop_path:
        "https://image.tmdb.org/t/p/original/pA4sNvcohTNPx3AhEEeIu8gSt7h.jpg",
      budget: 1,
      status: "status",
    };
    const movie2 = {
      id: "b47fa852-dec5-408f-a7d7-f8ab62297608",
      title: "title",
      TMDBId: 9999,
      // overview: tmdbMovie.overview || "",
      popularity: 1,
      release_date: "2021-01-01",
      poster_path:
        "https://image.tmdb.org/t/p/original/pA4sNvcohTNPx3AhEEeIu8gSt7h.jpg",
      adult: false,
      backdrop_path:
        "https://image.tmdb.org/t/p/original/pA4sNvcohTNPx3AhEEeIu8gSt7h.jpg",
      budget: 1,
      status: "status",
    };

    const m1 = db.createMovie(movie1, [testGenre.properties().id]);
    const m2 = db.createMovie(movie2, [testGenre.properties().id]);

    const m3 = db.createMovie(
      {
        id: "b47fa852-dec5-408f-a7d7-f8ab62297609",
        title: "title",
        // overview: tmdbMovie.overview || "",
        popularity: 1,
        release_date: "2021-01-01",
        poster_path:
          "https://image.tmdb.org/t/p/original/pA4sNvcohTNPx3AhEEeIu8gSt7h.jpg",
        TMDBId: 10_001,

        adult: false,
        backdrop_path:
          "https://image.tmdb.org/t/p/original/pA4sNvcohTNPx3AhEEeIu8gSt7h.jpg",
        budget: 1,
        status: "status",
      },
      [testGenre.properties().id]
    );
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
    const movie3Node = await this.movies.find(movie3.data?.id);
    newUser2.relateTo(movie3Node, "reviewed", {
      id: "7e927b9c-13a3-42ce-b802-e8efa9b12620",
      userId: newUser2.properties().id,
      movieId: movie3.data?.id,
      content: "contentcontentcontent",
      rating: 10,
    });
    newUser.relateTo(newPlaylist, "playlist", { date: new Date() });
    newUser.relateTo(emptyPlaylistR, "playlist", { date: new Date() });
    return { u1, u2, movie1, movie2, movie3, playlist12, emptyPlaylist };
  }

  async getGenres(): Promise<GetGenresReponse> {
    const genres = await this.genres.all();
    if (!genres)
      return {
        result: false,
        msg: DBMessage.GENRES_FOUND,
        data: undefined,
      };
    const genresJson = await Promise.all(
      genres.map(async (genre) => {
        const json = await genre.properties();
        return json;
      })
    );
    return { result: true, msg: DBMessage.GENRES_FOUND, data: genresJson };
  }

  async getAllMovies() {
    const movies = await this.movies.all();
    if (!movies)
      return {
        result: false,
        msg: DBMessage.MOVIES_NOT_FOUND,
        data: undefined,
      };
    const moviesJson = await Promise.all(
      movies.map(async (movie) => {
        const json = await movie.properties();
        return json;
      })
    );
    return { result: true, msg: DBMessage.MOVIES_FOUND, data: moviesJson };
  }

  async getMoviesByGenre(genreId: string): Promise<GetMovieResponse> {
    const genre = await this.genres.find(genreId);
    if (!genre)
      return { result: false, msg: DBMessage.GENRE_NOT_FOUND, data: undefined };
    const movies = await genre.get("movies");
    if (!movies)
      return { result: false, msg: DBMessage.MOVIES_NOT_FOUND, data: [] };
    const moviesJson = movies.map((movie) => movie.properties());
    return { result: true, msg: DBMessage.MOVIES_FOUND, data: moviesJson };
  }

  async watchedMovies(userId: string): Promise<GetMovieResponse> {
    const user = await this.users.find(userId);
    if (!user)
      return { result: false, msg: DBMessage.USER_NOT_FOUND, data: undefined };
    const watched = await user.get("watched");
    if (!watched)
      return { result: false, msg: DBMessage.MOVIES_NOT_FOUND, data: [] };
    const movies = watched.map((movie) => movie.properties());
    this.getMovie;
    return { result: true, msg: DBMessage.MOVIES_FOUND, data: movies };
  }

  setUp() {
    // this.instance = new Neode(
    //   this.envs.NEO4J_URI,
    //   this.envs.NEO4J_USERNAME,
    //   this.envs.NEO4J_PASSWORD
    // );
    this.instance = new Neode("neo4j://localhost:7687", "neo4j", "test1234");
    this.loadModels();
    this.loadTMDBGenres().then(() => {
      this.loadTestMovies();
    });
  }

  async getUserProfile(id: string): Promise<GetUserResponse> {
    const user = await this.users.find(id);
    if (!user)
      return { result: false, msg: DBMessage.USER_NOT_FOUND, data: undefined };
    const userJson = user.properties();
    delete userJson.password;
    return { result: true, msg: DBMessage.USER_FOUND, data: userJson };
  }

  // async exportDataFromNeo4j() {
  //   try {
  //     const session = this.cDriver.session();
  //     const result = await session.run(
  //       `
  //       CALL apoc.export.file.enabled=true;
  //       CALL apoc.export.json.all('tmdb.json',{useTypes:true});`
  //     );

  //     return result;
  //   } catch (e) {
  //     return e;
  //   }
  // }
  async createUser(user: newUserInterface): Promise<UserCreationResponse> {
    const session = this.cDriver.session();
    const result = await session.run(`RETURN apoc.create.uuid() as output`);
    const id = result.records[0].get("output");
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
    const hashedPassword = await bcrypt.hash(user.password, this.salt);

    const newUser = { ...user, id, password: hashedPassword, role: "user" };
    const createdUser = await this.users.create(newUser);
    const userResponse = createdUser.properties();

    return {
      result: true,
      data: userResponse,
      msg: DBMessage.USER_CREATED,
    };
  }

  TmdbToMovie(tmdbMovie): MovieInterface {
    const movie: MovieInterface = {
      id: uuidv4(),
      TMDBId: tmdbMovie.id,
      title: tmdbMovie.title,
      overview: tmdbMovie.overview,
      popularity: tmdbMovie.popularity,
      release_date: tmdbMovie.release_date,
      poster_path: tmdbMovie.poster_path
        ? "https://image.tmdb.org/t/p/original" + tmdbMovie.poster_path
        : "",
      adult: tmdbMovie.adult,
      backdrop_path: tmdbMovie.backdrop_path
        ? "https://image.tmdb.org/t/p/original" + tmdbMovie.backdrop_path
        : "",
      budget: tmdbMovie.budget,
      status: tmdbMovie.status,
      genres: tmdbMovie.genres || [],
    };
    return movie;
  }
  async loadTMDBGenres(): Promise<GenreInterface[]> {
    const URL = "https://api.themoviedb.org/3/genre/movie/list";
    try {
      const result = await (
        await Axios.get(URL, { headers: this.tmdbHeaders })
      ).data;
      const genres = result.genres.map((genre) => {
        const newGenre: GenreInterface = {
          id: uuidv4(),
          name: genre.name,
          TMDBId: genre.id,
        };
        return this.genres.create(newGenre);
      });
      Promise.all(genres)
        .then((res: Neode.Node<GenreInterface>[]) => {
          console.log("Successfully loaded genres");
          res;
        })
        .catch((err) => {
          console.log("Genres downloaded, but not saved due to: ", err);
        });
    } catch (e) {
      console.log("Unable to load genres from TMDB");
    }
  }

  //admin
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

  async updateUserProfile(
    user: UserInterface & { new_password: string }
  ): Promise<UpdateUserProfileResponse> {
    const { id, password, email, new_password } = user;
    const userToUpdate = await this.users.find(id);
    const errors: DBMessage[] = [];
    if (!userToUpdate)
      return {
        result: false,
        errors: [...errors, DBMessage.USER_NOT_FOUND],
        user: false,
      };
    if (password) {
      if (!this.passwordRegex.test(new_password)) {
        const res = {
          result: false,
          errors: [...errors, 1],
          user: undefined,
        };
        return res;
      }
      const hashedPassword = await bcrypt.hash(password, this.salt);

      if (!this.emailRegex.test(email)) {
        return {
          result: false,
          errors: [...errors, DBMessage.INVALID_EMAIL],
          user: undefined,
        };
      } else {
        const emailUpdated = await userToUpdate.update({ email }).catch(() => {
          errors.push(DBMessage.EMAIL_NOT_UPDATED);
        });
      }

      const passwordMatches = userToUpdate.get("password") === password;
      if (!passwordMatches) {
        return {
          result: false,
          errors: [...errors, DBMessage.INVALID_PASSWORD],
          user: undefined,
        };
      }
      if (new_password) {
        if (!this.passwordRegex.test(new_password)) {
          return {
            result: false,
            errors: [...errors, DBMessage.INVALID_PASSWORD],
            user: undefined,
          };
        }
        const hashedNewPassword = await bcrypt.hash(new_password, this.salt);
        await userToUpdate.update({ password: hashedNewPassword }).catch(() => {
          errors.push(DBMessage.PASSWORD_NOT_UPDATED);
        });
      }
      const updatedUser = await this.users.find(id);
      return {
        result: true,
        errors: DBMessage.USER_UPDATED,
        user: updatedUser.properties(),
      };
    }

    if (email) {
      if (!this.emailRegex.test(email)) {
        return {
          result: false,
          errors: [...errors, DBMessage.INVALID_EMAIL],
          user: undefined,
        };
      }
      const emailUpdated = userToUpdate.update({ [email]: email }).catch(() => {
        results.push(DBMessage.EMAIL_NOT_UPDATED);
      });
    }

    if (!errors.length)
      return {
        result: false,
        msg: DBMessage.USER_NOT_UPDATED,
        data: undefined,
      };
    const userJson = updatedUser.properties();
    delete userJson.password;
    return { result: true, msg: DBMessage.USER_UPDATED, data: userJson };
  }
  async createNewMovie({
    title,
    popularity,
    release_date,
    poster_path,
    adult,
    backdrop_path,
    budget,
    status,
    genreId,
  }: {
    title: string;
    popularity: number;
    release_date: string;
    poster_path: string;
    adult: boolean;
    backdrop_path: string;
    budget: number;
    status: string;
    genreId: string;
  }): Promise<MovieCreationResponse> {
    const genre = await this.genres.find(genreId);
    if (!genre)
      return { result: false, msg: DBMessage.GENRE_NOT_FOUND, data: undefined };

    const movie: MovieInterface = {
      id: uuidv4(),
      title,
      popularity,
      release_date,
      poster_path,
      adult,
      backdrop_path,
      budget,
      status,
    };
    const createdMovie = await this.movies.create(movie);
    if (!createdMovie)
      return {
        result: false,
        msg: DBMessage.MOVIE_NOT_CREATED,
        data: undefined,
      };
    const related = await createdMovie.relateTo(genre, "genre", {
      date: new Date(),
    });
    console.log(related);

    const movieJson = createdMovie.properties();
    return { result: true, data: movieJson, msg: DBMessage.MOVIE_CREATED };
  }

  async updateMovieGenres(movieId: string, genres: string[]) {
    const movie = await this.movies.find(movieId);
    if (!movie)
      return { result: false, msg: DBMessage.MOVIE_NOT_FOUND, data: undefined };
    const genreNodes = await Promise.all(
      genres.map(async (genreId) => {
        const genre = await this.genres.find(genreId);
        if (!genre)
          return {
            result: false,
            msg: DBMessage.GENRE_NOT_FOUND,
            data: undefined,
          };
        return genre;
      })
    );
  }

  async updateMovie(
    movieId: string,
    update: MovieUpdateInterface
  ): Promise<MovieUpdateResponse> {
    const movie = await this.movies.find(movieId);
    if (!movie)
      return { result: false, msg: DBMessage.MOVIE_NOT_FOUND, data: undefined };
    const updated = await movie.update(update);
    if (!updated)
      return {
        result: false,
        msg: DBMessage.MOVIE_NOT_UPDATED,
        data: undefined,
      };
    const movieJson = updated.properties();
    return { result: true, data: movieJson, msg: DBMessage.MOVIE_UPDATED };
  }

  async deleteMovie(movieId: string): Promise<MovieDeletionResponse> {
    if (!movieId)
      return { result: false, msg: DBMessage.MOVIE_NOT_FOUND, data: undefined };
    const movie = await this.movies.find(movieId);
    if (!movie)
      return { result: false, msg: DBMessage.MOVIE_NOT_FOUND, data: undefined };
    const result = await movie.delete();
    if (!result) {
      return {
        result: false,
        msg: DBMessage.MOVIE_NOT_DELETED,
        data: undefined,
      };
    }
    return {
      result: true,
      msg: DBMessage.MOVIE_DELETED,
      data: movie.properties(),
    };
  }
  // admin

  async loginUser(email: string, password: string): Promise<LoginResponse> {
    const user = await (await this.users.all({ email })).first();
    if (!user) {
      return {
        result: false,
        msg: DBMessage.USER_NOT_FOUND,
        data: undefined,
      };
    }
    if (user.get("password") !== bcrypt.hashSync(password, this.salt)) {
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
    const genres = await movie.get("genre");

    const movieJson = movie.properties();
    return {
      result: true,
      msg: DBMessage.MOVIE_FOUND,
      data: { ...movieJson, genres },
    };
  }

  async createMovie(
    movie: MovieInterface,
    genres: string[]
  ): Promise<MovieCreationResponse> {
    const createdMovie = await this.movies.create(movie);
    if (!createdMovie)
      return {
        result: false,
        msg: DBMessage.MOVIE_NOT_CREATED,
        data: undefined,
      };
    genres.forEach(async (genreId) => {
      const genre = await this.genres.find(genreId);

      if (!genre)
        return {
          result: false,
          msg: DBMessage.GENRE_NOT_FOUND,
          data: undefined,
        };
      const related = await createdMovie.relateTo(genre, "genre", {
        date: new Date(),
      });
      if (!related)
        return {
          result: false,
          msg: DBMessage.MOVIE_NOT_CREATED,
          data: undefined,
        };
    });

    const movieJson = await createdMovie.toJson();
    return { result: true, data: movieJson, msg: DBMessage.MOVIE_CREATED };
  }

  async getTmdbMPopular(): Promise<GetMovieResponse> {
    const url = "https://api.themoviedb.org/3/movie/popular?language=pl&page=1";
    try {
      const popular = await Axios.get(url, {
        headers: this.tmdbHeaders,
      });

      const movies = popular.data.results.map(async (movie) => {
        const movieWithDetails = this.getTMDBMovieDetails(movie.id);
        return movieWithDetails;
      });
      const settledMovies = await Promise.all(movies);

      return {
        result: true,
        msg: DBMessage.MOVIE_FOUND,
        data: await settledMovies,
      };
    } catch (err) {
      return { result: false, msg: DBMessage.TMDB_API_ERROR, data: [] };
    }
  }
  async getTmdbMById(id: number): Promise<GetMovieResponse> {
    const url = `https://api.themoviedb.org/3/movie/${id}`;
    try {
      const movieDetails = (await Axios.get(url, { headers: this.tmdbHeaders }))
        .data;
      const movie: MovieInterface = {
        id: uuidv4(),
        title: movieDetails.title,
        TMDBId: movieDetails.id,
        overview: movieDetails.overview,
        popularity: movieDetails.popularity,
        release_date: movieDetails.release_date,
        poster_path: movieDetails.poster_path
          ? "https://image.tmdb.org/t/p/original" + movieDetails.poster_path
          : "",
        adult: movieDetails.adult,
        backdrop_path: movieDetails.backdrop_path
          ? "https://image.tmdb.org/t/p/original" + movieDetails.backdrop_path
          : "",
        budget: movieDetails.budget || 0,
        status: movieDetails.status || "",
        genres: movieDetails.genres || [],
      };
      return { result: true, msg: DBMessage.MOVIE_FOUND, data: movie };
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
    if (!movie)
      return { result: false, msg: DBMessage.MOVIE_NOT_FOUND, data: undefined };
    const genres = (await movie.get("genre")).map((genre) =>
      genre.properties()
    );
    const movieJson = movie.properties();
    return {
      result: true,
      msg: DBMessage.MOVIE_FOUND,
      data: { ...movieJson, genres },
    };
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
        result: true,
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
    const session = this.cDriver.session();
    const q1 = await session.run(`RETURN apoc.create.uuid() as output`);
    const id = q1.records[0].get("output");
    const q2 = await session.run(`return apoc.date.currentTimestamp() as date`);
    const date = q2.records[0].get("date");
    const parsed = new Date(Number(date));
    const randomString = await session.run(
      `return apoc.text.random(10) as output`
    );
    const randomStrRes = randomString.records[0].get("output");
    const newPlaylist: PlaylistInterface = {
      id,
      name: name,
      date: new Date(parsed),
      checksum: randomStrRes,
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
      date: parsed,
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
        result: true,
        msg: DBMessage.NO_PLAYLISTS,
        data: [],
      };
    if (!playlists_rel.length) {
      return {
        result: true,
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
        result: true,
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

  async getReviewsByUser(
    user: Node<UserInterface>
  ): Promise<ReviewInterface[]> {
    const reviews_rel: NodeCollection = await user.get("reviewed");
    return await reviews_rel.map((review) => {
      const movieId = review.endNode().properties().id;
      const userObj = review.startNode().properties();
      const reviewObj = {
        ...review.properties(),
        movieId,
        userId: userObj.id,
        email: userObj.email,
      };
      return reviewObj;
    });
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
    const usersReviews = await this.getReviewsByUser(user);
    const alreadyReviewed = usersReviews.find(
      (review) => review.movieId === movieId
    );
    if (alreadyReviewed)
      return {
        result: false,
        msg: DBMessage.ALREADY_REVIEWED,
        data: undefined,
      };
    const related = await user.relateTo(movie, "reviewed", review);
    if (!related)
      return {
        result: false,
        msg: DBMessage.REVIEW_NOT_CREATED,
        data: undefined,
      };
    return { result: true, msg: DBMessage.REVIEW_CREATED, data: review };
  }
  async getReviewsByMovie(movieId: number): Promise<GetReviewsResponse> {
    if (!movieId)
      return { result: false, msg: DBMessage.MOVIE_NOT_FOUND, data: undefined };
    const movie = await this.movies.first("TMDBId", movieId);
    if (!movie)
      return { result: false, msg: DBMessage.MOVIE_NOT_FOUND, data: undefined };
    const reviews_rel: NodeCollection = await movie.get("reviewed");
    if (!reviews_rel)
      return {
        result: false,
        msg: DBMessage.REVIEWS_NOT_FOUND,
        data: undefined,
      };
    const reviews = await reviews_rel.map((review) => {
      const movieId = review.endNode().properties().id;
      const userId = review.startNode().properties();
      const reviewObj = {
        ...review.properties(),
        movieId,
        userId: userId.id,
        email: userId.email,
      };
      return reviewObj;
    });
    return { result: true, msg: DBMessage.REVIEWS_FOUND, data: reviews };
  }
  async deleteReview(
    movieId: string,
    reviewId: string
  ): Promise<DeleteReviewResponse> {
    const reviewNotFound: DeleteReviewResponse = {
      result: false,
      msg: DBMessage.REVIEW_NOT_FOUND,
      data: undefined,
    };
    if (!movieId || !reviewId) return reviewNotFound;
    const movie = await this.movies.find(movieId);
    if (!movie)
      return { result: false, msg: DBMessage.MOVIE_NOT_FOUND, data: undefined };
    const movieReviews = await this.getReviewsByMovie(movieId);
    if (!movieReviews.result || !movieReviews.data) return reviewNotFound;
    const reviewToDelete = movieReviews.data.find(
      (review) => review.id === reviewId
    );

    if (!reviewToDelete) return reviewNotFound;
    const user = await this.users.find(reviewToDelete.userId);
    if (!user)
      return { result: false, msg: DBMessage.USER_NOT_FOUND, data: undefined };
    const result = await user.detachFrom(movie);
    if (!result)
      return {
        result: false,
        msg: DBMessage.REVIEW_NOT_DELETED,
        data: undefined,
      };
    return {
      result: true,
      msg: DBMessage.REVIEW_DELETED,
      data: reviewToDelete,
    };
  }
  async exportToJson() {
    const session = db.cDriver.session();
    const result = await session.run(`call apoc.export.json.all("/tmdb.json")`);
    return result;
  }

  async getFiveRandomMovies() {
    const session = db.cDriver.session();
    const result = await session.run(
      `MATCH (n) WITH n, rand() AS r ORDER BY r LIMIT 5
RETURN n`
    );

    const movies = result.records.map((record) => {
      const movie = record.get("n").properties;
      return movie;
    });
    return movies;
  }
}
const db = new Db();

(async () => {})();

export default db;
