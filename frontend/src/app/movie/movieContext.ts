import { createContext } from "react";

import MovieInterface from "../../../interfaces/Movie.model";
import CastInterface from "../../../interfaces/Cast.model";
import ReviewInterface from "../../../interfaces/Review.model";
import PlaylistInterface from "../../../interfaces/Playlist.model";

type TMovieContext = {
  movie?: MovieInterface | null;
  cast?: CastInterface[] | null;
  setMovie: (movie: MovieInterface) => void;
  setCast: (cast: CastInterface[]) => void;
  movieId: number | null;
  reviews?: ReviewInterface[] | null;
  setReviews: (reviews: ReviewInterface[]) => void;
  setReviewed: (reviewed: boolean) => void;
  inWatchlist?: boolean;
  setInWatchlist: (inWatchlist: boolean) => void;
  playlists?: PlaylistInterface[] | null;
  setPlaylists: (playlists: PlaylistInterface[]) => void;
  watchlist?: MovieInterface[] | null;
  setWatchlist: (watchlist: MovieInterface[]) => void;
};

export const movieContext = createContext<TMovieContext>({
  movie: null,
  cast: null,
  setMovie: (movie: MovieInterface | null) => {},
  setCast: (cast: CastInterface[] | null) => {},
  movieId: null,
  reviews: null,
  setReviews: (reviews: ReviewInterface[] | null) => {},
  setReviewed: (reviewed: boolean) => {},
  inWatchlist: false,
  setInWatchlist: (inWatchlist: boolean) => {},
  watchlist: [],
  setWatchlist: (watchlist: MovieInterface[]) => {},
  playlists: [],
  setPlaylists: (playlists: PlaylistInterface[]) => {},
});
