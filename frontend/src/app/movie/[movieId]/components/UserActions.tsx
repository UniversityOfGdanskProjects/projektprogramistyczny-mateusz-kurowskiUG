"use client";
import React, { useContext } from "react";
import { movieContext } from "../../movieContext";
import ListButton from "./ListButton";
import loginContext from "@/app/loginContext";
import axios from "axios";
function UserActions() {
  const { inWatchlist, setInWatchlist, playlists, setPlaylists, movie } =
    useContext(movieContext);
  const { user } = useContext(loginContext);

  const addToWatchlist = async () => {
    const url = "http://localhost:3000/api/watchlist/";
    const requestBody = {
      movieId: movie.id,
      userId: user?.userId,
    };
    try {
      const request = await axios.post(url, requestBody);
      if (request.status === 200) {
        setInWatchlist(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const removeFromWatchlist = async () => {
    const url = `http://localhost:3000/api/watchlist/${movie?.id}`;
    const requestBody = {
      userId: user?.userId,
    };
    console.log("url", url);
    console.log("body", requestBody);

    try {
      const request = await axios.delete(url, { data: requestBody });
      if (request.status === 200) {
        setInWatchlist(false);
      }
    } catch (error) {
      alert("some error occured");
    }
  };
  // TODO: PLAYLIST REDUCER??????????
  const showPlaylists = async () => {
    const url = `http://localhost:3000/api/playlists/${user?.userId}`;
    const request = await axios.get(url);
    // add modal
  };
  const addToPlaylist = () => {
    const url = ``;
  };
  const removeFromPlaylist = () => {};
  const createPlaylist = () => {
    const url = `http://localhost:3000/api/playlists/`;
  };

  return (
    <div className="flex flex-col py-4 px-2 gap-2">
      {inWatchlist ? (
        <ListButton
          fullHeart={true}
          onClick={removeFromWatchlist}
          text="Remove from watchlist"
        />
      ) : (
        <ListButton
          color="btn-primary"
          fullHeart={false}
          onClick={addToWatchlist}
          text="Add to watchlist"
        />
      )}
      <ListButton
        color="btn-secondary"
        fullHeart={false}
        onClick={showPlaylists}
        text="Add to playlist"
      />
    </div>
  );
}

export default UserActions;
