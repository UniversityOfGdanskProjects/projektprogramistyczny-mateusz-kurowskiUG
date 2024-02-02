// Movies.tsx

import React, { useContext, useLayoutEffect } from "react";
import { homeContext } from "./HomeContext";
import axios from "axios";
import PopularMovie from "./PopularMovie";
import variables from "../style.module.scss";

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
    <div
      className={`flex flex-wrap gap-3 flex-1 ${variables.movieCard}`}
      style={{}}
    >
      {allMovies
        ? allMovies.map((movie: MovieInterface) => (
            <PopularMovie
              key={movie.id}
              height={"h-92"}
              width={"w-36"}
              movie={movie}
              popular={false}
            />
          ))
        : null}
    </div>
  );
}

export default Movies;
