import { EDBMessage } from "../../interfaces/TDBResponse";
import MoviesDB from "../movies/movies";
import driver from "../new-connect";
import UsersDB from "../users/users";
import EWatchlistQueries from "./watchlist-queries";

const addToWatchlist = async (userId: string, movieId: string) => {
	try {
		const movieFound = await MoviesDB.getMovieById(movieId);
		if (!movieFound)
			return { result: false, message: EDBMessage.MOVIES_NOT_FOUND };
		const userFound = await UsersDB.getUserById(userId);
		if (!userFound)
			return { result: false, message: EDBMessage.USER_NOT_FOUND };
		driver.executeQuery(EWatchlistQueries.ADD_TO_WATCHLIST, {
			userId,
			movieId,
		});
		//TODO: RETURN NEW WATCHLIST?
		return { result: true, message: EDBMessage.WATCHLIST_UPDATED };
	} catch (e) {
		return { result: false, message: EDBMessage.WATCHLIST_NOT_UPDATED };
	}
};
const getWatchlist = async (userId: string) => {
	try {
		const userFound = await UsersDB.getUserById(userId);
		if (!userFound)
			return { result: false, message: EDBMessage.USER_NOT_FOUND };

		const { records } = await driver.executeQuery(
			EWatchlistQueries.GET_WATCHLIST,
			{
				userId,
			},
		);
		const result = records.map((record) => record.toObject());
		return { result: true, data: result };
	} catch (e) {
		return { result: false, message: EDBMessage.WATCHLIST_NOT_FOUND };
	}
};
const deleteFromWatchlist = async (userId: string, movieId: string) => {
	try {
		const userFound = await UsersDB.getUserById(userId);
		if (!userFound)
			return { result: false, message: EDBMessage.USER_NOT_FOUND };
		const movieFound = await MoviesDB.getMovieById(movieId);
		if (!movieFound)
			return { result: false, message: EDBMessage.MOVIES_NOT_FOUND };

		driver.executeQuery(EWatchlistQueries.DELETE_FROM_WATCHLIST, {
			userId,
			movieId,
		});
		return { result: true, message: EDBMessage.WATCHLIST_UPDATED };
	} catch (e) {
		return { result: false, message: EDBMessage.WATCHLIST_NOT_UPDATED };
	}
};

const Watchlist = { getWatchlist, addToWatchlist, deleteFromWatchlist };

export default Watchlist;
