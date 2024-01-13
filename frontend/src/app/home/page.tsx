"use client";
import React, { useState } from "react";
import InnerNavBar from "./components/InnerNavBar";
import Popular from "./components/Popular";
import { popularMoviesContext } from "./components/PopularContext";
function page() {
  const [popularMovies, setPopularMovies] = useState([]);
  return (
    <>
      <popularMoviesContext.Provider
        value={{ popularMovies, setPopularMovies }}
      >
        <InnerNavBar />
        <Popular />
      </popularMoviesContext.Provider>
    </>
  );
}

export default page;
