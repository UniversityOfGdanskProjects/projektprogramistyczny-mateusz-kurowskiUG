import type IGenre from "./genre/IGenre";
import type IMovie from "./movie/IMovie";
import type IPlaylist from "./IPlaylist";
import type { IReview } from "./review/IReview";
import type IUser from "./user/IUser";

export interface IDBResponse {
	result: boolean;
	msg: EDBMessage;
	code?: number;
	data?: Record<string, unknown> | Array<Record<string, unknown>>;
}
export interface ILoginResponse {
	result: boolean;
	msg:
		| EDBMessage.USER_LOGGED_IN
		| EDBMessage.USER_NOT_LOGGED_IN
		| EDBMessage.USER_NOT_FOUND
		| EDBMessage.INVALID_CREDIENTIALS;
	data: IUser | undefined;
	token?: Record<string, unknown> | undefined;
}

export interface IUserCreationResponse {
	result: boolean;
	msg:
		| EDBMessage.USER_CREATED
		| EDBMessage.USER_NOT_CREATED
		| EDBMessage.USER_EXISTS
		| EDBMessage.USER_NOT_FOUND
		| EDBMessage.INVALID_CREDIENTIALS
		| EDBMessage.INVALID_EMAIL
		| EDBMessage.INVALID_PASSWORD;
	data: IUser | undefined;
}

export interface IGetWatchlistResponse {
	msg:
		| EDBMessage.WATCHLIST_NOT_FOUND
		| EDBMessage.WATCHLIST_FOUND
		| EDBMessage.WATCHLIST_EMPTY
		| EDBMessage.USER_NOT_FOUND;
	result: boolean;
	data: IMovie[] | undefined;
}

export interface IMovieCreationResponse {
	result: boolean;
	msg:
		| EDBMessage.MOVIE_CREATED
		| EDBMessage.MOVIE_NOT_CREATED
		| EDBMessage.GENRE_NOT_FOUND;
	data: IMovie | undefined;
}

export interface IDeleteFromWatchlistResponse {
	result: boolean;
	msg:
		| EDBMessage.WATCHLIST_NOT_FOUND
		| EDBMessage.WATCHLIST_UPDATED
		| EDBMessage.WATCHLIST_NOT_UPDATED
		| EDBMessage.MOVIE_NOT_FOUND
		| EDBMessage.MOVIE_UPDATED
		| EDBMessage.MOVIE_NOT_UPDATED
		| EDBMessage.NOT_IN_WATCHLIST
		| EDBMessage.USER_NOT_FOUND
		| EDBMessage.WATCHLIST_EMPTY;
	data: IMovie | undefined;
}

export interface IGetMovieResponse {
	result: boolean;
	msg:
		| EDBMessage.INVALID_QUERY
		| EDBMessage.GENRE_NOT_FOUND
		| EDBMessage.USER_NOT_FOUND
		| EDBMessage.MOVIE_NOT_FOUND
		| EDBMessage.MOVIE_FOUND
		| EDBMessage.TMDB_API_ERROR;
	data: IMovie | undefined;
}
export interface IGetMoviesResponse {
	result: boolean;
	msg:
		| EDBMessage.INVALID_QUERY
		| EDBMessage.GENRE_NOT_FOUND
		| EDBMessage.USER_NOT_FOUND
		| EDBMessage.TMDB_API_ERROR
		| EDBMessage.MOVIES_NOT_FOUND
		| EDBMessage.MOVIES_FOUND;
	data: IMovie[] | undefined;
}

export interface IGetGenresReponse {
	result: boolean;
	msg: EDBMessage.TMDB_API_ERROR | EDBMessage.GENRES_FOUND;
	data: IGenre[] | IGenre | undefined;
}

export interface IAddToWatchlistResponse {
	result: boolean;
	msg:
		| EDBMessage.MOVIE_NOT_FOUND
		| EDBMessage.MOVIE_FOUND
		| EDBMessage.WATCHLIST_NOT_FOUND
		| EDBMessage.WATCHLIST_UPDATED
		| EDBMessage.USER_NOT_FOUND
		| EDBMessage.WATCHLIST_NOT_UPDATED
		| EDBMessage.ALREADY_IN_WATCHLIST;
	data: IMovie | undefined;
}

export interface ICreatePlaylistResponse {
	result: boolean;
	msg:
		| EDBMessage.PLAYLIST_CREATED
		| EDBMessage.PLAYLIST_NOT_CREATED
		| EDBMessage.USER_NOT_FOUND
		| EDBMessage.INVALID_NAME;
	data: IPlaylist | undefined;
}

export interface IGetPlaylistsResponse {
	result: boolean;
	msg:
		| EDBMessage.PLAYLIST_NOT_FOUND
		| EDBMessage.PLAYLIST_FOUND
		| EDBMessage.USER_NOT_FOUND
		| EDBMessage.NO_PLAYLISTS;
	data: IPlaylist[] | undefined;
}
export interface IGetPlaylistResponse {
	result: boolean;
	msg:
		| EDBMessage.PLAYLIST_NOT_FOUND
		| EDBMessage.PLAYLIST_FOUND
		| EDBMessage.USER_NOT_FOUND
		| EDBMessage.NO_PLAYLISTS;
	data: IPlaylist | undefined;
}

