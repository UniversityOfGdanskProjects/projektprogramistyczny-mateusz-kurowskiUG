"use client";

import React, { useContext, useEffect } from "react";
import { movieContext } from "../../movieContext";
import MovieInterface from "../../../../../interfaces/Movie.model";
import axios from "axios";
import Review from "./Review";
import ReviewInterface from "../../../../../interfaces/Review.model";
import loginContext from "@/app/loginContext";

function Reviews() {
  const { movieId, movie, reviews, setReviews, setReviewed, reviewed } =
    useContext(movieContext);
  const userId = localStorage.getItem("userId");
  useEffect(() => {
    const loadReviews = async () => {
      try {
        const reviewsRequst = await axios.get(
          `http://localhost:3000/api/movies/${movieId}/reviews`
        );
        if (reviewsRequst.status !== 200) {
          return [];
        } else {
          return reviewsRequst.data.data;
        }
      } catch (e) {
        console.log(e);
        return [];
      }
    };
    loadReviews()
      .then((reviewsResponse: ReviewInterface[]) => {
        setReviews(reviewsResponse);
        console.log(reviewsResponse);

        const userReview = reviewsResponse.find(
          (review) => review.userId === userId
        );
        if (userReview) {
          setReviewed(true);
        }
        console.log("reviewed:", reviewed);
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
              <Review key={crypto.randomUUID()} review={review} />
            ))
          : "no reviews"}
      </div>
    </div>
  );
}

export default Reviews;
