import React from "react";
import MovieInterface from "../../../../interfaces/Movie.model";
import Image from "next/image";
import Link from "next/link";
import plus18 from "/public/images/plus18.png";
function PopularMovie({
  movie,
  popular,
}: {
  movie: MovieInterface;
  popular: boolean;
}) {
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
      <Link href={`/movie/${movie.TMDBId}`}>
        <figure>
          <Image
            src={movie.poster_path}
            height={200}
            width={160}
            alt={movie.title}
          />
          {movie.adult ? (
            <Image
              className="absolute top-0 left-0"
              src={plus18}
              width={40}
              height={40}
              alt="plus18"
            />
          ) : null}
        </figure>
      </Link>
      <div className="card-body py-0 h-40">
        <h2 className="card-title text-center text-wrap text-base">
          {movie.title}
          {popular ? (
            <div className="badge badge-secondary absolute top-0 right-0 text-xs">
              Popular
            </div>
          ) : null}
        </h2>
        <div className="card-actions justify-center">{genres}</div>
      </div>
    </div>
  );
}

export default PopularMovie;
