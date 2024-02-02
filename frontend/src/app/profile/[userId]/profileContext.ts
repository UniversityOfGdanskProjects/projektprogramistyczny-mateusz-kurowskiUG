import { createContext } from "react";
import MovieInterface from "../../../../interfaces/Movie.model";
import { TActionWatchlist } from "./components/watchListReducer";
import PlaylistInterface from "../../../../interfaces/Playlist.model";
import UserStats from "../../../../interfaces/UserStats.model";
import IChart from "../../../../interfaces/Chart.model";

type TProfileContext = {
  userId: string;
  setUserId: (userId: string) => void;
  watchlist: MovieInterface[];
  watchlistDispatch: React.Dispatch<TActionWatchlist>;
  playlists: PlaylistInterface[];
  setPlaylists: (playlists: PlaylistInterface[]) => void;
  userStats: UserStats;
  setUserStats: (userStats: UserStats) => void;
  chartData: IChart;
  setChartData: (chartData: IChart) => void;
};

export const profileContext = createContext<TProfileContext>(
  {} as TProfileContext
);
