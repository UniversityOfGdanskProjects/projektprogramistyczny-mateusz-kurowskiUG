import { Request, Response, Router } from "express";
import db from "../../db/connect";
import newUserInterface from "../../interfaces/newUser";
const playlistsRouter = Router();

playlistsRouter.post("/", async (req: Request, res: Response) => {
  const { userId, name } = req.body;
  if (!userId || !name) {
    return res.status(400).json({ msg: "Please enter all fields" });
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
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  const playlistResult = await db.getPlaylists(userId);
  if (!playlistResult.result) {
    return res.status(400).json(playlistResult);
  }
  return res.status(200).json(playlistResult);
});
playlistsRouter.put("/:playlistId", async (req: Request, res: Response) => {
  const { playlistId } = req.params;
  const { name, add, remove } = req.body;
  let removeResult, addResult;
  const operations = [];

  if (!playlistId) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  const playlist = await db.getPlaylistById(playlistId);
  if (!playlist.result) {
    return res.status(400).json(playlist);
  }

  if (add) {
    operations.push(db.addToPlaylist(playlistId, add));
  }
  if (remove) {
    operations.push(db.removeFromPlaylist(playlistId, remove));
  }
  if (!playlistId) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  const playlistResult = await db.updatePlaylist(playlistId);
  if (!playlistResult.result) {
    return res.status(400).json(playlistResult);
  }
  return res.status(200).json(playlistResult);
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
