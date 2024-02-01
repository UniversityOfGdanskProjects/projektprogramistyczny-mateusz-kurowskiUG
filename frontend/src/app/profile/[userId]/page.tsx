"use client";

import loginContext from "@/app/loginContext";
import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import Playlists from "./components/Playlists";
import Watchlist from "./components/Watchlist";
import ProfileInfo from "./components/ProfileInfo";
import { profileContext } from "./profileContext";
import PlaylistInterface from "../../../../interfaces/Playlist.model";
import MovieInterface from "../../../../interfaces/Movie.model";
import FilterAndSortWatchlist from "./components/FilterAndSortWatchlist";
import {
  TWachlistReducer,
  watchlistReducer,
} from "./components/watchListReducer";

function Page() {
  const [playlists, setPlaylists] = useState<PlaylistInterface[]>([]);
  const [watchlist, watchlistDispatch] = useReducer<TWachlistReducer>(
    watchlistReducer,
    [] as MovieInterface[]
  );
  return (
    <profileContext.Provider
      value={{
        watchlist,
        watchlistDispatch,
        playlists,
        setPlaylists,
      }}
    >
      <div>
        <ProfileInfo />
        <FilterAndSortWatchlist />
        <Watchlist />
        <Playlists />
      </div>
    </profileContext.Provider>
  );
}

export default Page;
