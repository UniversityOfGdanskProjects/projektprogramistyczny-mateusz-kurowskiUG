"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import MovieDetails from "./components/MovieDetails";
import MovieInterface from "../../../../interfaces/Movie.model";
import { movieContext } from "../movieContext";
import ReviewInterface from "../../../../interfaces/Review.model";
import { CastInterface } from "../../../../interfaces/Cast.model";
function page({ params }: { params: { movieId: string } }) {
  const router = useRouter();
  const [movie, setMovie] = useState<MovieInterface>({} as MovieInterface);
  const [cast, setCast] = useState<CastInterface[]>([]);
  const [reviews, setReviews] = useState<ReviewInterface[]>([]);
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
      }}
    >
      <MovieDetails movieId={params.movieId} />
    </movieContext.Provider>
  );
}

export default page;
