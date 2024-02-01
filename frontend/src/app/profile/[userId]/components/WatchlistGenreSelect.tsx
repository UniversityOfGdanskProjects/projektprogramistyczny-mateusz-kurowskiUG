"use client";
import React, { useContext } from "react";
import { profileContext } from "../profileContext";
import IGenre from "../../../../../interfaces/Genre.model";
import loginContext from "@/app/loginContext";
import axios from "axios";
import MovieInterface from "../../../../../interfaces/Movie.model";

function WatchlistGenreSelect() {
  const { watchlist, watchlistDispatch } = useContext(profileContext);
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
  const genres = watchlist
    .map((movie) => movie.genres)
    .flat()
    .reduce((acc: IGenre[], genre) => {
      const genreInAcc = acc.find((g) => g.id === genre.id);
      if (!genreInAcc) {
        acc.push(genre);
      }
      return acc;
    }, [])
    .sort((a: IGenre, b: IGenre) => a.name.localeCompare(b.name));

  const filterWatchlist = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const genreId = e?.target.value;
    const newWatchlist = await loadWatchlist();
    console.log(newWatchlist);

    watchlistDispatch({
      type: "set",
      payload: newWatchlist,
    });
    if (genreId !== "all") {
      watchlistDispatch({ type: "filterByGenre", payload: { value: genreId } });
    }
    return;
  };

  return (
    <label className="form-control w-full max-w-xs self-center">
      <div className="label">
        <span className="label-text">Genre</span>
      </div>
      <select
        defaultValue={"all"}
        onChange={filterWatchlist}
        className="select select-bordered text-center"
      >
        <option value={"all"}>All</option>
        {watchlist
          ? [...genres].map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))
          : null}
      </select>
    </label>
  );
}

export default WatchlistGenreSelect;
