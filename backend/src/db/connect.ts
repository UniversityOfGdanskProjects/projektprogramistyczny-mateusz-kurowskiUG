import Axios, { type AxiosResponse } from "axios";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import _ from "lodash";
import neo4j from "neo4j-driver";
import Neode, { type Model, type Node, type NodeCollection } from "neode";
import { v4 as uuidv4 } from "uuid";
// Import jwt from "jsonwebtoken";
import { emailRegex, passwordRegex } from "../data/regex";
import type { ICast } from "../src/interfaces/ICast";
import {
	type IAddReviewResponse,
	type IAddToPlaylistResponse,
	type IAddToWatchlistResponse,
	type ICreatePlaylistResponse,
	EDBMessage,
	type IDeleteFromWatchlistResponse,
	type IDeleteReviewResponse,
	type IGetGenresReponse,
	type IGetMovieResponse,
	type IGetPlaylistResponse,
	type IGetPlaylistsResponse,
	type IGetReviewsResponse,
	type IGetUserResponse,
	type IGetWatchlistResponse,
	type TLoginResponse,
	type IMovieCreationResponse,
	type IMovieDeletionResponse,
	type IMovieUpdateResponse,
	type IRemoveFromPlaylistResponse,
	type IRenamePlaylistResponse,
	type IUpdateUserProfileResponse,
	type IUserCreationResponse,
	type IReviewValid,
} from "../src/interfaces/IDBResponse";
import type IGenre from "../src/interfaces/Genre";
import type IMovie from "../src/interfaces/Movie";
import type { IMovieUpdate } from "../src/interfaces/MovieUpdate";
import type IPlaylist from "../src/interfaces/Playlist";
import type { IReview } from "../src/interfaces/IReview";
import type IUser from "../src/interfaces/User";
import type Envs from "../src/interfaces/envs";
import type INewUser from "../src/interfaces/newUser";
import castSchema from "./models/Cast";
import genreSchema from "./models/Genre";
import movieSchema from "./models/Movie";
import playlistSchema from "./models/Playlist";
import userSchema from "./models/User";

class Database {
	instance: Neode;
	cDriver: any;
	cSession: any;
	envs: Envs;
	// Models
	users: Model<IUser>;
	movies: Model<IMovie>;
	playlists: Model<IPlaylist>;
	genres: Model<IGenre>;
	cast: Model<ICast>;
	salt: string;
	emailRegex: RegExp = emailRegex;
	passwordRegex: RegExp = passwordRegex;
	tmdbHeaders = {
		accept: "application/json",
		Authorization:
			"Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYjAxMzkxMjUxNjBjMTQzYWE5ZmUzZDgwYTA1YzQ5ZCIsInN1YiI6IjY1N2Y3NzI5NTI4YjJlMDcyNDNiMGViZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.-96365PpSY8BgLFO7CRfNrx8NBk1mXLiI_ycHcSOsKU",
	};

	constructor() {
		bcrypt.genSalt(10, (error, salt) => {
			this.salt = salt;
		});
		this.getEnvs();
		this.setUp();
		this.dropAll().then(() => {
			this.testData().then(() => {
				console.log("loaded test data");
			});
		});
		this.connectToClassicDriver();
	}

	async connectToClassicDriver(): Promise<any> {
		const driver = neo4j.driver(
			"neo4j://localhost:7687",
			neo4j.auth.basic("neo4j", "test1234"),
		);
		this.cDriver = driver;
		console.log("connected to neo4j classic driver");

		return driver;
	}

	async dropAll(): Promise<void> {
		Promise.all([
			this.users.deleteAll(),
			this.movies.deleteAll(),
			this.playlists.deleteAll(),
			this.genres.deleteAll(),
			this.cast.deleteAll(),
		])
			.then(() => {
				console.log("Dropped all database");
			})
			.catch(() => {
				console.log("could not drop all db");
			});
	}

