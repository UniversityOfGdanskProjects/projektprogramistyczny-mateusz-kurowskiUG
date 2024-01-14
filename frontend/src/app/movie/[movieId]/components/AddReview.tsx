"use client";

import React, { useContext } from "react";
import ReviewForm from "./ReviewForm";
import { movieContext } from "../../movieContext";

function AddReview() {
  const { reviews } = useContext(movieContext);
  const alreadyReviewed = false;
  return (
    <>
      {alreadyReviewed ? (
        <div className="text-red-600 text-center">
          You have already reviewed this movie!
        </div>
      ) : (
        ReviewForm()
      )}
    </>
  );
}
export default AddReview;
