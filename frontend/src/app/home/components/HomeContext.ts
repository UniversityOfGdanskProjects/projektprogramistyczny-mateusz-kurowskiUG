import { createContext } from "react";
import MovieInterface from "../../../../interfaces/Movie.model";
import IGenre from "../../../../interfaces/Genre.model";
import { TMovieAction } from "./movieReducer";

type THomeContext = {
  popularMovies?: MovieInterface[];
  setPopularMovies: (movies: MovieInterface[]) => void;
  watchlist?: MovieInterface[];
  setWatchlist: (movies: MovieInterface[]) => void;
  playlists?: MovieInterface[];
  setPlaylists: (movies: MovieInterface[]) => void;
  allMovies?: MovieInterface[];
  allMoviesDispatch: (action: TMovieAction) => void;
  allGenres?: IGenre[];
  setAllGenres: (genres: string[]) => void;
};

export const homeContext = createContext<THomeContext>({
  popularMovies: [],
  setPopularMovies: () => {},
  watchlist: [],
  setWatchlist: () => {},
  playlists: [],
  setPlaylists: () => {},
  allMovies: [],
  allMoviesDispatch: () => {},
  allGenres: [],
  setAllGenres: () => {},
});
