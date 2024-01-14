"use client";

import { Formik } from "formik";
import React, { useContext } from "react";
import { reviewInitialValues, reviewValidationSchema } from "./ReviewUtils";
import TextArea from "./TextArea";
import RatingComp from "./RatingComp";
import { movieContext } from "../../movieContext";

function ReviewForm() {
  const { reviews } = useContext(movieContext);
  //   const alreadyReviewed = reviews.find((review) => review.user.id === user.id);
  const alreadyReviewed = true;
  const handleSubmit = () => {};
  return (
    <>
      <Formik
        initialValues={reviewInitialValues}
        validationSchema={reviewValidationSchema}
        onSubmit={handleSubmit}
      >
        {(form) => (
          <div className="text-center flex flex-col py-5 px-2 text-xl">
            Add a Review
            <div className="textArea py-2">
              <TextArea />
              {form.errors && form.errors.description
                ? form.errors.description
                : null}
            </div>
            <div className="rating py-2 self-end">
              <RatingComp />
              {form.errors && form.errors.rating ? form.errors.rating : null}
            </div>
            <button type="submit" className="btn btn-warning">
              Rate
            </button>
          </div>
        )}
      </Formik>
    </>
  );
}

export default ReviewForm;
