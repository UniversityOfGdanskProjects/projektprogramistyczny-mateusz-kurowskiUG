import type IMovie from "./IMovie";

interface IPlaylist {
	id: string;
	name: string;
	date: Date;
	movies?: IMovie[];
	checksum?: string;
}
export default IPlaylist;
