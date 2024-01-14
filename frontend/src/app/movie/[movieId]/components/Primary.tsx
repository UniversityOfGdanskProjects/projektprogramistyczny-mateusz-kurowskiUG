"use client";

import React from "react";
import MovieInterface from "../../../../../interfaces/Movie.model";
import Image from "next/image";
import plus18 from "/public/images/plus18.png";

function Primary({ movie }: { movie: MovieInterface }) {
  //   const { movie } = useContext(movieContext);
  return (
    <>
      <div
        className={
          "my-5 movie-background w-full h-96 bg-cover  bg-no-repeat relative"
        }
        style={{
          backgroundImage: `url(${movie.backdrop_path})`,
        }}
      >
        <div className="movie absolute bottom-0 left-10 hover:opacity-0 transition ease-in-out duration-500">
          <Image
            src={movie.poster_path}
            width={120}
            height={120}
            alt={movie.title}
            className="w-auto h-auto"
          />
          {movie.adult ? (
            <div className="fa18 absolute top-0 right-0">
              <Image src={plus18} width={50} height={50} alt="18plus" />
            </div>
          ) : null}
        </div>
      </div>
      <div className="movie-details flex flex-col">
        <div className="important flex flex-row">
          <div className="movie-title text-5xl">{movie.title}</div>
          <div>{movie.release_date}</div>
        </div>
        <div className="movie-overview">{movie.overview}</div>
      </div>
    </>
  );
}

export default Primary;
