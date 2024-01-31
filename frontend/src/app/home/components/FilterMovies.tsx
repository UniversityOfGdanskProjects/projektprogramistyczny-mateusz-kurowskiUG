"use client";

import React, { useContext } from "react";
import GenreSelect from "./GenreSelect";
import { homeContext } from "./HomeContext";
import axios from "axios";

function FilterMovies() {
  const loadMovies = async () => {
    const res = await axios.get("http://localhost:3000/api/movies");
    return res.data.data;
  };

  const { selectRef, allMoviesDispatch } = useContext(homeContext);
  const handleGenreChange = (e) => {
    loadMovies()
      .then((res) => {
        allMoviesDispatch({ type: "refresh", payload: res });
        if (+selectRef.current.value !== -1)
          allMoviesDispatch({
            type: "filterByGenre",
            payload: +selectRef.current.value,
          });
      })
      .catch(() => {
        allMoviesDispatch({ type: "refresh", payload: [] });
      });
  };
  return (
    <>
      <div className="collapse bg-base-200">
        <input type="checkbox" className="peer" />
        <div className="collapse-title bg-info text-primary-content peer-checked:bg-white peer-checked:text-secondary-content text-center text-3xl text-white">
          Filter
        </div>
        <div className="collapse-content bg-white text-primary-content peer-checked:bg-white peer-checked:text-secondary-content flex flex-col">
          <form
            onChange={handleGenreChange}
            className="flex flex-col text-center "
          >
            <div className="flex justify-between">
              <GenreSelect />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
export default FilterMovies;
