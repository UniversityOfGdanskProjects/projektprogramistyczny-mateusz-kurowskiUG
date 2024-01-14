import { createContext } from "react";

export const movieContext = createContext({
  movie: {},
  cast: [],
  setMovie: (movie: any) => {},
  setCast: (cast: any) => {},
  movieId: null,
});
