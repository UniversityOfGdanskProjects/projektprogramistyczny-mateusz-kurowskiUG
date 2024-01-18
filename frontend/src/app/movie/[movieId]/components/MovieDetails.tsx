"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect } from "react";
import { movieContext } from "../../movieContext";
import MovieInterface from "../../../../../interfaces/Movie.model";
import Cast from "./Cast";
import Reviews from "./Reviews";
import AddReview from "./AddReview";
import Primary from "./Primary";
import UserActions from "./UserActions";
import loginContext from "@/app/loginContext";

function MovieDetails() {
  const router = useRouter();
  const {
    movie,
    setMovie,
    inWatchlist,
    setInWatchlist,
    playlists,
    inPlaylists,
    watchlist,
    setWatchlist,
    movieId,
    setPlaylists,
  } = useContext(movieContext);
  const { user } = useContext(loginContext);
  useEffect(() => {
    const loadMovieDetails = async () => {
      const movie = await axios.get(
        `http://localhost:3000/api/movies/${movieId}`
      );
      const data = movie.data.data;
      return data;
    };
    const loadWatchlist = async () => {
      const url = `http://localhost:3000/api/watchlist/${user.userId}`;
      try {
        console.log(url);
        const request = await axios.get(url);
        if (request.status === 200) {
          const watchlist: MovieInterface[] = request.data.data;
          console.log(watchlist);

          return watchlist;
        }
        return [];
      } catch (error) {
        console.log(error);
        return [];
      }
    };

    const loadPlaylists = async () => {
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
      .then((moviesRes: MovieInterface[]) => {
        setMovie(moviesRes);
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
      .then((playlistsRes) => {
        setPlaylists(playlistsRes);
      })
      .catch(() => {
        setPlaylists([]);
        alert("some error");
      });
  }, []);

  return (
    <>
      <Primary movie={movie} />
      <UserActions />
      <Cast />
      <Reviews />
      <AddReview />
    </>
  );
}

export default MovieDetails;