export interface IDeletePlaylistResponse {
	result: boolean;
	msg:
		| EDBMessage.PLAYLIST_NOT_FOUND
		| EDBMessage.PLAYLIST_DELETED
		| EDBMessage.PLAYLIST_NOT_DELETED;
	data: IPlaylist | undefined;
}

export interface IRenamePlaylistResponse {
	result: boolean;
	msg:
		| EDBMessage.PLAYLIST_NOT_FOUND
		| EDBMessage.PLAYLIST_UPDATED
		| EDBMessage.PLAYLIST_NOT_UPDATED;
	data: IPlaylist | undefined;
}

export interface IUpdatePlaylistResponse {
	result: boolean;
	msg:
		| EDBMessage.PLAYLIST_NOT_FOUND
		| EDBMessage.PLAYLIST_UPDATED
		| EDBMessage.PLAYLIST_NOT_UPDATED;
	data: IPlaylist | undefined;
	renamed?: boolean;
}
export interface IRemoveFromPlaylistResponse {
	result: boolean;
	msg:
		| EDBMessage.PLAYLIST_NOT_FOUND
		| EDBMessage.PLAYLIST_UPDATED
		| EDBMessage.PLAYLIST_NOT_UPDATED
		| EDBMessage.MOVIE_NOT_FOUND
		| EDBMessage.MOVIE_UPDATED
		| EDBMessage.MOVIE_NOT_UPDATED
		| EDBMessage.NOT_IN_PLAYLIST
		| EDBMessage.USER_NOT_FOUND
		| EDBMessage.PLAYLIST_EMPTY;
	data: IMovie | undefined;
}
export interface IAddToPlaylistResponse {
	result: boolean;
	msg:
		| EDBMessage.MOVIE_NOT_FOUND
		| EDBMessage.MOVIE_FOUND
		| EDBMessage.PLAYLIST_NOT_FOUND
		| EDBMessage.PLAYLIST_UPDATED
		| EDBMessage.USER_NOT_FOUND
		| EDBMessage.PLAYLIST_NOT_UPDATED
		| EDBMessage.ALREADY_IN_PLAYLIST;
	data: IMovie | undefined;
}
export interface IAddReviewResponse {
	result: boolean;
	msg:
		| EDBMessage.MOVIE_NOT_FOUND
		| EDBMessage.USER_NOT_FOUND
		| EDBMessage.REVIEW_CREATED
		| EDBMessage.REVIEW_NOT_CREATED
		| EDBMessage.ALREADY_REVIEWED
		| EDBMessage.INVALID_CONTENT
		| EDBMessage.INVALID_RATING
		| EDBMessage.REVIEW_VALID;
	data: IReview | undefined;
}
export interface IGetReviewsResponse {
	result: boolean;
	msg:
		| EDBMessage.MOVIE_NOT_FOUND
		| EDBMessage.NO_REVIEWS
		| EDBMessage.REVIEWS_NOT_FOUND
		| EDBMessage.REVIEWS_FOUND;
	data: IReview[] | undefined;
}
export interface IDeleteReviewResponse {
	result: boolean;
	msg:
		| EDBMessage.MOVIE_NOT_FOUND
		| EDBMessage.USER_NOT_FOUND
		| EDBMessage.REVIEW_DELETED
		| EDBMessage.REVIEW_NOT_DELETED
		| EDBMessage.NOT_REVIEWED
		| EDBMessage.REVIEW_NOT_FOUND;
	data: IReview | undefined;
}
export interface IReviewValid {
	result: boolean;
	msg:
		| EDBMessage.INVALID_CONTENT
		| EDBMessage.INVALID_RATING
		| EDBMessage.MOVIE_NOT_FOUND
		| EDBMessage.USER_NOT_FOUND
		| EDBMessage.REVIEW_VALID;
}

export interface IMovieDeletionResponse {
	result: boolean;
	msg:
		| EDBMessage.MOVIE_NOT_FOUND
		| EDBMessage.MOVIE_DELETED
		| EDBMessage.MOVIE_NOT_DELETED;
	data: IMovie | undefined;
}
export interface IMovieUpdateResponse {
	result: boolean;
	msg:
		| EDBMessage.MOVIE_NOT_FOUND
		| EDBMessage.MOVIE_UPDATED
		| EDBMessage.MOVIE_NOT_UPDATED;
	data: IMovie | undefined;
}
export interface IGetUserResponse {
	result: boolean;
	msg: EDBMessage.USER_NOT_FOUND | EDBMessage.USER_FOUND;
	data: IUser | undefined;
}
export interface IUpdateUserProfileResponse {
	result: boolean;
	errors: string[] | string;
	msg?: string;
	user: IUser | undefined | false;
	data?: IUser | undefined;
}

