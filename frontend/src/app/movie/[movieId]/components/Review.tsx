import React from "react";
import ReviewInterface from "../../../../../interfaces/Review.model";

function Review({ review }: { review: ReviewInterface }) {
  return <div>{review.email}</div>;
}

export default Review;
