"use client";

import { Formik, Form, FormikProps } from "formik";
import React, { useContext } from "react";
import { reviewInitialValues, reviewValidationSchema } from "./ReviewUtils";
import TextArea from "./TextArea";
import RatingComp from "./RatingComp";
import { movieContext } from "../../movieContext";
import axios from "axios";
import loginContext from "@/app/loginContext";
import ReviewInterface from "../../../../../interfaces/Review.model";

function ReviewForm() {
  const { reviews, setReviews, movie, setReviewed } = useContext(movieContext);
  const { user } = useContext(loginContext);
  //   const alreadyReviewed = reviews.find((review) => review.user.id === user.id);
  const addReview = async ({
    content,
    rating,
  }: {
    content: string;
    rating: number;
  }) => {
    try {
      if (!movie) throw Error("No movie found");
      if (!user) throw Error("No user found");
      console.log(movie.id);

      const url: string = `http://localhost:3000/api/movies/${movie.id}/reviews`;
      const newReview = {
        content,
        rating,
        userId: user.userId,
      };
      const addResponse = await axios.post(url, newReview);
      if (addResponse.status === 200) {
        const addedReview = addResponse.data.data;
        console.log(addedReview);

        setReviews([...reviews, addedReview]);
        setReviewed(true);
      }
    } catch (e) {
      console.log(e);

      alert("could not add review");
    }

    return;
  };

  return (
    <>
      <Formik
        initialValues={reviewInitialValues}
        validationSchema={reviewValidationSchema}
        onSubmit={addReview}
      >
        {(form: FormikProps<{ content: string; rating: number }>) => (
          <Form>
            <div className="text-center flex flex-col py-5 px-2 text-xl">
              Add a Review
              <div className="textArea py-2">
                <TextArea name="content" />
                {form.errors && form.errors.content
                  ? form.errors.content
                  : null}
              </div>
              <div className="rating py-2 self-end">
                <RatingComp name="rating" />
                {form.errors && form.errors.rating ? form.errors.rating : null}
              </div>
              <button
                disabled={!form.isValid && !form.dirty && !form.touched}
                type="submit"
                className="btn btn-warning"
              >
                Rate
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default ReviewForm;
