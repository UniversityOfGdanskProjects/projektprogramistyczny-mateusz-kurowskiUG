import React, { useContext, useEffect } from "react";
import { popularMoviesContext } from "./PopularContext";
import axios from "axios";
import { log } from "console";
import InfiniteScroll from "react-infinite-scroll-component";
import PopularMovie from "./PopularMovie";
import MovieInterface from "../../../../interfaces/Movie.model";

function Movies() {
  useEffect(() => {
    const loadMovies = async () => {
      const res = await axios.get("http://localhost:3000/api/movies");
      return res.data.data;
    };
    loadMovies()
      .then((res) => {
        console.log(res[0]);

        setAllMovies(res);
      })
      .catch((err) => {
        setAllMovies([]);
      });
  }, []);

  const { allMovies, setAllMovies } = useContext(popularMoviesContext);
  return (
    <div className="flex flex-wrap gap-3 flex-1">
      {/* <InfiniteScroll
        dataLength={allMovies.length}
        loader={"Loading..."}
        endMessage={"That's all"}
      > */}
      {allMovies.map((movie: MovieInterface) => (
        <PopularMovie
          height="h-72"
          width={"w-36"}
          key={movie.id}
          movie={movie}
          popular={false}
        />
      ))}
      {/* </InfiniteScroll> */}
    </div>
  );
}

export default Movies;
