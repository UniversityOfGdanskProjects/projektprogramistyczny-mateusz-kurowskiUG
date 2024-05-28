"use client";
import React, { useContext } from "react";
import { movieContext } from "../../movieContext";
import ListButton from "./ListButton";
import loginContext from "@/app/loginContext";
import axios from "axios";
import PlaylistsModal from "./PlaylistsModal";
function UserActions() {
  const { inWatchlist, setInWatchlist, movie } = useContext(movieContext);
  const { user } = useContext(loginContext);

  const addToWatchlist = async () => {
    if (!user) return;
    if (!movie) return;
    const url = "http://localhost:3000/api/watchlist/";
    const requestBody = {
      movieId: movie.id,
      userId: user?.userId,
    };
    try {
      const request = await axios.post(url, requestBody);
      if (request.status === 200) {
        setInWatchlist(true);
      } else {
        alert("some error occured");
      }
    } catch (error) {
      return;
    }
  };
  const removeFromWatchlist = async () => {
    if (!user) return;
    if (!movie) return;
    const url = `http://localhost:3000/api/watchlist/${movie?.id}`;
    const requestBody = {
      userId: user?.userId,
    };

    try {
      const request = await axios.delete(url, { data: requestBody });
      if (request.status === 200) {
        setInWatchlist(false);
      }
    } catch (error) {
      alert("some error occured");
    }
  };
  const showPlaylists = async () => {
    const modal = document.getElementById("playlist-modal");
    if (!modal) return;
    modal.showModal();
  };

  return (
    <div className="flex flex-col py-4 px-2 gap-2">
      {inWatchlist ? (
        <ListButton
          color="bg-sea"
          fullHeart={true}
          onClick={removeFromWatchlist}
          text="Remove from watchlist"
        />
      ) : (
        <ListButton
          color="bg-sea"
          fullHeart={false}
          onClick={addToWatchlist}
          text="Add to watchlist"
        />
      )}
      <ListButton
        color="bg-navy"
        fullHeart={false}
        onClick={showPlaylists}
        text="Add to playlist"
      />
      <PlaylistsModal />
    </div>
  );
}

export default UserActions;
