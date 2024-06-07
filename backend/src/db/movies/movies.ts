import type IMovie from "../../interfaces/movie/IMovie";
import { IMovieUpdate } from "../../interfaces/movie/IMovieUpdate";
import type INewReview from "../../interfaces/review/INewReview";
import type IReview from "../../interfaces/review/IReview";
import {
	EDBMessage,
	type IGetMoviesResponse,
	type IGetMovieResponse,
	type IAddReviewResponse,
	type IMovieUpdateResponse,
	type IMovieCreationResponse,
} from "../../interfaces/TDBResponse";
import driver from "../new-connect";
import EMovieQueries from "./movies-queries";

const getAllMovies = async (): Promise<IGetMoviesResponse> => {
	try {
		const { records } = await driver.executeQuery(EMovieQueries.GET_ALL_MOVIES);
		const movies = records.map(
			// biome-ignore lint/complexity/useLiteralKeys: <explanation>
			(record) => record["toObject"]()["m"]["properties"],
		);
		return { result: true, data: movies, msg: EDBMessage.MOVIES_FOUND };
	} catch (e) {
		return { result: false, data: undefined, msg: EDBMessage.MOVIES_NOT_FOUND };
	}
};

const getMovieById = async (id: string): Promise<IGetMovieResponse> => {
	try {
		const { records } = await driver.executeQuery(
			EMovieQueries.GET_MOVIE_BY_ID,
			{
				id,
			},
		);
		const movie = records.map(
			// biome-ignore lint/complexity/useLiteralKeys: <explanation>
			(record) => record["toObject"]()["m"]["properties"],
		)[0] as IMovie;
		if (!movie) throw new Error("Movie not found");
		return { result: true, data: movie, msg: EDBMessage.MOVIE_FOUND };
	} catch (e) {
		return { result: false, data: undefined, msg: EDBMessage.MOVIE_NOT_FOUND };
	}
};

const addAReview = async (
	id: string,
	review: INewReview,
): Promise<IAddReviewResponse> => {
	try {
		const movieQueryResult = await driver.executeQuery(
			EMovieQueries.GET_MOVIE_BY_ID,
			{
				id,
			},
		);
		const movie = movieQueryResult.records.map(
			// biome-ignore lint/complexity/useLiteralKeys: <explanation>
			(record) => record["toObject"]()["m"]["properties"],
		)[0] as IMovie;
		if (!movie) throw new Error("Movie not found");
		const { id: reviewId, ...reviewBody } = review;
		const reviewQueryResult = await driver.executeQuery(
			EMovieQueries.ADD_REVIEW,
			{ id, reviewId, ...reviewBody },
		);
		const reviewResult = movieQueryResult.records.map(
			// biome-ignore lint/complexity/useLiteralKeys: <explanation>
			(record) => record["toObject"]()["m"]["properties"],
		)[0] as IReview;
		return { result: true, data: reviewResult, msg: EDBMessage.REVIEW_CREATED };
	} catch (e) {
		return {
			result: false,
			data: undefined,
			msg: EDBMessage.REVIEW_NOT_CREATED,
		};
	}
};
const createMovie = async (movie: IMovie): Promise<IMovieCreationResponse> => {
	const { genres, ...newMovie } = movie;
	if (!genres || genres.length === 0) return createMovieWithoutGenres(newMovie);
	return createMovieWithGenres(movie);
};

const createMovieWithGenres = async (
	movie: IMovie,
): Promise<IMovieCreationResponse> => {
	try {
		const { records } = await driver.executeQuery(
			EMovieQueries.CREATE_MOVIE_WITH_GENRES,
			movie,
		);
		// biome-ignore lint/complexity/useLiteralKeys: no such fields as properties
		const data = records.map((record) => record.toObject())[0]["node"][
			// biome-ignore lint/complexity/useLiteralKeys: no such fields as properties
			"properties"
		];
		return {
			result: true,
			msg: EDBMessage.MOVIE_CREATED,
			data,
		};
	} catch (e) {
		return {
			result: false,
			msg: EDBMessage.MOVIE_NOT_CREATED,
			data: undefined,
		};
	}
};

