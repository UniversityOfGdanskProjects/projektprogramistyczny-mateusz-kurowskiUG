"use client";
import React, { useState } from "react";
import InnerNavBar from "./components/InnerNavBar";
import Popular from "./components/Popular";
import { homeContext } from "./components/HomeContext";
import FilterMovies from "./components/FilterMovies";
import Movies from "./components/Movies";
import MovieInterface from "../../../interfaces/Movie.model";

function Page() {
  const [popularMovies, setPopularMovies] = useState<MovieInterface[]>([]);
  const [allMovies, setAllMovies] = useState<MovieInterface[]>([]);

  return (
    <>
      <homeContext.Provider
        value={{
          popularMovies,
          setPopularMovies,
          allMovies,
          setAllMovies,
        }}
      >
        <div className="flex flex-col gap-4 px-2">
          <InnerNavBar />
          <Popular />
          <FilterMovies />
          <Movies />
        </div>
      </homeContext.Provider>
    </>
  );
}

export default Page;
