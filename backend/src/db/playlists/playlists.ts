import type IPlaylist from "../../interfaces/playlist/IPlaylist";

const addToPlaylist = async (playlistId: string, songId: string) => {};
const getPlaylistById = async (playlistId: string) => {};
const getPlaylistsByUserId = async (userId: string) => {};
const deleteFromPlaylist = async (playlistId: string, songId: string) => {};
const updatePlaylist = async (playlistId: string, playlist: IPlaylist) => {};
const createPlaylist = async (userId: string, name: string) => {};
const PlaylistDB = {
	addToPlaylist,
	getPlaylistById,
	getPlaylistsByUserId,
	deleteFromPlaylist,
	updatePlaylist,
	createPlaylist,
};
export default PlaylistDB;
