import loginContext from "@/app/loginContext";
import React, { useContext, useEffect } from "react";
import { profileContext } from "../profileContext";
import axios from "axios";
import PopularMovie from "./PopularMovie";
import MovieInterface from "../../../../../interfaces/Movie.model";

function Watchlist() {
  const { user } = useContext(loginContext);
  const { watchlist, watchlistDispatch } = useContext(profileContext);
  useEffect(() => {
    const loadWatchlist = async () => {
      try {
        const watchlistResponse = await axios.get(
          `http://localhost:3000/api/watchlist/${user?.userId}`
        );
        return watchlistResponse.data.data;
      } catch (error) {
        return [];
      }
    };
    loadWatchlist()
      .then((watchlist) =>
        watchlistDispatch({ type: "set", payload: watchlist })
      )
      .catch(() => watchlistDispatch({ type: "set", payload: [] }));
  }, []);

  return (
    <>
      <div className="watchlistMovies flex flex-col ">
        <h2 className="text-center text-2xl">Watchlist:</h2>
        <div className="movies flex overflow-y-auto gap-2 flex-1">
          {watchlist.length ? (
            watchlist.map((movie: MovieInterface) => (
              <PopularMovie where="watchlist" movie={movie} key={movie.id} />
            ))
          ) : (
            <p className="text-center w-full">No movies in watchlist yet</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Watchlist;
