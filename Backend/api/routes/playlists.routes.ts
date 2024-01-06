import { Request, Response, Router } from "express";
import db from "../../db/connect";
import newUserInterface from "../../interfaces/newUser";
import {
  RenamePlaylistResponse,
  UpdatePlaylistResponse,
} from "../../interfaces/DBResponse";
import { UpdateAction } from "../../interfaces/UpdateAction";
const playlistsRouter = Router();

playlistsRouter.post("/", async (req: Request, res: Response) => {
  const { userId, name } = req.body;
  if (!userId || !name) {
    return res
      .status(400)
      .json({ msg: "Please enter all fields", result: false });
  }
  const watchlistResult = await db.createPlaylist(userId, name);
  if (!watchlistResult.result) {
    return res.status(400).json(watchlistResult);
  }
  return res.status(200).json(watchlistResult);
});

playlistsRouter.get("/:userId", async (req: Request, res: Response) => {
  const { userId } = req.params;
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

playlistsRouter.patch("/:playlistId", async (req: Request, res: Response) => {
  const { playlistId } = req.params;
  if (!playlistId)
    return res
      .status(400)
      .json({ msg: "Please enter all fields", result: false });

  const { name, movieId, action } = req.body;
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
  let rename: boolean | string = false;

  if (name) {
    const result = await db.renamePlaylist(playlistId, name);
    if (!result.result) {
      return res.status(400).json({ result });
    }
  }
  const movie = await db.getMovieById(movieId);
  if (!movie.result) {
    return res.status(400).json({ ...movie, rename });
  }

  switch (action) {
    case UpdateAction.add: {
      const addedToPlaylist = await db.addToPlaylist(playlistId, movieId);
      if (!addedToPlaylist.result) {
        return res.status(400).json({ ...addedToPlaylist, rename });
      }
      return res.status(200).json({ ...addedToPlaylist, rename });
    }
    case UpdateAction.remove: {
      const removedFromPlaylist = await db.removeFromPlaylist(
        playlistId,
        movieId
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
});

playlistsRouter.delete("/:playlistId", async (req: Request, res: Response) => {
  const { playlistId } = req.params;
  if (!playlistId) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  const playlistResult = await db.deletePlaylist(playlistId);
  if (!playlistResult.result) {
    return res.status(400).json(playlistResult);
  }
  return res.status(200).json(playlistResult);
});
export default playlistsRouter;
