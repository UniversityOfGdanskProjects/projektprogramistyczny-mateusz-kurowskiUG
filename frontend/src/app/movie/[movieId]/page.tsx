"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import MovieDetails from "./components/MovieDetails";
import MovieInterface from "@/app/home/components/Movie.model";
import { movieContext } from "../movieContext";
function page({ params }: { params: { movieId: string } }) {
  const router = useRouter();
  const [movie, setMovie] = useState({} as MovieInterface);
  const [cast, setCast] = useState([]);
  useState<MovieInterface>({});
  return (
    <movieContext.Provider value={{ movie, setMovie }}>
      <MovieDetails movieId={params.movieId} />
    </movieContext.Provider>
  );
}

export default page;
