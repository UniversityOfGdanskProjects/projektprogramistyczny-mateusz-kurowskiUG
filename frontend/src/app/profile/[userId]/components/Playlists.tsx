import React, { useContext, useEffect } from "react";
import { profileContext } from "../profileContext";
import axios from "axios";
import loginContext from "@/app/loginContext";
import PlaylistInterface from "../../../../../interfaces/Playlist.model";
import PlaylistItem from "./PlaylistItem";
import { uniqueId } from "lodash";

function Playlists() {
  const { user } = useContext(loginContext);
  const { playlists, setPlaylists } = useContext(profileContext);
  useEffect(() => {
    const loadPlaylists = async () => {
      try {
        const playlistsResponse = await axios.get(
          `http://localhost:3000/api/playlists/${user?.userId}`
        );
        return playlistsResponse.data.data;
      } catch (error) {
        return [];
      }
    };
    loadPlaylists()
      .then((playlists) => setPlaylists(playlists))
      .catch(() => setPlaylists([]));
  }, []);
  return (
    <div>
      <h2 className="text-center text-2xl">Playlists:</h2>
      <div className="movies">
        {playlists.length ? (
          playlists
            .sort((a, b) => a.date > b.date)
            .map((playlist: PlaylistInterface) => {
              const key = uniqueId();
              return <PlaylistItem playlist={playlist} key={key} />;
            })
        ) : (
          <p className="text-center">No playlists yet</p>
        )}
      </div>
    </div>
  );
}

export default Playlists;
