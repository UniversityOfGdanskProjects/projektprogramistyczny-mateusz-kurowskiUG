"use client";
import React, { useState } from "react";
import InnerNavBar from "./components/InnerNavBar";
import Popular from "./components/Popular";
import { popularMoviesContext } from "./components/PopularContext";
import FilterMovies from "./components/FilterMovies";
import Movies from "./components/Movies";
import MovieInterface from "../../../interfaces/Movie.model";

function page() {
  const [popularMovies, setPopularMovies] = useState<MovieInterface[]>([]);
  const [allMovies, setAllMovies] = useState<MovieInterface[]>([]);
  return (
    <>
      <popularMoviesContext.Provider
        value={{ popularMovies, setPopularMovies, allMovies, setAllMovies }}
      >
        <InnerNavBar />
        <Popular />
        <FilterMovies />
        <Movies />
      </popularMoviesContext.Provider>
    </>
  );
}

export default page;
