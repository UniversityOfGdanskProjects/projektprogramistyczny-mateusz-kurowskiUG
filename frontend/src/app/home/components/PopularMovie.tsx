import React from "react";
import MovieInterface from "./Movie.model";
import Image from "next/image";
function PopularMovie({ movie }: { movie: MovieInterface }) {
  const genres = movie.genres?.slice(0, 2).map((genre) => (
    <div
      key={crypto.randomUUID()}
      className="badge badge-outline p-1 text-xs flex"
    >
      {genre.name}
    </div>
  ));

  return (
    <div className="card w-40 h-90 bg-base-100 shadow-xl relative carousel-item">
      <figure>
        <Image
          src={movie.poster_path}
          height={200}
          width={160}
          alt={movie.title}
        />
      </figure>
      <div className="card-body py-0 h-40">
        <h2 className="card-title text-center text-wrap text-base">
          {movie.title}
          <div className="badge badge-secondary absolute top-0 right-0 text-xs">
            Popular
          </div>
        </h2>
        <div className="card-actions justify-center">{genres}</div>
      </div>
    </div>
  );
}

export default PopularMovie;
