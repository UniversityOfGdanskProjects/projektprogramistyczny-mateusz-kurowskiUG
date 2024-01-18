import { createContext } from "react";
import MovieInterface from "../../../../interfaces/Movie.model";

type THomeContext = {
  popularMovies?: MovieInterface[];
  setPopularMovies: (movies: MovieInterface[]) => void;
  watchlist?: MovieInterface[];
  setWatchlist: (movies: MovieInterface[]) => void;
  playlists?: MovieInterface[];
  setPlaylists: (movies: MovieInterface[]) => void;
  allMovies?: MovieInterface[];
  setAllMovies: (movies: MovieInterface[]) => void;
};

export const homeContext = createContext<THomeContext>({
  popularMovies: [],
  setPopularMovies: () => {},
  watchlist: [],
  setWatchlist: () => {},
  playlists: [],
  setPlaylists: () => {},
  allMovies: [],
  setAllMovies: () => {},
});
