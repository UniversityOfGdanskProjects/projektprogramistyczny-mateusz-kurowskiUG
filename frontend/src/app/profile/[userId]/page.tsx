"use client";

import loginContext from "@/app/loginContext";
import React, { useContext, useEffect, useState } from "react";
import Playlists from "./components/Playlists";
import Watchlist from "./components/Watchlist";
import ProfileInfo from "./components/ProfileInfo";
import { profileContext } from "./profileContext";
import PlaylistInterface from "../../../../interfaces/Playlist.model";
import MovieInterface from "../../../../interfaces/Movie.model";
import FilterAndSortWatchlist from "./components/FilterAndSortWatchlist";

function Page() {
  const { user } = useContext(loginContext);
  const [watchlist, setWatchlist] = useState<MovieInterface[]>([]);
  const [playlists, setPlaylists] = useState<PlaylistInterface[]>([]);
  return (
    <profileContext.Provider
      value={{ watchlist, setWatchlist, playlists, setPlaylists }}
    >
      <div>
        <ProfileInfo />
        {watchlist.length ? <FilterAndSortWatchlist /> : null}
        <Watchlist />
        <Playlists />
      </div>
    </profileContext.Provider>
  );
}

export default Page;
