import IMovie from "../../interfaces/IMovie";
import {
	EDBMessage,
	type IGetMoviesResponse,
	type IGetMovieResponse,
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

const getMovieById = async (movieId: string): Promise<IGetMovieResponse> => {
	try {
		const { records } = await driver.executeQuery(EMovieQueries.getMovieById, {
			movieId,
		});
		const movie = records.map(
			// biome-ignore lint/complexity/useLiteralKeys: <explanation>
			(record) => record["toObject"]()["m"]["properties"],
		)[0] as IMovie;
		return { result: true, data: movie, msg: EDBMessage.MOVIE_FOUND };
	} catch (e) {
		return { result: false, data: undefined, msg: EDBMessage.MOVIE_NOT_FOUND };
	}
};

const MoviesDB = { getAllMovies, getMovieById };
export default MoviesDB;
