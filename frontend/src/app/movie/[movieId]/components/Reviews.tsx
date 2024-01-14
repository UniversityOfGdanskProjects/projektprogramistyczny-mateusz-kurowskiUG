import React, { useContext, useEffect } from "react";
import { movieContext } from "../../movieContext";
import MovieInterface from "../../../../../interfaces/Movie.model";
import axios from "axios";
import Review from "./Review";
import ReviewInterface from "../../../../../interfaces/Review.model";

function Reviews() {
  const {
    movieId,
    movie,
    reviews,
    setReviews,
  }: { movieId: number; movie: MovieInterface } = useContext(movieContext);
  useEffect(() => {
    const loadReviews = async () => {
      const reviewsRequst = await axios.get(
        `http://localhost:3000/api/movies/${movieId}/reviews`
      );
      return reviewsRequst.data.data;
    };
    loadReviews()
      .then((res) => {
        console.log(res);

        setReviews(res);
      })
      .catch((err) => {
        console.log(err);

        setReviews([]);
      });
  }, []);
  return (
    <div className="reviews">
      {movie.id}
      <div className="reviews-title text-center text-2xl">Reviews</div>
      <div className="reviews-content text-center">
        {reviews.length
          ? reviews.map((review: ReviewInterface) => (
              <Review key={review.id} review={review} />
            ))
          : "no reviews"}
      </div>
    </div>
  );
}

export default Reviews;
