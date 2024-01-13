import { createContext } from "react";

export const popularMoviesContext = createContext({
  popularMovies: [],
  setPopularMovies: () => {},
});
