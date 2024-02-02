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
import GenreStats from "./components/GenreStats";
import UserStats from "../../../../interfaces/UserStats.model";

function Page() {
  const [playlists, setPlaylists] = useState<PlaylistInterface[]>([]);
  const [watchlist, watchlistDispatch] = useReducer<TWachlistReducer>(
    watchlistReducer,
    [] as MovieInterface[]
  );
  const [userStats, setUserStats] = useState<UserStats>({} as UserStats);
  const [chartData, setChartData] = useState({} as any);
  return (
    <profileContext.Provider
      value={{
        watchlist,
        watchlistDispatch,
        playlists,
        setPlaylists,
        userStats,
        setUserStats,
        chartData,
        setChartData,
        
      }}
    >
      <div>
        <ProfileInfo />
        <GenreStats />
        <FilterAndSortWatchlist />
        <Watchlist />
        <Playlists />
      </div>
    </profileContext.Provider>
  );
}

export default Page;
