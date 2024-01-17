"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect } from "react";
import { movieContext } from "../../movieContext";
import Image from "next/image";
import MovieInterface from "../../../../../interfaces/Movie.model";
import Cast from "./Cast";
import Reviews from "./Reviews";
import AddReview from "./AddReview";
import Primary from "./Primary";
import UserActions from "./UserActions";
import PlaylistInterface from "../../../../../interfaces/Playlist.model";
import loginContext from "@/app/loginContext";

function MovieDetails({ movieId }: { movieId: string }) {
  const router = useRouter();
  const {
    movie,
    setMovie,
    inWatchlist,
    setInWatchlist,
    playlists,
    inPlaylists,
  }: {
    movie: MovieInterface;
    inWatchlist: MovieInterface[];
    playlists: PlaylistInterface[];
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
    // #TODO ADD TO EFFECT
    const loadWatchlist = async () => {
      const url = `http://localhost:3000/api/watchlist/`;
      const requestBody = {
        userId: user.userId,
      };
      try {
        const request = await axios.post(url, requestBody);
        if (request.status === 200) {
          const watchlist: MovieInterface[] = request.data.data;
          const includesThisMovie = !!watchlist.find(
            (watchlistMovie) => watchlistMovie.id === movie.id
          );
          setInWatchlist(includesThisMovie);
        } else {
          setInWatchlist(false);
          alert("some error else");
        }
      } catch (error) {
        alert("some error catch");
      }
    };
    // #TODO ADD TO EFFECT

    const loadPlaylists = async () => {
      const url = `localhost:3000/api/playlists/${user?.userId}`;
      try {
        const request = await axios.get(url);
        if (request.status === 200) {
          setPlaylists(request.data.data);
        } else {
          alert("some error else");
          setPlaylists([]);
        }
      } catch (error) {
        alert("some error catch");
        setPlaylists([]);
      }
    };

    loadMovieDetails()
      .then((res) => {
        setMovie(res);
      })
      .catch(() => {
        router.push("/404");
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
