import { createContext } from "react";
import MovieInterface from "../../../../interfaces/Movie.model";
import { TActionWatchlist } from "./components/watchListReducer";

type TProfileContext = {
  userId: string;
  setUserId: (userId: string) => void;
  watchlist: MovieInterface[];
  watchlistDispatch: React.Dispatch<TActionWatchlist>;
};

export const profileContext = createContext<TProfileContext>({});
