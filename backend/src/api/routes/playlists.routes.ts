import { Hono } from "hono";
import PlaylistDB from "../../db/playlists/playlists";
import { newPlaylistValidator } from "../middleware/validators/playlist-validators";

const playlistsRouter = new Hono();

playlistsRouter.post("/", newPlaylistValidator(), async (c) => {
	const { userId, name } = c.req.valid("json");

	const createResult = await PlaylistDB.createPlaylist(userId, name);
	if (!createResult.result) return c.json(createResult, 400);

	return c.json(createResult, 200);
});

// playlistsRouter.get("/:userId", async (c) => {
// 	const { userId } = request.params;
// 	if (!userId) {
// 		return res
// 			.status(400)
// 			.json({ msg: "Please enter all fields", result: false });
// 	}

// 	const playlistResult = await PlaylistDB.getPlaylists(userId);
// 	if (!playlistResult.result) {
// 		return res.status(400).json(playlistResult);
// 	}

// 	return res.status(200).json(playlistResult);
// });

// playlistsRouter.patch("/:playlistId", async (c) => {
// 	const { playlistId } = request.params;
// 	if (!playlistId) {
// 		return res
// 			.status(400)
// 			.json({ msg: "Please enter all fields", result: false });
// 	}

// 	const { name, movieId, action } = request.body;
// 	if (!name && !movieId && !action) {
// 		return res.status(400).json({ msg: "No fields provided", result: false });
// 	}

// 	if ((movieId && !action) || (action && !movieId)) {
// 		return res
// 			.status(400)
// 			.json({ msg: "No movie or action provided", result: false });
// 	}

// 	const playlist = await PlaylistDB.getPlaylistById(playlistId);
// 	if (!playlist.result) {
// 		return res.status(400).json(playlist);
// 	}

// 	const rename: Record<string, unknown> = {
// 		result: false,
// 		msg: "Playlist not renamed",
// 		data: undefined,
// 	};

// 	if (name) {
// 		const result = await PlaylistDB.renamePlaylist(playlistId, name);
// 		if (!result.result) {
// 			return res.status(400).json(result);
// 		}

// 		rename.result = true;
// 		rename.msg = "Playlist renamed";
// 	}

// 	if (!movieId) {
// 		return res.status(200).json({ msg: "Playlist updated", rename });
// 	}

// 	const movie = await PlaylistDB.getMovieById(movieId);
// 	if (!movie.result) {
// 		return res.status(400).json({ ...movie, rename });
// 	}

// 	switch (action) {
// 		case EUpdateAction.add: {
// 			const addedToPlaylist = await PlaylistDB.addToPlaylist(
// 				playlistId,
// 				movieId,
// 			);
// 			if (!addedToPlaylist.result) {
// 				return res.status(400).json({ ...addedToPlaylist, rename });
// 			}

// 			return res.status(200).json({ ...addedToPlaylist, rename });
// 		}

// 		case EUpdateAction.remove: {
// 			const removedFromPlaylist = await PlaylistDB.removeFromPlaylist(
// 				playlistId,
// 				movieId,
// 			);
// 			if (!removedFromPlaylist.result) {
// 				return res.status(400).json({ ...removedFromPlaylist, rename });
// 			}

// 			return res.status(200).json({ ...removedFromPlaylist, rename });
// 		}

// 		case undefined: {
// 			return res.status(400).json({ rename });
// 		}

// 		default: {
// 			return res.status(400).json({ msg: "Invalid action", rename });
// 		}
// 	}
// });

// playlistsRouter.delete("/:playlistId", async (c) => {
// 	const { playlistId } = request.params;
// 	if (!playlistId) {
// 		return res.status(400).json({ msg: "Please enter all fields" });
// 	}

// 	const playlistResult = await PlaylistDB.deletePlaylist(playlistId);
// 	if (!playlistResult.result) {
// 		return res.status(400).json(playlistResult);
// 	}

// 	return res.status(200).json(playlistResult);
// });
export default playlistsRouter;
