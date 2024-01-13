import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect } from "react";
import { movieContext } from "../../movieContext";
import Image from "next/image";
import MovieInterface from "@/app/home/components/Movie.model";
import Cast from "./Cast";
import Reviews from "./Reviews";
import AddReview from "./AddReview";
import plus18 from "/public/images/plus18.png";
function MovieDetails({ movieId }: { movieId: string }) {
  const router = useRouter();
  const { movie, setMovie }: { movie: MovieInterface } =
    useContext(movieContext);
  useEffect(() => {
    const loadMovieDetails = async () => {
      const movie = await axios.get(
        `http://localhost:3000/api/tmdb/movies/${movieId}`
      );
      const data = movie.data.data;
      return data;
    };
    loadMovieDetails().then((res) => {
      setMovie(res);
    });
    // .catch(() => {
    //   router.push("/404");
    // });
  }, [movieId]);

  return (
    <>
      <div
        className={
          "my-5 movie-background w-full h-96 bg-cover  bg-no-repeat relative"
        }
        style={{
          backgroundImage: `url(${movie.backdrop_path})`,
        }}
      >
        <div className="movie absolute bottom-0 left-10 hover:opacity-0 transition ease-in-out duration-500">
          <Image
            src={movie.poster_path}
            width={200}
            height={200}
            alt={movie.title}
            className="before:content-['esaasssssssss']  "
          />
          {movie.adult ? (
            <div className="fa18 absolute top-0 right-0">
              <Image src={plus18} width={50} height={50} alt="18+"></Image>
            </div>
          ) : null}
        </div>
      </div>
      <div className="movie-details flex flex-col">
        <div className="important flex flex-row">
          <div className="movie-title text-5xl">{movie.title}</div>
          <div>{movie.release_date}</div>
        </div>
        <div className="movie-overview">{movie.overview}</div>
      </div>
      <Cast />
      <Reviews />
      <AddReview />
    </>
  );
}

export default MovieDetails;
