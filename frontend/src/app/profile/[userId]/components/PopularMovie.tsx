"use client";

import React, { useContext } from "react";
import MovieInterface from "../../../../../interfaces/Movie.model";
import Image from "next/image";
import Link from "next/link";
import plus18 from "/public/images/plus18.png";
import axios from "axios";
import loginContext from "@/app/loginContext";
import { profileContext } from "../profileContext";
function PopularMovie({
  movie,
  where,
  playlistId,
}: {
  movie: MovieInterface;
  where: string;
  playlistId?: string;
}) {
  const { setWatchlist, setPlaylists } = useContext(profileContext);
  const { user } = useContext(loginContext);

  const deleteFromWatchlist = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/watchlist/${movie.id}`,
        { data: { userId: user?.userId } }
      );
      if (response.status === 200) {
        setWatchlist((prev) => prev.filter((m) => m.id !== movie.id));
      }
    } catch (e) {
      alert("Something went wrong");
    }
  };
  const deleteFromPlaylist = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/api/playlists/${playlistId}`,
        { movieId: movie.id, action: "remove" }
      );
      if (response.status === 200) {
        setPlaylists((prev) => {
          const thisPlaylist = prev.find((p) => p.id === playlistId);
          return [
            ...prev.filter((p) => p.id !== playlistId),
            {
              ...thisPlaylist,
              movies: thisPlaylist.movies.filter((m) => m.id !== movie.id),
            },
          ];
        });
      }
    } catch (e) {
      alert("Something went wrong");
    }
  };
  return (
    <div
      className={`card w-40 h-80 bg-base-100 shadow-xl relative carousel-item`}
    >
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
        <h2 className="card-title my-auto text-center self-center text-wrap text-base">
          {movie.title}
        </h2>
        <button
          onClick={() => {
            (where === "watchlist"
              ? deleteFromWatchlist
              : deleteFromPlaylist)();
          }}
          className="btn btn-circle btn-error absolute top-0 right-0"
        >
          X
        </button>
      </div>
    </div>
  );
}

export default PopularMovie;
