"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useLayoutEffect } from "react";
import { movieContext } from "../../movieContext";
import MovieInterface from "../../../../../interfaces/Movie.model";
import Cast from "./Cast";
import Reviews from "./Reviews";
import AddReview from "./AddReview";
import Primary from "./Primary";
import UserActions from "./UserActions";
import loginContext from "@/app/loginContext";
import PlaylistInterface from "../../../../../interfaces/Playlist.model";

function MovieDetails() {
  const router = useRouter();
  const {
    movie,
    setMovie,
    setInWatchlist,
    setWatchlist,
    movieId,
    setPlaylists,
  } = useContext(movieContext);
  const { user } = useContext(loginContext);
  useEffect(() => {
    if (!movieId) return;
    console.log("USER", user);

    const loadMovieDetails = async (): Promise<MovieInterface> => {
      try {
        const movie = await axios.get(
          `http://localhost:3000/api/movies/${movieId}`
        );
        const data = movie.data.data;
        return data;
      } catch (error) {
        return {} as MovieInterface;
      }
    };
    const loadWatchlist = async (): Promise<MovieInterface[]> => {
      if (!user) return [];
      const url = `http://localhost:3000/api/watchlist/${user.userId}`;
      try {
        const request = await axios.get(url);
        if (request.status === 200) {
          const watchlist: MovieInterface[] = request.data.data;
          return watchlist;
        }
        return [];
      } catch (error) {
        return [];
      }
    };

    const loadPlaylists = async (): Promise<PlaylistInterface[]> => {
      if (!user) return [];
      const url = `localhost:3000/api/playlists/${user?.userId}`;
      try {
        const request = await axios.get(url);
        if (request.status === 200) {
          return request.data.data;
        } else {
          return [];
        }
      } catch (error) {
        return [];
      }
    };

    loadMovieDetails()
      .then((value: MovieInterface) => {
        setMovie(value);
      })
      .catch(() => {
        router.push("/404");
      });
    loadWatchlist()
      .then((watchlistRes: MovieInterface[]) => {
        setWatchlist(watchlistRes);
        setInWatchlist(
          watchlistRes.some(
            (movieInWatchlist) => movieInWatchlist.TMDBId == movieId
          )
        );
      })
      .catch(() => {
        setWatchlist([]);
        setInWatchlist(false);
        alert("some error");
      });
    loadPlaylists()
      .then((playlistsRes: PlaylistInterface[]) => {
        setPlaylists(playlistsRes);
      })
      .catch(() => {
        setPlaylists([]);
        alert("some error");
      });
  }, []);

  return (
    <>
      {movie ? <Primary movie={movie} /> : null}
      <UserActions />
      <Cast />
      <Reviews />
      <AddReview />
    </>
  );
}

export default MovieDetails;
