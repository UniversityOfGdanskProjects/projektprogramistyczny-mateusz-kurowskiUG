import { type Request, type Response, Router } from "express";
import db from "../../db/connect";

import { EUpdateAction } from "../../interfaces/EUpdateAction";

const playlistsRouter = Router();

playlistsRouter.post("/", async (request: Request, res: Response) => {
	const { userId, name } = request.body;
	if (!userId || !name) {
		return res
			.status(400)
			.json({ msg: "Please enter all fields", result: false });
	}

	if (name.length < 3 || name.length > 20) {
		return res.status(400).json({
			msg: "Playlist name must be between 3 and 20 characters",
			result: false,
		});
	}

	const watchlistResult = await db.createPlaylist(userId, name);
	if (!watchlistResult.result) {
		return res.status(400).json(watchlistResult);
	}

	return res.status(200).json(watchlistResult);
});

playlistsRouter.get("/:userId", async (request: Request, res: Response) => {
	const { userId } = request.params;
	if (!userId) {
		return res
			.status(400)
			.json({ msg: "Please enter all fields", result: false });
	}

	const playlistResult = await db.getPlaylists(userId);
	if (!playlistResult.result) {
		return res.status(400).json(playlistResult);
	}

	return res.status(200).json(playlistResult);
});

playlistsRouter.patch(
	"/:playlistId",
	async (request: Request, res: Response) => {
		const { playlistId } = request.params;
		if (!playlistId) {
			return res
				.status(400)
				.json({ msg: "Please enter all fields", result: false });
		}

		const { name, movieId, action } = request.body;
		if (!name && !movieId && !action) {
			return res.status(400).json({ msg: "No fields provided", result: false });
		}

		if ((movieId && !action) || (action && !movieId)) {
			return res
				.status(400)
				.json({ msg: "No movie or action provided", result: false });
		}

		const playlist = await db.getPlaylistById(playlistId);
		if (!playlist.result) {
			return res.status(400).json(playlist);
		}

		const rename: Record<string, unknown> = {
			result: false,
			msg: "Playlist not renamed",
			data: undefined,
		};

		if (name) {
			const result = await db.renamePlaylist(playlistId, name);
			if (!result.result) {
				return res.status(400).json(result);
			}

			rename.result = true;
			rename.msg = "Playlist renamed";
		}

		if (!movieId) {
			return res.status(200).json({ msg: "Playlist updated", rename });
		}

		const movie = await db.getMovieById(movieId);
		if (!movie.result) {
			return res.status(400).json({ ...movie, rename });
		}

		switch (action) {
			case EUpdateAction.add: {
				const addedToPlaylist = await db.addToPlaylist(playlistId, movieId);
				if (!addedToPlaylist.result) {
					return res.status(400).json({ ...addedToPlaylist, rename });
				}

				return res.status(200).json({ ...addedToPlaylist, rename });
			}

			case EUpdateAction.remove: {
				const removedFromPlaylist = await db.removeFromPlaylist(
					playlistId,
					movieId,
				);
				if (!removedFromPlaylist.result) {
					return res.status(400).json({ ...removedFromPlaylist, rename });
				}

				return res.status(200).json({ ...removedFromPlaylist, rename });
			}

			case undefined: {
				return res.status(400).json({ rename });
			}

			default: {
				return res.status(400).json({ msg: "Invalid action", rename });
			}
		}
	},
);

playlistsRouter.delete(
	"/:playlistId",
	async (request: Request, res: Response) => {
		const { playlistId } = request.params;
		if (!playlistId) {
			return res.status(400).json({ msg: "Please enter all fields" });
		}

		const playlistResult = await db.deletePlaylist(playlistId);
		if (!playlistResult.result) {
			return res.status(400).json(playlistResult);
		}

		return res.status(200).json(playlistResult);
	},
);
export default playlistsRouter;