	async loadTestMovies(): Promise<void> {
		const pages = 5;
		const promises: Array<Promise<AxiosResponse>> = [];
		const pagesArray = Array.from(Array.from({ length: pages }).keys()).map(
			(i) => i + 1,
		);
		pagesArray.map((page) => {
			const URL = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=plS&page=${page}&sort_by=popularity.desc`;
			const testMovies = Axios.get(URL, { headers: this.tmdbHeaders });
			promises.push(testMovies);
		});
		Promise.all(promises)
			.then((res) => {
				for (const response of res) {
					response.data.results.forEach(async (movie: IMovie) => {
						const movieWithDetaisl = await this.getTMDBMovieDetails(movie.id);
						const { genres }: { genres: Array<{ id: number; name: string }> } =
							movieWithDetaisl;
						const movieNode = await this.movies.create(movieWithDetaisl);

						genres.forEach(async ({ id }) => {
							const genreNode = await this.genres.first("TMDBId", id);
							if (!genreNode) {
								return;
							}

							await movieNode.relateTo(genreNode, "genre", {
								date: new Date(),
							});
						});
					});
				}
			})
			.catch((error) => {
				console.log(error);
			});
	}

	async getTMDBMovieDetails(id: number): Promise<IMovie> {
		const URL = `https://api.themoviedb.org/3/movie/${id}?language=pl`;
		try {
			const movie = await Axios.get(URL, { headers: this.tmdbHeaders });
			const movieDetails = movie.data;
			const movieToAppend: IMovie & {
				genres: Array<Record<string, unknown>>;
			} = this.TmdbToMovie(movieDetails);
			return movieToAppend;
		} catch {
			throw new Error("Unable to get movie details");
		}
	}

	async getMovieByTMDBId(movieId: number) {
		const movie = await this.movies.first("TMDBId", movieId);
		if (!movie) {
			return {
				result: false,
				msg: EDBMessage.MOVIE_NOT_FOUND,
				data: undefined,
			};
		}

		const genres = (await movie.get("genre")).toJson();

		const movieJson = movie.properties();
		console.log(movieJson);

		return {
			result: true,
			msg: EDBMessage.MOVIE_FOUND,
			data: { ...movieJson, genres },
		};
		return movie;
	}

	getEnvs() {
		dotenv.config();
		const environments = {
			TMDB_ACCESS_TOKEN: process.env.TMDB_ACCESS_TOKEN || "",
			API_KEY: process.env.API_KEY || "",
			NEO4J_URI: process.env.NEO4J_URI || "",
			NEO4J_USERNAME: process.env.NEO4J_USERNAME || "",
			NEO4J_PASSWORD: process.env.NEO4J_PASSWORD || "",
		};
		this.envs = environments;
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
			id: "fca4b1e4-2f59-4352-bd61-8b3bf804686f",
			name: "testGenre",
			TMDBId: 404,
		});
		const testGenre2 = await this.genres.create({
			id: "fca4b1e4-2f59-4352-bd61-8b3bf804686d",
			name: "testGenre2",
			TMDBId: 406,
		});
		const testGenre3 = await this.genres.create({
			id: "fca4b1e4-2f59-4352-bd61-8b3bf804686e",
			name: "testGenre3",
			TMDBId: 405,
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
			// Overview: tmdbMovie.overview || "",
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
			// Overview: tmdbMovie.overview || "",
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

		const m1 = database.createMovie(movie1, [testGenre.properties().id]);
		const m2 = database.createMovie(movie2, [testGenre2.properties().id]);

		const m3 = database.createMovie(
			{
				id: "b47fa852-dec5-408f-a7d7-f8ab62297609",
				title: "title",
				// Overview: tmdbMovie.overview || "",
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
			[testGenre3.properties().id],
		);
		const playlist12: IPlaylist = {
			id: "b47fa852-dec5-408f-a7d7-f8ab62297610",
			name: "p1234",
			date: new Date(),
		};
		const emptyPlaylist: IPlaylist = {
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
		return {
			u1,
			u2,
			movie1,
			movie2,
			movie3,
			playlist12,
			emptyPlaylist,
		};
	}

	async getGenres(): Promise<IGetGenresReponse> {
		const genres = await this.genres.all();
		if (!genres) {
			return {
				result: false,
				msg: EDBMessage.GENRES_FOUND,
				data: undefined,
			};
		}

		const genresJson = await Promise.all(
			genres.map(async (genre) => {
				const json = await genre.properties();
				return json;
			}),
		);
		return { result: true, msg: EDBMessage.GENRES_FOUND, data: genresJson };
	}



	async getMoviesByGenre(genreId: string): Promise<IGetMovieResponse> {
		const genre = await this.genres.find(genreId);
		if (!genre) {
			return {
				result: false,
				msg: EDBMessage.GENRE_NOT_FOUND,
				data: undefined,
			};
		}

		const movies = await genre.get("movies");
		if (!movies) {
			return { result: false, msg: EDBMessage.MOVIES_NOT_FOUND, data: [] };
		}

		const moviesJson = movies.map((movie) => movie.properties());
		return { result: true, msg: EDBMessage.MOVIES_FOUND, data: moviesJson };
	}

	async watchedMovies(userId: string): Promise<IGetMovieResponse> {
		const user = await this.users.find(userId);
		if (!user) {
			return { result: false, msg: EDBMessage.USER_NOT_FOUND, data: undefined };
		}

		const watched = await user.get("watched");
		if (!watched) {
			return { result: false, msg: EDBMessage.MOVIES_NOT_FOUND, data: [] };
		}

		const movies = watched.map((movie) => movie.properties());
		this.getMovie;
		return { result: true, msg: EDBMessage.MOVIES_FOUND, data: movies };
	}

	setUp() {
		// This.instance = new Neode(
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

	async getUserProfile(id: string): Promise<IGetUserResponse> {
		const user = await this.users.find(id);
		if (!user) {
			return { result: false, msg: EDBMessage.USER_NOT_FOUND, data: undefined };
		}

		const userJson = user.properties();
		delete userJson?.password;
		return { result: true, msg: EDBMessage.USER_FOUND, data: userJson };
	}

	// Async exportDataFromNeo4j() {
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
	async createUser(user: INewUser): Promise<IUserCreationResponse> {
		const session = this.cDriver.session();
		const result = await session.run("RETURN apoc.create.uuid() as output");
		const id = result.records[0].get("output");
		if (!this.emailRegex.test(user.email)) {
			return { result: false, msg: EDBMessage.INVALID_EMAIL, data: undefined };
		}

		if (!this.passwordRegex.test(user.password)) {
			return {
				result: false,
				msg: EDBMessage.INVALID_PASSWORD,
				data: undefined,
			};
		}

		const foundEmail = (await this.users.all({ email: user.email })).length;
		if (foundEmail) {
			return { result: false, msg: EDBMessage.USER_EXISTS, data: undefined };
		}

		const hashedPassword = await bcrypt.hash(user.password, this.salt);

		const newUser = {
			...user,
			id,
			password: hashedPassword,
			role: "user",
		};
		const createdUser = await this.users.create(newUser);
		const userResponse = createdUser.properties();

		return {
			result: true,
			data: userResponse,
			msg: EDBMessage.USER_CREATED,
		};
	}

	TmdbToMovie(tmdbMovie): IMovie {
		const movie: IMovie = {
			id: uuidv4(),
			TMDBId: tmdbMovie.id,
			title: tmdbMovie.title,
			overview: tmdbMovie.overview || " ",
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

	async loadTMDBGenres(): Promise<void> {
		const URL = "https://api.themoviedb.org/3/genre/movie/list";
		try {
			const result = await (await Axios.get(URL, { headers: this.tmdbHeaders }))
				.data;
			const genres = result.genres.map((genre) => {
				const newGenre: IGenre = {
					id: uuidv4(),
					name: genre.name,
					TMDBId: genre.id,
				};
				return this.genres.create(newGenre);
			});
			Promise.all(genres)
				.then((res: Array<Neode.Node<IGenre>>) => {
					console.log("Successfully loaded genres");
					res;
				})
				.catch((error) => {
					console.log("Genres downloaded, but not saved due to:", error);
				});
		} catch {
			console.log("Unable to load genres from TMDB");
		}
	}

	// Admin

	async updateUserProfile(
		user: IUser & { new_password: string },
	): Promise<IUpdateUserProfileResponse> {
		const { id, password, email, new_password } = user;
		const userToUpdate = await this.users.find(id);
		const errors: EDBMessage[] = [];
		if (!userToUpdate) {
			return {
				result: false,
				errors: [...errors, EDBMessage.USER_NOT_FOUND],
				user: false,
			};
		}

		if (password) {
			if (!this.passwordRegex.test(new_password)) {
				const res = {
					result: false,
					errors: [...errors, 1],
					user: undefined,
				};
				return res;
			}

			await bcrypt.hash(password, this.salt);

			if (!this.emailRegex.test(email)) {
				return {
					result: false,
					errors: [...errors, EDBMessage.INVALID_EMAIL],
					user: undefined,
				};
			}

			await userToUpdate.update({ email }).catch(() => {
				errors.push(EDBMessage.EMAIL_NOT_UPDATED);
			});

			const passwordMatches = userToUpdate.get("password") === password;
			if (!passwordMatches) {
				return {
					result: false,
					errors: [...errors, EDBMessage.INVALID_PASSWORD],
					user: undefined,
				};
			}

			if (new_password) {
				if (!this.passwordRegex.test(new_password)) {
					return {
						result: false,
						errors: [...errors, EDBMessage.INVALID_PASSWORD],
						user: undefined,
					};
				}

				const hashedNewPassword = await bcrypt.hash(new_password, this.salt);
				await userToUpdate.update({ password: hashedNewPassword }).catch(() => {
					errors.push(EDBMessage.PASSWORD_NOT_UPDATED);
				});
			}

			const updatedUser = await this.users.find(id);
			return {
				result: true,
				errors: EDBMessage.USER_UPDATED,
				user: updatedUser.properties(),
			};
		}

		if (email) {
			if (!this.emailRegex.test(email)) {
				return {
					result: false,
					errors: [...errors, EDBMessage.INVALID_EMAIL],
					user: undefined,
				};
			}

			userToUpdate.update({ [email]: email }).catch(() => {
				errors.push(EDBMessage.EMAIL_NOT_UPDATED);
			});
		}

		if (errors.length === 0) {
			return {
				result: false,
				msg: EDBMessage.USER_NOT_UPDATED,
				data: undefined,
				errors: [...errors, EDBMessage.USER_NOT_UPDATED],
			};
		}

		const userJson = updatedUser.properties();
		delete userJson.password;
		return {
			result: true,
			msg: EDBMessage.USER_UPDATED,
			user: userJson,
			errors: [],
		};
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
	}): Promise<IMovieCreationResponse> {
		const genre = await this.genres.find(genreId);
		if (!genre) {
			return {
				result: false,
				msg: EDBMessage.GENRE_NOT_FOUND,
				data: undefined,
			};
		}

		const movie = {
			id: uuidv4(),
			title,
			popularity,
			release_date,
			poster_path,
			adult,
			backdrop_path,
			// TMDBId: -1,
			budget,
			status,
		};
		const createdMovie = await this.movies.create(movie);
		if (!createdMovie) {
			return {
				result: false,
				msg: EDBMessage.MOVIE_NOT_CREATED,
				data: undefined,
			};
		}

		const related = await createdMovie.relateTo(genre, "genre", {
			date: new Date(),
		});
		console.log(related);

		const movieJson = createdMovie.properties();
		return { result: true, data: movieJson, msg: EDBMessage.MOVIE_CREATED };
	}

	async updateMovieGenres(movieId: string, genres: string[]) {
		const movie = await this.movies.find(movieId);
		if (!movie) {
			return {
				result: false,
				msg: EDBMessage.MOVIE_NOT_FOUND,
				data: undefined,
			};
		}

		await Promise.all(
			genres.map(async (genreId) => {
				const genre = await this.genres.find(genreId);
				if (!genre) {
					return {
						result: false,
						msg: EDBMessage.GENRE_NOT_FOUND,
						data: undefined,
					};
				}

				return genre;
			}),
		);
	}

	async updateMovie(
		movieId: string,
		update: IMovieUpdate,
	): Promise<IMovieUpdateResponse> {
		const movie = await this.movies.find(movieId);
		if (!movie) {
			return {
				result: false,
				msg: EDBMessage.MOVIE_NOT_FOUND,
				data: undefined,
			};
		}

		const updated = await movie.update(update);
		console.log(updated.properties());

		if (!updated) {
			return {
				result: false,
				msg: EDBMessage.MOVIE_NOT_UPDATED,
				data: undefined,
			};
		}

		const movieJson = updated.properties();
		return { result: true, data: movieJson, msg: EDBMessage.MOVIE_UPDATED };
	}

	async deleteMovie(movieId: string): Promise<IMovieDeletionResponse> {
		if (!movieId) {
			return {
				result: false,
				msg: EDBMessage.MOVIE_NOT_FOUND,
				data: undefined,
			};
		}

		const movie = await this.movies.find(movieId);
		if (!movie) {
			return {
				result: false,
				msg: EDBMessage.MOVIE_NOT_FOUND,
				data: undefined,
			};
		}

		const result = await movie.delete();
		if (!result) {
			return {
				result: false,
				msg: EDBMessage.MOVIE_NOT_DELETED,
				data: undefined,
			};
		}

		return {
			result: true,
			msg: EDBMessage.MOVIE_DELETED,
			data: movie.properties(),
		};
	}
	// Admin

	async loginUser(email: string, password: string): Promise<TLoginResponse> {
		const user = await (await this.users.all({ email })).first();
		if (!user) {
			return {
				result: false,
				msg: EDBMessage.USER_NOT_FOUND,
				data: undefined,
			};
		}

		if (user.get("password") !== bcrypt.hashSync(password, this.salt)) {
			return {
				result: false,
				msg: EDBMessage.INVALID_CREDIENTIALS,
				data: undefined,
			};
		}

		const userJson = await user.properties();
		delete userJson.password;
		return { result: true, msg: EDBMessage.USER_LOGGED_IN, data: userJson };
	}

	async getMovieById(movieId: string): Promise<IGetMovieResponse> {
		const movie = await this.movies.find(movieId);
		if (!movie) {
			return {
				result: false,
				msg: EDBMessage.MOVIE_NOT_FOUND,
				data: undefined,
			};
		}

		const genres = await movie.get("genre");

		const movieJson = movie.properties();
		return {
			result: true,
			msg: EDBMessage.MOVIE_FOUND,
			data: { ...movieJson, genres },
		};
	}

	async createMovie(
		movie: IMovie,
		genres: string[],
	): Promise<IMovieCreationResponse> {
		const createdMovie = await this.movies.create(movie);
		if (!createdMovie) {
			return {
				result: false,
				msg: EDBMessage.MOVIE_NOT_CREATED,
				data: undefined,
			};
		}

		genres.forEach(async (genreId) => {
			const genre = await this.genres.find(genreId);

			if (!genre) {
				return {
					result: false,
					msg: EDBMessage.GENRE_NOT_FOUND,
					data: undefined,
				};
			}

			const related = await createdMovie.relateTo(genre, "genre", {
				date: new Date(),
			});
			if (!related) {
				return {
					result: false,
					msg: EDBMessage.MOVIE_NOT_CREATED,
					data: undefined,
				};
			}
		});

		const movieJson = await createdMovie.toJson();
		return { result: true, data: movieJson, msg: EDBMessage.MOVIE_CREATED };
	}

	async getTmdbMPopular(): Promise<IGetMovieResponse> {
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
				msg: EDBMessage.MOVIE_FOUND,
				data: await settledMovies,
			};
		} catch {
			return { result: false, msg: EDBMessage.TMDB_API_ERROR, data: [] };
		}
	}

	async getTmdbMById(id: number): Promise<IGetMovieResponse> {
		const url = `https://api.themoviedb.org/3/movie/${id}`;
		try {
			const movieDetails = (await Axios.get(url, { headers: this.tmdbHeaders }))
				.data;
			const movie: IMovie = {
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
			return { result: true, msg: EDBMessage.MOVIE_FOUND, data: movie };
		} catch {
			return { result: false, msg: EDBMessage.TMDB_API_ERROR, data: undefined };
		}
	}

	async searchTmdb(query: string): Promise<IGetMovieResponse> {
		if (!query) {
			return { result: false, msg: EDBMessage.INVALID_QUERY, data: undefined };
		}

		const url = `https://api.themoviedb.org/3/search/movie?query=${query}&language=pl&page=1&include_adult=true`;
		try {
			const search = await Axios.get(url, { headers: this.tmdbHeaders });
			const movies = search.data.results.map((movie: IMovie) =>
				this.TmdbToMovie(movie),
			);
			return { result: true, data: movies, msg: EDBMessage.MOVIE_FOUND };
		} catch {
			return { result: false, msg: EDBMessage.TMDB_API_ERROR, data: undefined };
		}
	}

	async getMovie(movieId: string): Promise<Node<IMovie>> {
		const movie = await this.movies.find(movieId);
		if (!movie) {
			return {
				result: false,
				msg: EDBMessage.MOVIE_NOT_FOUND,
				data: undefined,
			};
		}

		const genres = (await movie.get("genre")).map((genre) =>
			genre.properties(),
		);
		const movieJson = movie.properties();
		return {
			result: true,
			msg: EDBMessage.MOVIE_FOUND,
			data: { ...movieJson, genres },
		};
		return movie;
	}

	// WATCHLISTS
	async addToWatchlist(
		userId: string,
		movieId: string,
	): Promise<IAddToWatchlistResponse> {
		const user = await this.users.find(userId);
		if (!user) {
			return { result: false, msg: EDBMessage.USER_NOT_FOUND, data: undefined };
		}

		const movie = await this.movies.find(movieId);
		if (!movie) {
			return {
				result: false,
				msg: EDBMessage.MOVIE_NOT_FOUND,
				data: undefined,
			};
		}

		const watchlist: NodeCollection = await user.get("watchlist");

		if (!watchlist) {
			return {
				result: false,
				msg: EDBMessage.WATCHLIST_NOT_FOUND,
				data: undefined,
			};
		}

		if (watchlist.length === 0) {
			await user.relateTo(movie, "watchlist", { date: new Date() });
			return {
				result: true,
				msg: EDBMessage.WATCHLIST_UPDATED,
				data: movie.properties(),
			};
		}

		const isInWatchlist = watchlist.find(
			(movie) => movie.properties().id === movieId,
		);
		if (!isInWatchlist) {
			await user.relateTo(movie, "watchlist", { date: new Date() });
			return {
				result: true,
				msg: EDBMessage.WATCHLIST_UPDATED,
				data: movie.properties(),
			};
		}

		return {
			result: false,
			msg: EDBMessage.ALREADY_IN_WATCHLIST,
			data: undefined,
		};
	}

	async getWatchlist(userId: string): Promise<IGetWatchlistResponse> {
		const user = await this.users.find(userId);
		if (!user) {
			return { result: false, msg: EDBMessage.USER_NOT_FOUND, data: undefined };
		}

		const watchlist: NodeCollection = await user.get("watchlist");

		if (watchlist.length === 0) {
			return {
				result: true,
				msg: EDBMessage.WATCHLIST_EMPTY,
				data: [],
			};
		}

		const watchlistMovies: IMovie[] = watchlist.map((movie) => {
			const genres = movie.get("genre").map((genre) => genre.properties());
			return { ...movie.properties(), genres };
		});
		return {
			result: true,
			msg: EDBMessage.WATCHLIST_FOUND,
			data: watchlistMovies,
		};
	}

	async deleteFromWatchlist(
		userId: string,
		movieId: string,
	): Promise<IDeleteFromWatchlistResponse> {
		const user = await this.users.find(userId);
		if (!user) {
			return { result: false, msg: EDBMessage.USER_NOT_FOUND, data: undefined };
		}

		const movie = await this.movies.find(movieId);
		if (!movie) {
			return {
				result: false,
				msg: EDBMessage.MOVIE_NOT_FOUND,
				data: undefined,
			};
		}

		const watchlist: NodeCollection = await user.get("watchlist");
		if (!watchlist) {
			return {
				result: false,
				msg: EDBMessage.WATCHLIST_NOT_FOUND,
				data: undefined,
			};
		}

		const empty = watchlist.length === 0;
		if (empty) {
			return {
				result: false,
				msg: EDBMessage.WATCHLIST_EMPTY,
				data: undefined,
			};
		}

		const isInWatchlist = watchlist.find(
			(movie) => movie.properties().id === movieId,
		);
		if (!isInWatchlist) {
			return {
				result: false,
				msg: EDBMessage.NOT_IN_WATCHLIST,
				data: undefined,
			};
		}

		const result = await user.detachFrom(movie);
		if (!result) {
			return {
				result: false,
				msg: EDBMessage.WATCHLIST_NOT_UPDATED,
				data: undefined,
			};
		}

		return {
			result: true,
			msg: EDBMessage.WATCHLIST_UPDATED,
			data: movie.properties(),
		};
	}

	async createPlaylist(
		userId: string,
		name: string,
	): Promise<ICreatePlaylistResponse> {
		const user = await this.users.find(userId);
		if (!name) {
			return { result: false, msg: EDBMessage.INVALID_NAME, data: undefined };
		}

		if (!user) {
			return { result: false, msg: EDBMessage.USER_NOT_FOUND, data: undefined };
		}

		const session = this.cDriver.session();
		const q1 = await session.run("RETURN apoc.create.uuid() as output");
		const id = q1.records[0].get("output");
		const q2 = await session.run("return apoc.date.currentTimestamp() as date");
		const date = q2.records[0].get("date");
		const parsed = new Date(Number(date));
		const randomString = await session.run(
			"return apoc.text.random(10) as output",
		);
		const randomStrRes = randomString.records[0].get("output");
		const newPlaylist: IPlaylist = {
			id,
			name,
			date: new Date(parsed),
			checksum: randomStrRes,
			// Movies: [],
		};
		const createdPlaylist = await this.playlists.create(newPlaylist);
		if (!createdPlaylist) {
			return {
				result: false,
				msg: EDBMessage.PLAYLIST_NOT_CREATED,
				data: undefined,
			};
		}

		const related = user.relateTo(createdPlaylist, "playlist", {
			date: parsed,
		});
		if (!related) {
			return {
				result: false,
				msg: EDBMessage.PLAYLIST_NOT_CREATED,
				data: undefined,
			};
		}

		return {
			result: true,
			msg: EDBMessage.PLAYLIST_CREATED,
			data: createdPlaylist.properties(),
		};
	}

	// Async getPlaylists(userId: string): Promise<IGetPlaylistsResponse> {
	//   const playlists = (await this.playlists.all()).forEach(async (playlist) => {
	//     const playlistJson = await playlist.toJson();
	//     console.log(playlistJson);
	//   });
	//   // console.log(await playlists);
	// }

	async getMoviesInPlaylist(playlistId: string): Promise<IMovie[]> {
		const playlist = await this.playlists.find(playlistId);
		if (!playlist) {
			return [];
		}

		const movies_rel: NodeCollection = await playlist.get("has");
		if (!movies_rel) {
			return [];
		}

		if (movies_rel.length === 0) {
			return [];
		}

		const movies = movies_rel.map((rel: Node<IMovie>) => {
			const properties = rel.properties();
			const genres = rel.get("genre").map((genre) => genre.properties());
			console.log({ ...properties, genres });

			return { ...properties, genres };
		});
		return movies;
	}

	async getPlaylists(userId: string): Promise<IGetPlaylistsResponse> {
		const user = await this.users.find(userId);
		if (!user) {
			return { result: false, msg: EDBMessage.USER_NOT_FOUND, data: undefined };
		}

		const playlists_rel: NodeCollection = await user.get("playlist");
		if (!playlists_rel) {
			return {
				result: true,
				msg: EDBMessage.NO_PLAYLISTS,
				data: [],
			};
		}

		if (playlists_rel.length === 0) {
			return {
				result: true,
				msg: EDBMessage.NO_PLAYLISTS,
				data: [],
			};
		}

		const playlists = playlists_rel.map((rel: Node<IPlaylist>) => {
			const playlist = rel.properties();
			return playlist;
		});
		if (!playlists) {
			return {
				result: true,
				msg: EDBMessage.PLAYLIST_NOT_FOUND,
				data: undefined,
			};
		}

		const playlistsWithMovies = await Promise.all(
			playlists.map(async (playlist) => {
				const movies = await this.getMoviesInPlaylist(playlist.id);

				return { ...playlist, movies };
			}),
		);
		return {
			result: true,
			msg: EDBMessage.PLAYLIST_FOUND,
			data: playlistsWithMovies,
		};
	}

	async addToPlaylist(
		playlistId: string,
		movieId: string,
	): Promise<IAddToPlaylistResponse> {
		const playlist = await this.playlists.find(playlistId);
		if (!playlist) {
			return {
				result: false,
				msg: EDBMessage.PLAYLIST_NOT_FOUND,
				data: undefined,
			};
		}

		const movie = await this.movies.find(movieId);
		if (!movie) {
			return {
				result: false,
				msg: EDBMessage.MOVIE_NOT_FOUND,
				data: undefined,
			};
		}

		const isInPlaylist: NodeCollection = await playlist.get("has");
		if (!isInPlaylist) {
			return {
				result: false,
				msg: EDBMessage.PLAYLIST_NOT_FOUND,
				data: undefined,
			};
		}

		const alreadyInPlaylist = isInPlaylist.find(
			(movie) => movie.properties().id === movieId,
		);
		if (alreadyInPlaylist) {
			return {
				result: false,
				msg: EDBMessage.ALREADY_IN_PLAYLIST,
				data: undefined,
			};
		}

		const related = await playlist.relateTo(movie, "has", { date: new Date() });
		if (!related) {
			return {
				result: false,
				msg: EDBMessage.PLAYLIST_NOT_UPDATED,
				data: undefined,
			};
		}

		return {
			result: true,
			msg: EDBMessage.PLAYLIST_UPDATED,
			data: movie.properties(),
		};
	}

	async removeFromPlaylist(
		playlistId: string,
		movieId: string,
	): Promise<IRemoveFromPlaylistResponse> {
		const playlist = await this.playlists.find(playlistId);
		if (!playlist) {
			return {
				result: false,
				msg: EDBMessage.PLAYLIST_NOT_FOUND,
				data: undefined,
			};
		}

		const movie = await this.movies.find(movieId);
		if (!movie) {
			return {
				result: false,
				msg: EDBMessage.MOVIE_NOT_FOUND,
				data: undefined,
			};
		}

		const isInPlaylist: NodeCollection = await playlist.get("has");
		if (!isInPlaylist) {
			return {
				result: false,
				msg: EDBMessage.PLAYLIST_NOT_FOUND,
				data: undefined,
			};
		}

		const alreadyInPlaylist = await isInPlaylist.find(
			(movie) => movie.properties().id === movieId,
		);
		if (!alreadyInPlaylist) {
			return {
				result: false,
				msg: EDBMessage.NOT_IN_PLAYLIST,
				data: undefined,
			};
		}

		const related = await playlist.detachFrom(movie);
		if (!related) {
			return {
				result: false,
				msg: EDBMessage.PLAYLIST_NOT_UPDATED,
				data: undefined,
			};
		}

		return {
			result: true,
			msg: EDBMessage.PLAYLIST_UPDATED,
			data: movie.properties(),
		};
	}

	async renamePlaylist(
		playlistId: string,
		name: string,
	): Promise<IRenamePlaylistResponse> {
		const playlist = await this.playlists.find(playlistId);
		if (!playlist) {
			return {
				result: false,
				msg: EDBMessage.PLAYLIST_NOT_FOUND,
				data: undefined,
			};
		}

		const date = new Date();
		const result = await playlist.update({ name, date });
		if (!result) {
			return {
				result: false,
				msg: EDBMessage.PLAYLIST_NOT_UPDATED,
				data: undefined,
			};
		}

		return {
			result: true,
			msg: EDBMessage.PLAYLIST_UPDATED,
			data: playlist.properties(),
		};
	}

	async getPlaylistById(playlistId: string): Promise<IGetPlaylistResponse> {
		const playlist = await this.playlists.find(playlistId);
		if (!playlist) {
			return {
				result: false,
				msg: EDBMessage.PLAYLIST_NOT_FOUND,
				data: undefined,
			};
		}

		return {
			result: true,
			msg: EDBMessage.PLAYLIST_FOUND,
			data: playlist.properties(),
		};
	}

	async deletePlaylist(playlistId: string): Promise<IDeletePlaylistResponse> {
		const playlist = await this.playlists.find(playlistId);
		if (!playlist) {
			return {
				result: false,
				msg: EDBMessage.PLAYLIST_NOT_FOUND,
				data: undefined,
			};
		}

		const result = await playlist.delete();
		if (!result) {
			return {
				result: false,
				msg: EDBMessage.PLAYLIST_NOT_DELETED,
				data: undefined,
			};
		}

		return {
			result: true,
			msg: EDBMessage.PLAYLIST_DELETED,
			data: playlist.properties(),
		};
	}

	// REVIEWS
	validateReview(review: IReview): IReviewValid {
		if (review.rating < 0 || review.rating > 10) {
			return { result: false, msg: EDBMessage.INVALID_RATING };
		}

		if (review.content.length < 10 || review.content.length > 500) {
			return { result: false, msg: EDBMessage.INVALID_CONTENT };
		}

		if (!review.movieId) {
			return { result: false, msg: EDBMessage.MOVIE_NOT_FOUND };
		}

		if (!review.userId) {
			return { result: false, msg: EDBMessage.USER_NOT_FOUND };
		}

		return { result: true, msg: EDBMessage.REVIEW_VALID };
	}

	async getReviewsByUser(user: Node<IUser>): Promise<IReview[]> {
		const reviews_rel: NodeCollection = await user.get("reviewed");
		return await reviews_rel.map((review) => {
			const movieId = review.endNode().properties().id;
			const userObject = review.startNode().properties();
			const reviewObject = {
				...review.properties(),
				movieId,
				userId: userObject.id,
				email: userObject.email,
			};
			return reviewObject;
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
	}): Promise<IAddReviewResponse> {
		const review: IReview = {
			id: uuidv4(),
			date: new Date(),
			content,
			rating,
			movieId,
			userId,
		};
		const isValid = this.validateReview(review);
		if (!isValid.result) {
			return {
				result: false,
				msg: isValid.msg,
				data: undefined,
			};
		}

		const user = await this.users.find(userId);
		if (!user) {
			return { result: false, msg: EDBMessage.USER_NOT_FOUND, data: undefined };
		}

		const movie = await this.movies.find(movieId);
		if (!movie) {
			return {
				result: false,
				msg: EDBMessage.MOVIE_NOT_FOUND,
				data: undefined,
			};
		}

		const usersReviews = await this.getReviewsByUser(user);
		const alreadyReviewed = usersReviews.find(
			(review) => review.movieId === movieId,
		);
		if (alreadyReviewed) {
			return {
				result: false,
				msg: EDBMessage.ALREADY_REVIEWED,
				data: undefined,
			};
		}

		const related = await user.relateTo(movie, "reviewed", review);
		if (!related) {
			return {
				result: false,
				msg: EDBMessage.REVIEW_NOT_CREATED,
				data: undefined,
			};
		}

		return { result: true, msg: EDBMessage.REVIEW_CREATED, data: review };
	}

	async getReviewsByMovie(movieId: number): Promise<IGetReviewsResponse> {
		if (!movieId) {
			return {
				result: false,
				msg: EDBMessage.MOVIE_NOT_FOUND,
				data: undefined,
			};
		}

		const movie = await this.movies.first("TMDBId", movieId);
		if (!movie) {
			return {
				result: false,
				msg: EDBMessage.MOVIE_NOT_FOUND,
				data: undefined,
			};
		}

		const reviews_rel: NodeCollection = await movie.get("reviewed");
		if (!reviews_rel) {
			return {
				result: false,
				msg: EDBMessage.REVIEWS_NOT_FOUND,
				data: undefined,
			};
		}

		const reviews = await reviews_rel.map((review) => {
			const movieId = review.endNode().properties().id;
			const userId = review.startNode().properties();
			const reviewObject = {
				...review.properties(),
				movieId,
				userId: userId.id,
				email: userId.email,
			};
			return reviewObject;
		});
		return { result: true, msg: EDBMessage.REVIEWS_FOUND, data: reviews };
	}

	async deleteReview(
		movieId: string,
		reviewId: string,
	): Promise<IDeleteReviewResponse> {
		const reviewNotFound: IDeleteReviewResponse = {
			result: false,
			msg: EDBMessage.REVIEW_NOT_FOUND,
			data: undefined,
		};
		if (!movieId || !reviewId) {
			return reviewNotFound;
		}

		const movie = await this.movies.find(movieId);
		if (!movie) {
			return {
				result: false,
				msg: EDBMessage.MOVIE_NOT_FOUND,
				data: undefined,
			};
		}

		const movieReviews = await this.getReviewsByMovie(movieId);
		if (!movieReviews.result || !movieReviews.data) {
			return reviewNotFound;
		}

		const reviewToDelete = movieReviews.data.find(
			(review) => review.id === reviewId,
		);

		if (!reviewToDelete) {
			return reviewNotFound;
		}

		const user = await this.users.find(reviewToDelete.userId);
		if (!user) {
			return { result: false, msg: EDBMessage.USER_NOT_FOUND, data: undefined };
		}

		const result = await user.detachFrom(movie);
		if (!result) {
			return {
				result: false,
				msg: EDBMessage.REVIEW_NOT_DELETED,
				data: undefined,
			};
		}

		return {
			result: true,
			msg: EDBMessage.REVIEW_DELETED,
			data: reviewToDelete,
		};
	}

	async exportToJson() {
		const session = database.cDriver.session();
		const result = await session.run('call apoc.export.json.all("/tmdb.json")');
		return result;
	}

	async getUserStats(userId: string) {
		const user = await this.users.find(userId);
		if (!user) {
			return { result: false, msg: EDBMessage.USER_NOT_FOUND, data: undefined };
		}

		const reviews = this.getReviewsByUser(user);
		const watchlist = this.getWatchlist(userId);
		const playlists = this.getPlaylists(userId);
		const statsProm = await Promise.all([reviews, watchlist, playlists]);
		const [reviewsResult, watchlistResult, playlistsResult] = statsProm;
		const genres = [
			...watchlistResult.data?.flatMap((movie) => movie.genres),
			...playlistsResult.data?.flatMap((playlist) =>
				playlist.movies?.flatMap((movie) => movie.genres),
			),
		];
		const genresWithoutDuplicates = _.uniqBy(genres, (genre) => genre.id);
		const countedGenres = _.countBy(genres, (genre) => genre.name);
		const stats = {
			reviews: reviewsResult.length,
			watchlist: watchlistResult.data.length,
			playlists: playlistsResult.data.length,
			genresStats: countedGenres,
		};
		return { result: true, msg: EDBMessage.USER_STATS_FOUND, data: stats };
	}

	async getFiveRandomMovies() {
		const session = database.cDriver.session();
		const result = await session.run(
			`MATCH (n) WITH n, rand() AS r ORDER BY r LIMIT 5
RETURN n`,
		);

		const movies = result.records.map((record) => {
			const movie = record.get("n").properties;
			return movie;
		});
		return movies;
	}
}
const database = new Database();

(async () => {})();

export default database;