export enum EDBMessage {
	MOVIES_FOUND = "Movies found",
	MOVIES_NOT_FOUND = "Movies not found",
	PASSWORD_UPDATED = "Password updated successfully",
	EMAIL_UPDATED = "Email updated successfully",
	EMAIL_NOT_UPDATED = "Email not updated",
	PASSWORD_NOT_UPDATED = "Password not updated",
	UPDATED_SUCCESSFULLY = "Updated successfully",
	INVALID_UPDATE = "Invalid update",
	PARTIALLY_UPDATED = "Partially updated",
	USER_FOUND = "User found",
	GENRE_NOT_FOUND = "Genre not found",
	REVIEWS_FOUND = "Reviews found",
	REVIEWS_NOT_FOUND = "Reviews not found",
	REVIEW_VALID = "IReview is valid.",
	INVALID_CONTENT = "Invalid content",
	INVALID_RATING = "Invalid rating",
	ALREADY_IN_PLAYLIST = "Movie already in playlist",
	ALREADY_IN_WATCHLIST = "Movie already in watchlist",
	ALREADY_REVIEWED = "Movie already reviewed",
	GENRES_FOUND = "Genres found",
	INVALID_CREDIENTIALS = "Invalid credentials",
	INVALID_EMAIL = "Invalid email",
	INVALID_NAME = "Invalid name",
	INVALID_PASSWORD = "Invalid password",
	INVALID_PLAYLIST = "Invalid playlist",
	INVALID_QUERY = "Invalid query",
	INVALID_REVIEW = "Invalid review",
	MOVIE_CREATED = "Movie created successfully",
	MOVIE_DELETED = "Movie deleted successfully",
	MOVIE_FOUND = "Movie found",
	MOVIE_NOT_CREATED = "Movie not created",
	MOVIE_NOT_DELETED = "Movie not deleted",
	MOVIE_NOT_FOUND = "Movie not found",
	MOVIE_NOT_UPDATED = "Movie not updated",
	MOVIE_UPDATED = "Movie updated successfully",
	NOT_IN_PLAYLIST = "Movie not in playlist",
	NOT_IN_WATCHLIST = "Movie not in watchlist",
	NOT_REVIEWED = "Movie not reviewed",
	NO_PLAYLISTS = "No playlists",
	PLAYLISTS_FOUND = "Playlists found",
	PLAYLISTS_NOT_FOUND = "Playlists not found",
	PLAYLIST_CREATED = "Playlist created successfully",
	PLAYLIST_DELETED = "Playlist deleted successfully",
	PLAYLIST_EMPTY = "Playlist is empty",
	PLAYLIST_FOUND = "Playlist found",
	PLAYLIST_NOT_CREATED = "Playlist not created",
	PLAYLIST_NOT_DELETED = "Playlist not deleted",
	PLAYLIST_NOT_FOUND = "Playlist not found",
	PLAYLIST_NOT_UPDATED = "Playlist not updated",
	PLAYLIST_UPDATED = "Playlist updated successfully",
	REVIEW_CREATED = "IReview created successfully",
	REVIEW_DELETED = "IReview deleted successfully",
	REVIEW_FOUND = "IReview found",
	REVIEW_NOT_CREATED = "IReview not created",
	REVIEW_NOT_DELETED = "IReview not deleted",
	REVIEW_NOT_FOUND = "IReview not found",
	REVIEW_NOT_UPDATED = "IReview not updated",
	REVIEW_UPDATED = "IReview updated successfully",
	TMDB_API_ERROR = "TMDB API error",
	USER_CREATED = "User created successfully",
	USER_DELETED = "User deleted successfully",
	USER_EXISTS = "User already exists",
	USER_LOGGED_IN = "User logged in successfully",
	USER_LOGGED_OUT = "User logged out successfully",
	USER_NOT_AUTHENTICATED = "User not authenticated",
	USER_NOT_AUTHORIZED = "User not authorized",
	USER_NOT_CREATED = "User not created",
	USER_NOT_DELETED = "User not deleted",
	USER_NOT_FOUND = "User not found",
	USER_NOT_LOGGED_IN = "User not logged in",
	USER_NOT_LOGGED_OUT = "User not logged out",
	USER_NOT_UPDATED = "User not updated",
	USER_UPDATED = "User updated successfully",
	WATCHLIST_CREATED = "Watchlist created successfully",
	WATCHLIST_DELETED = "Watchlist deleted successfully",
	WATCHLIST_EMPTY = "Watchlist is empty",
	WATCHLIST_FOUND = "Watchlist found",
	WATCHLIST_NOT_CREATED = "Watchlist not created",
	WATCHLIST_NOT_DELETED = "Watchlist not deleted",
	WATCHLIST_NOT_FOUND = "Watchlist not found",
	WATCHLIST_NOT_UPDATED = "Watchlist not updated",
	WATCHLIST_UPDATED = "Watchlist updated successfully",
	NO_REVIEWS = "No reviews",
}
