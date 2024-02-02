import React, { useContext } from "react";
import PlaylistInterface from "../../../../../interfaces/Playlist.model";
import PopularMovie from "./PopularMovie";
import axios from "axios";
import { profileContext } from "../profileContext";
import { uniqueId } from "lodash";

function PlaylistItem({ playlist }: { playlist: PlaylistInterface }) {
  const { setPlaylists } = useContext(profileContext);
  const deletePlaylist = async () => {
    try {
      const deleteRes = await axios.delete(
        `http://localhost:3000/api/playlists/${playlist.id}`
      );
      if (deleteRes.status === 200) {
        setPlaylists((prev) => prev.filter((p) => p.id !== playlist.id));
      }
    } catch (error) {
      alert("error while deleting playlist");
    }
  };
  return (
    <div className="collapse bg-base-200">
      <input type="radio" name="my-accordion-1" />
      <div className="collapse-title text-xl font-medium flex justify-between w-full">
        <div className="title">{playlist.name}</div>
      </div>
      <div className="collapse-content text-center flex flex-col flex-1 gap-2 overflow-x-auto">
        <div className="actions self-end">
          <button onClick={deletePlaylist} className="btn btn-error self-end">
            delete
          </button>
        </div>
        <div className="movies flex gap-2">
          {playlist.movies.length
            ? playlist.movies.map((movie) => (
                <PopularMovie
                  where="playlist"
                  key={uniqueId()}
                  playlistId={playlist.id}
                  movie={movie}
                />
              ))
            : "No movies in playlist"}
        </div>
      </div>
    </div>
  );
}

export default PlaylistItem;
