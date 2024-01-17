"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import MovieDetails from "./components/MovieDetails";
import MovieInterface from "../../../../interfaces/Movie.model";
import { movieContext } from "../movieContext";
import ReviewInterface from "../../../../interfaces/Review.model";
import { CastInterface } from "../../../../interfaces/Cast.model";
function Page({ params }: { params: { movieId: string } }) {
  const router = useRouter();
  const [movie, setMovie] = useState<MovieInterface>({} as MovieInterface);
  const [cast, setCast] = useState<CastInterface[]>([]);
  const [reviews, setReviews] = useState<ReviewInterface[]>([]);
  const [reviewed, setReviewed] = useState<boolean>(false);
  const [inWatchlist, setInWatchlist] = useState<boolean>(false);
  const [playlists, setPlaylists] = useState<boolean>(false);
  return (
    <movieContext.Provider
      value={{
        movie,
        setMovie,
        cast,
        setCast,
        movieId: params.movieId,
        reviews,
        setReviews,
        reviewed,
        setReviewed,
        inWatchlist,
        setInWatchlist,
        playlists,
        setPlaylists,
      }}
    >
      <MovieDetails movieId={params.movieId} />
    </movieContext.Provider>
  );
}

export default Page;