const getPaginatedMovies = async (
	pageNumber = 1,
	pageSize = 10,
): Promise<IGetMoviesResponse> => {
	const { records } = await driver.executeQuery(EMovieQueries.GET_MOVIE_PAGE, {
		pageNumber,
		pageSize,
	});
	const movies = records.map(
		// biome-ignore lint/complexity/useLiteralKeys: <explanation>
		(record) => record["toObject"]()["m"]["properties"],
	);

	return { result: true, data: movies, msg: EDBMessage.MOVIES_FOUND };
};

const createMovieWithoutGenres = async (
	movie: IMovie,
): Promise<IMovieCreationResponse> => {
	try {
		const { records } = await driver.executeQuery(
			EMovieQueries.CREATE_MOVIE_WITHOUT_GENRES,
			movie,
		);
		// biome-ignore lint/complexity/useLiteralKeys: no such fields as properties
		const data = records.map((record) => record.toObject())[0]["node"][
			// biome-ignore lint/complexity/useLiteralKeys: no such fields as properties
			"properties"
		];
		return {
			result: true,
			msg: EDBMessage.MOVIE_CREATED,
			data,
		};
	} catch (e) {
		return {
			result: false,
			msg: EDBMessage.MOVIE_NOT_CREATED,
			data: undefined,
		};
	}
};
const updateMovie = async (
	movie: IMovieUpdate,
): Promise<IMovieUpdateResponse> => {
	const { ...movieParams } = movie;
	if (!genres || genres.length === 0) return updateMovieWithoutGenres(movie);
	return updateMovieWithGenres(movie);
};

const updateMovieWithoutGenres = async (
	movie: IMovieUpdate,
): Promise<IMovieUpdateResponse> => {
	const { ...movieParams } = movie;
	try {
		const { records } = await driver.executeQuery(
			EMovieQueries.UPDATE_MOVIE_WITHOUT_GENRES,
			movieParams,
		);
		// biome-ignore lint/complexity/useLiteralKeys: <explanation>
		const data = records[0].toObject()["m"]["properties"];
		return {
			result: true,
			msg: EDBMessage.MOVIE_UPDATED,
			data,
		};
	} catch (e) {
		console.log(e);

		return {
			result: false,
			msg: EDBMessage.MOVIE_NOT_UPDATED,
			data: undefined,
		};
	}
};
// TODO:
const updateMovieWithGenres = async (
	movie: IMovie,
): Promise<IMovieUpdateResponse> => {
	try {
		const { records } = await driver.executeQuery(
			EMovieQueries.UPDATE_MOVIE_WITH_GENRES,
			movie,
		);
		console.log(records);
		// biome-ignore lint/complexity/useLiteralKeys: <explanation>
		const data = records[0].toObject()["m"]["properties"];

		return {
			result: true,
			msg: EDBMessage.MOVIE_UPDATED,
			data,
		};
	} catch (e) {
		return {
			result: false,
			msg: EDBMessage.MOVIE_NOT_UPDATED,
			data: undefined,
		};
	}
};

const deleteMovie = async (id: string) => {
	try {
		const { summary } = await driver.executeQuery(EMovieQueries.DELETE_MOVIE, {
			id,
		});
		const { counters } = summary;
		// biome-ignore lint/complexity/useLiteralKeys: <explanation>
		const deleteCount = counters["_stats"]["nodesDeleted"];
		if (deleteCount === 0)
			return { result: false, msg: EDBMessage.MOVIE_NOT_FOUND };

		return { result: true, msg: EDBMessage.MOVIE_DELETED };
	} catch (e) {
		return { result: false, msg: EDBMessage.MOVIE_NOT_DELETED };
	}
};

const MoviesDB = {
	getAllMovies,
	getMovieById,
	addAReview,
	deleteMovie,
	createMovie,
	updateMovie,
	getPaginatedMovies,
};
export default MoviesDB;
