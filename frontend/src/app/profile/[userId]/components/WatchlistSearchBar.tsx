import React, { useContext } from "react";
import { profileContext } from "../profileContext";
import loginContext from "@/app/loginContext";
import axios from "axios";

function WatchlistSearchBar() {
  const { watchlistDispatch } = useContext(profileContext);
  const { user } = useContext(loginContext);
  const loadWatchlist = async () => {
    if (!user?.userId) return [];
    try {
      const watchlistResponse = await axios.get(
        `http://localhost:3000/api/watchlist/${user?.userId}`
      );
      return watchlistResponse.data.data;
    } catch (error) {
      return [];
    }
  };
  const search = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e?.target.value;
    const newWatchlist = await loadWatchlist();
    console.log(searchTerm);

    if (!searchTerm) {
      watchlistDispatch({
        type: "set",
        payload: newWatchlist,
      });
      return;
    }
    watchlistDispatch({
      type: "filterByName",
      payload: { title: searchTerm },
    });
  };
  return (
    <label className="form-control w-full max-w-xs self-center">
      <div className="label">
        <span className="label-text">Movie Title</span>
      </div>
      <input
        type="text"
        onChange={search}
        placeholder="Type here"
        className="input input-bordered w-full max-w-xs"
      />
    </label>
  );
}

export default WatchlistSearchBar;
