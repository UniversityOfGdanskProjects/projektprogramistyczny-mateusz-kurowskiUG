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

function MovieDetails({ movieId }: { movieId: string }) {
  const router = useRouter();
  const { movie, setMovie }: { movie: MovieInterface } =
    useContext(movieContext);
  useEffect(() => {
    const loadMovieDetails = async () => {
      const movie = await axios.get(
        `http://localhost:3000/api/movies/${movieId}`
      );
      const data = movie.data.data;
      return data;
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
