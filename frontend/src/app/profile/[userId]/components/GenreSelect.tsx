import axios from "axios";
import React, { useContext, useEffect } from "react";
import { homeContext } from "./HomeContext";

function GenreSelect() {
  const { allGenres, setAllGenres, selectRef } = useContext(homeContext);
  const getGenres = async () => {
    const genresLoaded = axios.get(
      `http://localhost:3000/api/tmdb/movies/genres`
    );
    genresLoaded
      .then((res) => {
        setAllGenres(res.data.data);
      })
      .catch((err) => {
        console.log("genres", err);
        setAllGenres([]);
      });
  };
  useEffect(() => {
    getGenres();
  }, []);
  return (
    <>
      <label htmlFor="genre">Genre:</label>
      <select
        ref={selectRef}
        defaultValue={-1}
        name="genre"
        className="genre select select-bordered w-full max-w-xs text-center bg-white "
      >
        <option value={-1}>All</option>
        {allGenres
          ? allGenres.map((genre) => {
              return (
                <option key={genre.id} value={genre.TMDBId}>
                  {genre.name}
                </option>
              );
            })
          : null}
      </select>
    </>
  );
}

export default GenreSelect;
