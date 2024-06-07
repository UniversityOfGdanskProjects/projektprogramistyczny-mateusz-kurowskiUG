import type IMovie from "../movie/IMovie";

interface IWatchlist {
	id: string;
	movies: IMovie[];
	updatedAt: string;
}
export default IWatchlist;
