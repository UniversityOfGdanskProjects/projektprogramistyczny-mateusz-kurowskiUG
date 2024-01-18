"use client";
import React, { useState } from "react";
import MovieDetails from "./components/MovieDetails";
import MovieInterface from "../../../../interfaces/Movie.model";
import { movieContext } from "../movieContext";
import ReviewInterface from "../../../../interfaces/Review.model";
import CastInterface from "../../../../interfaces/Cast.model";
import PlaylistInterface from "../../../../interfaces/Playlist.model";
function Page({ params }: { params: { movieId: string } }) {
  const [movie, setMovie] = useState<MovieInterface>({} as MovieInterface);
  const [cast, setCast] = useState<CastInterface[]>([]);
  const [reviews, setReviews] = useState<ReviewInterface[]>([]);
  const [reviewed, setReviewed] = useState<boolean>(false);
  const [inWatchlist, setInWatchlist] = useState<boolean>(false);
  const [playlists, setPlaylists] = useState<PlaylistInterface[]>([]);
  const [watchlist, setWatchlist] = useState<MovieInterface[]>([]);
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
        watchlist,
        setWatchlist,
      }}
    >
      <MovieDetails movieId={params.movieId} />
    </movieContext.Provider>
  );
}

export default Page;
