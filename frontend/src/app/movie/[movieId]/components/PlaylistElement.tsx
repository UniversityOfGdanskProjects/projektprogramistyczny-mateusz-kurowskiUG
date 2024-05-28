import React from "react";
import PlaylistInterface from "../../../../../interfaces/Playlist.model";
import axios from "axios";
import MovieInterface from "../../../../../interfaces/Movie.model";

function PlaylistElement({
  playlist,
  playlistHandler,
  inPlaylist,
  movie,
}: {
  playlist: PlaylistInterface;
  playlistHandler: (playlists: PlaylistInterface[]) => PlaylistInterface[];
  inPlaylist: boolean;
  movie: MovieInterface;
}) {
  const url = `http://localhost:3000/api/playlists/${playlist.id}`;
  const addToPlaylist = async () => {
    try {
      const addResult = await axios.patch(url, {
        movieId: movie.id,
        action: "add",
      });
      if (addResult.status === 200) {
        playlistHandler((prevPlaylists: PlaylistInterface[]) => {
          const filtered = prevPlaylists.filter(
            (playlistToFilter) => playlistToFilter.id !== playlist.id
          );
          return [
            ...filtered,
            { ...playlist, movies: [...playlist.movies, movie] },
          ];
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const removeFromPlaylist = async () => {
    try {
      const removeResult = await axios.patch(url, {
        movieId: movie.id,
        action: "remove",
      });
      if (removeResult.status === 200) {
        playlistHandler((prevPlaylists: PlaylistInterface[]) => {
          const newPlaylists = prevPlaylists.filter(
            (playlistToFilter) => playlistToFilter.id !== playlist.id
          );
          newPlaylists.push({
            ...playlist,
            movies: playlist.movies.filter(
              (movieToFilter) => movieToFilter.id !== movie.id
            ),
          });
          return newPlaylists;
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex flex-row justify-between items-center">
      <p>{playlist.name}</p>
      {inPlaylist ? (
        <button onClick={removeFromPlaylist} className="btn glass bg-navy">
          Remove from Playlist
        </button>
      ) : (
        <button onClick={addToPlaylist} className="btn glass bg-navy">
          Add to playlist
        </button>
      )}
    </div>
  );
}

export default PlaylistElement;
