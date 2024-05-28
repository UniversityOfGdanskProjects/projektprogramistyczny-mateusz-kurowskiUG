"use client";
import React, { useReducer, useState } from "react";
import InnerNavBar from "./components/InnerNavBar";
import Popular from "./components/Popular";
import { homeContext } from "./components/HomeContext";
import FilterMovies from "./components/FilterMovies";
import Movies from "./components/Movies";
import MovieInterface from "../../../interfaces/Movie.model";
import movieReducer from "./components/movieReducer";
import Colorful from "./components/Colorful";

function HomePage() {
  const [popularMovies, setPopularMovies] = useState<MovieInterface[]>([]);
  const [allMovies, allMoviesDispatch] = useReducer<MovieInterface[]>(
    movieReducer,
    []
  );
  const [allGenres, setAllGenres] = useState<string[]>([]);
  const selectRef = React.useRef(null);
  return (
    <>
      <homeContext.Provider
        value={{
          popularMovies,
          setPopularMovies,
          allMovies,
          allMoviesDispatch,
          allGenres,
          setAllGenres,
          selectRef,
        }}
      >
        <div className="flex flex-col gap-4 px-2">
          <InnerNavBar />
          <Popular />
          <FilterMovies />
          <Movies />
          {/* <Colorful /> */}
        </div>
      </homeContext.Provider>
    </>
  );
}

export default HomePage;
