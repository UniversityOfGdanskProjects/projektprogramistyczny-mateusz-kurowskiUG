"use client";

import React, { useContext, useLayoutEffect } from "react";
import { homeContext } from "./HomeContext";
import axios from "axios";
import PopularMovie from "./PopularMovie";
import MovieInterface from "../../../../interfaces/Movie.model";

function Movies() {
  useLayoutEffect(() => {
    const loadMovies = async () => {
      const res = await axios.get("http://localhost:3000/api/movies");
      return res.data.data;
    };
    loadMovies()
      .then((res) => {
        allMoviesDispatch({ type: "refresh", payload: res });
      })
      .catch(() => {
        allMoviesDispatch({ type: "refresh", payload: [] });
      });
  }, []);

  const { allMovies, allMoviesDispatch } = useContext(homeContext);
  return (
    <div className="flex flex-wrap gap-3 flex-1">
      {allMovies
        ? allMovies.map((movie: MovieInterface) => (
            <PopularMovie
              height="h-92"
              width={"w-36"}
              key={movie.id}
              movie={movie}
              popular={false}
            />
          ))
        : null}
    </div>
  );
}

export default Movies;
