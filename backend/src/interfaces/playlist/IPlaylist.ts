import type IMovie from "./movie/IMovie";

interface IPlaylist {
	id: string;
	name: string;
	date: Date;
	movies?: IMovie[];
	checksum?: string;
}
export default IPlaylist;
