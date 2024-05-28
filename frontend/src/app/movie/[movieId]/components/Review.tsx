"use client";

import React from "react";
import ReviewInterface from "../../../../../interfaces/Review.model";

function Review({ review }: { review: ReviewInterface }) {
  return (
    <>
      <div className="review flex bg-gray-700 rounded-md justify-between px-2">
        <div className="date-email">
          <div className="review-author">{review.email}</div>
          <div className="date">{review.date}</div>
        </div>
        <div className="content-rate">
          <div className="review-content">{review.content}</div>

          <div>{review.rating}</div>
        </div>
      </div>
    </>
  );
}

export default Review;
