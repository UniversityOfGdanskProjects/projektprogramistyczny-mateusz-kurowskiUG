import type IPlaylist from "../../interfaces/playlist/IPlaylist";
import driver from "../new-connect";
import EPlaylistQueries from "./playlist-queries";
import {
  EDBMessage,
  type IUpdatePlaylistResponse,
  type ICreatePlaylistResponse,
} from "../../interfaces/TDBResponse";
import UsersDB from "../users/users";
import cuid2 from "@paralleldrive/cuid2";
import type IPlaylistUpdate from "../../interfaces/playlist/IPlaylistUpdate";

const addToPlaylist = async (playlistId: string, songId: string) => {};
const getPlaylistById = async (playlistId: string) => {
  try {
    const { records } = await driver.executeQuery(
      EPlaylistQueries.GET_PLAYLIST_BY_ID,
      { playlistId }
    );
    if (records.length === 0)
      return {
        result: false,
        msg: EDBMessage.PLAYLIST_NOT_FOUND,
        data: undefined,
      };
    const playlist = records[0].get("p").properties;
    return { result: true, msg: EDBMessage.PLAYLIST_FOUND, data: playlist };
  } catch (e) {
    return {
      result: false,
      msg: EDBMessage.PLAYLIST_NOT_FOUND,
      data: undefined,
    };
  }
};
const getPlaylistsByUserId = async (userId: string) => {};
const deleteFromPlaylist = async (playlistId: string, songId: string) => {};

const updatePlaylist = async (
  playlistId: string,
  playlist: IPlaylistUpdate
): Promise<IUpdatePlaylistResponse> => {
  try {
    const promiseArray: Promise<any>[] = [];
    const { add, name, remove } = playlist;
    if (name)
      promiseArray.push(
        driver.executeQuery(EPlaylistQueries.RENAME_PLAYLIST, {
          playlistId,
          name,
        })
      );
    if (add)
      promiseArray.push(
        driver.executeQuery(EPlaylistQueries.ADD_TO_PLAYLIST, {
          playlistId,
          add,
        })
      );
    if (remove)
      promiseArray.push(
        driver.executeQuery(EPlaylistQueries.DELETE_FROM_PLAYLIST, {
          playlistId,
          remove,
        })
      );

    const result = await Promise.all(promiseArray);
    const updatedPlaylist =
      result[result.length - 1].records[0].get("p").properties;

    return {
      result: true,
      msg: EDBMessage.PLAYLIST_UPDATED,
      data: updatedPlaylist,
    };
  } catch (e) {
    return {
      result: false,
      msg: EDBMessage.PLAYLIST_NOT_UPDATED,
      data: undefined,
    };
  }
};

const getUsersPlaylists = async (userId: string) => {
  try {
    const foundUser = await UsersDB.getUserById(userId);
    if (!foundUser)
      return { result: false, msg: EDBMessage.USER_NOT_FOUND, data: undefined };
    const { records } = await driver.executeQuery(
      EPlaylistQueries.GET_PLAYLISTS_BY_USERID,
      { userId }
    );
    const playlists = records.map((record) => record.get("p").properties);
    return {
      result: true,
      msg: EDBMessage.PLAYLISTS_FOUND,
      data: playlists,
    };
  } catch (e) {
    return {
      result: false,
      msg: EDBMessage.PLAYLIST_NOT_FOUND,
      data: undefined,
    };
  }
};

const createPlaylist = async (
  userId: string,
  name: string
): Promise<ICreatePlaylistResponse> => {
  try {
    const foundUser = await UsersDB.getUserById(userId);
    if (!foundUser)
      return { result: false, msg: EDBMessage.USER_NOT_FOUND, data: undefined };
    const playlistId = cuid2.createId();
    const { records } = await driver.executeQuery(
      EPlaylistQueries.CREATE_PLAYLIST,
      { userId, name, playlistId }
    );
    const playlist = records[0].get("p").properties;
    return {
      result: true,
      msg: EDBMessage.PLAYLIST_CREATED,
      data: playlist,
    };
  } catch (e) {
    return {
      result: false,
      msg: EDBMessage.PLAYLIST_NOT_CREATED,
      data: undefined,
    };
  }
};

const deletePlaylist = async (playlistId: string) => {
  try {
    const { records } = await driver.executeQuery(
      EPlaylistQueries.GET_PLAYLIST_BY_ID,
      { playlistId }
    );
    if (records.length === 0)
      return {
        result: false,
        msg: EDBMessage.PLAYLIST_NOT_FOUND,
        data: undefined,
      };
    await driver.executeQuery(EPlaylistQueries.DELETE_PLAYLIST, { playlistId });
    return { result: true, msg: EDBMessage.PLAYLIST_DELETED, data: undefined };
  } catch (e) {
    return {
      result: false,
      msg: EDBMessage.PLAYLIST_NOT_DELETED,
      data: undefined,
    };
  }
};

const PlaylistDB = {
  addToPlaylist,
  getPlaylistById,
  getPlaylistsByUserId,
  deleteFromPlaylist,
  updatePlaylist,
  createPlaylist,
  getUsersPlaylists,
  deletePlaylist,
};
export default PlaylistDB;
