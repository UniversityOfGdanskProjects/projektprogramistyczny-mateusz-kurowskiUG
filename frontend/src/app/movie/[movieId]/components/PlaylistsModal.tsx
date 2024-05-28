import React, { useContext, useLayoutEffect } from "react";
import PlaylistInterface from "../../../../../interfaces/Playlist.model";
import AddPlaylistEmbedded from "./AddPlaylistEmbedded";
import PlaylistElement from "./PlaylistElement";
import loginContext from "@/app/loginContext";
import axios from "axios";
import { movieContext } from "../../movieContext";

function PlaylistsModal() {
  const { user } = useContext(loginContext);
  const { playlists, setPlaylists, movie } = useContext(movieContext);
  useLayoutEffect(() => {
    const loadPlaylists = async () => {
      const url = `http://localhost:3000/api/playlists/${user?.userId}`;
      try {
        const request = await axios.get(url);
        if (request.status === 200) {
          return request.data.data;
        } else {
          return [];
        }
      } catch (error) {
        console.log(error);
        return [];
      }
    };
    loadPlaylists()
      .then((playlistsRes) => {
        console.log(playlistsRes);

        setPlaylists(playlistsRes);
      })
      .catch((playlistsErr) => {
        console.log(playlistsErr);
        setPlaylists([]);
      });
  }, []);

  const sortPlaylists = (
    a: PlaylistInterface,
    b: PlaylistInterface
  ): number => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    if (a.name === b.name) {
      const aDate = new Date(a.date);
      const bDate = new Date(b.date);
      if (aDate > bDate) {
        return -1;
      }
      if (aDate < bDate) {
        return 1;
      }
      return 0;
    }
    return 0;
  };

  return (
    <>
      <dialog id="playlist-modal" className="modal">
        <div className="modal-box flex flex-col gap-1 overflow-y-auto">
          <h3 className="font-bold text-lg text-center">Your playlists:</h3>
          <div className="flex flex-col gap-2 overflow-y-auto h-96">
            {playlists && playlists.length ? (
              playlists
                .sort(sortPlaylists)
                .map((playlist: PlaylistInterface) => {
                  const inPlaylist = playlist.movies.some(
                    (movieInPlaylist) => movieInPlaylist.id === movie?.id
                  );
                  return (
                    <PlaylistElement
                      inPlaylist={inPlaylist}
                      movie={movie!}
                      playlistHandler={setPlaylists}
                      playlist={playlist}
                      key={crypto.randomUUID()}
                    />
                  );
                })
            ) : (
              <p className="text-center">No playlists yet</p>
            )}
          </div>
          <AddPlaylistEmbedded />
        </div>
        <form method="dialog" className="modal-backdrop ">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}

export default PlaylistsModal;
