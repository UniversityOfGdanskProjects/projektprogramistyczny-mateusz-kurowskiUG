import { createContext } from "react";
import MovieInterface from "../../../../interfaces/Movie.model";
import { TActionWatchlist } from "./components/watchListReducer";
import PlaylistInterface from "../../../../interfaces/Playlist.model";

type TProfileContext = {
  userId: string;
  setUserId: (userId: string) => void;
  watchlist: MovieInterface[];
  watchlistDispatch: React.Dispatch<TActionWatchlist>;
  playlists: PlaylistInterface[];
  setPlaylists: (playlists: PlaylistInterface[]) => void;
};

export const profileContext = createContext<TProfileContext>(
  {} as TProfileContext
);
