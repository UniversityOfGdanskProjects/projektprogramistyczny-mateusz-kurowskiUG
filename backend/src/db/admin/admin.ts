import type IMovie from "../../interfaces/movie/IMovie";
import type IUser from "../../interfaces/user/IUser";
import {
	EDBMessage,
	type IMovieUpdateResponse,
	type IMovieCreationResponse,
} from "../../interfaces/TDBResponse";
import driver from "../new-connect";
import AdminQueries from "./admin-queries";

const getUsers = async (): Promise<IUser[]> => {
	const { records } = await driver.executeQuery(AdminQueries.getUsers);
	const users = records.map(
		// biome-ignore lint/complexity/useLiteralKeys: field is private
		(record) => record["toObject"]()["n"]["properties"] as IUser,
	);
	return users;
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
			AdminQueries.createMovieWithGenres,
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

const createMovieWithoutGenres = async (
	movie: IMovie,
): Promise<IMovieCreationResponse> => {
	try {
		const { records } = await driver.executeQuery(
			AdminQueries.createMovieWithoutGenres,
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
const updateMovie = async (movie: IMovie): Promise<IMovieUpdateResponse> => {
	const { genres, ...movieParams } = movie;
	if (!genres || genres.length === 0) return updateMovieWithoutGenres(movie);
	return updateMovieWithGenres(movie);
};

const updateMovieWithoutGenres = async (
	movie: IMovie,
): Promise<IMovieUpdateResponse> => {
	const { genres, ...movieParams } = movie;
	try {
		const { records } = await driver.executeQuery(
			AdminQueries.updateMovieWithoutGenres,
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
			AdminQueries.updateMovieWithGenres,
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
		const { summary } = await driver.executeQuery(AdminQueries.deleteMovie, {
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
const AdminDB = { getUsers, createMovie, updateMovie, deleteMovie };
export default AdminDB;
