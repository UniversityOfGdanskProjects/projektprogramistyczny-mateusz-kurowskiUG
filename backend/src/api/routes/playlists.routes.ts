import { Hono } from "hono";
import PlaylistDB from "../../db/playlists/playlists";
import {
  newPlaylistValidator,
  playlistUpdateValidator,
} from "../middleware/validators/playlist-validators";
import {
  playlistIdParamValidator,
  userIdParamValidator,
} from "../middleware/validators/id-param-validator";
import * as _ from "lodash";
const playlistsRouter = new Hono();

playlistsRouter.post("/", newPlaylistValidator(), async (c) => {
  const { userId, name } = c.req.valid("json");
  const createResult = await PlaylistDB.createPlaylist(userId, name);
  if (!createResult.result) return c.json(createResult, 400);
  return c.json(createResult, 200);
});

playlistsRouter.get("/user/:userId", userIdParamValidator(), async (c) => {
  const { userId } = c.req.valid("param");

  const playlistResult = await PlaylistDB.getUsersPlaylists(userId);
  if (!playlistResult.result) return c.json(playlistResult, 400);

  return c.json(playlistResult, 200);
});
playlistsRouter.get("/:playlistId", playlistIdParamValidator(), async (c) => {
  const { playlistId } = c.req.valid("param");

  const playlistResult = await PlaylistDB.getPlaylistById(playlistId);
  if (!playlistResult.result) return c.json(playlistResult, 400);

  return c.json(playlistResult, 200);
});

playlistsRouter.patch(
  "/:playlistId",
  playlistIdParamValidator(),
  playlistUpdateValidator(),
  async (c) => {
    const { playlistId } = c.req.valid("param");
    const { name, add, remove } = c.req.valid("json");
    const newProps = _.omitBy({ name, add, remove }, _.isNil);
    if (newProps) return c.json("Invalid body", 400);
    const updateResult = await PlaylistDB.updatePlaylist(playlistId, newProps);
    if (!updateResult.result) return c.json(updateResult, 400);
    return c.json(updateResult, 200);
  }
);

playlistsRouter.delete(
  "/:playlistId",
  playlistIdParamValidator(),
  async (c) => {
    const { playlistId } = c.req.valid("param");
    const playlistResult = await PlaylistDB.deletePlaylist(playlistId);

    if (!playlistResult.result) return c.json(playlistResult, 400);

    return c.json(playlistResult, 200);
  }
);
export default playlistsRouter;
