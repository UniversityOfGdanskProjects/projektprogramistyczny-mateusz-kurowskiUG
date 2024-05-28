import type IMovie from "./movie/IMovie";

interface IWatchlist {
	id: string;
	movies: IMovie[];
}
export default IWatchlist;
