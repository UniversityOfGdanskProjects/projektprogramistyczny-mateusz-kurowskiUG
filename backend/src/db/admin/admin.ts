import { DBMessage } from "./../../interfaces/DBResponse";
import type IMovie from "../../interfaces/IMovie";
import type IUser from "../../interfaces/IUser";
import {
	EDBMessage,
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
	const { genres, ...movieParams } = movie;

	const { records } = await driver.executeQuery(
		AdminQueries.createMovieWithoutGenres,
		movieParams,
	);
	// biome-ignore lint/complexity/useLiteralKeys: no such fields as properties
	const data = records.map((record) => record.toObject())[0]["node"][
		// biome-ignore lint/complexity/useLiteralKeys: no such fields as properties
		"properties"
	];
	console.log(data);

	return {
		result: true,
		msg: EDBMessage.MOVIE_CREATED,
		data,
	};
};

const updateMovie = async () => {};

const deleteMovie = async () => {};
const AdminDB = { getUsers, createMovie, updateMovie, deleteMovie };
export default AdminDB;
