import type IMovie from "../../interfaces/movie/IMovie";
import INewReview from "../../interfaces/review/INewReview";
import IReview from "../../interfaces/review/IReview";
import {
	EDBMessage,
	type IGetMoviesResponse,
	type IGetMovieResponse,
	IAddReviewResponse,
} from "../../interfaces/TDBResponse";
import driver from "../new-connect";
import EMovieQueries from "./movies-queries";

const getAllMovies = async (): Promise<IGetMoviesResponse> => {
	try {
		const { records } = await driver.executeQuery(EMovieQueries.getAllMovies);
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
		const { records } = await driver.executeQuery(EMovieQueries.getMovieById, {
			id,
		});
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
			EMovieQueries.getMovieById,
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
			EMovieQueries.addReview,
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

const MoviesDB = { getAllMovies, getMovieById, addAReview };
export default MoviesDB;
