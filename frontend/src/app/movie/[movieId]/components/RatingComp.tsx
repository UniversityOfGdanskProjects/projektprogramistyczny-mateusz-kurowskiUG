"use client";

import { useField } from "formik";
import React from "react";

function RatingComp({ name }: { name: string }) {
  const [field] = useField(name);

  return (
    <div className="rating rating-lg rating-half">
      <input {...field} type="radio" value={0} className="rating-hidden" />
      <input
        {...field}
        type="radio"
        className="bg-green-500 mask mask-star-2 mask-half-1"
        value={1}
      />
      <input
        {...field}
        type="radio"
        className="bg-green-500 mask mask-star-2 mask-half-2"
        value={2}
      />
      <input
        {...field}
        type="radio"
        className="bg-green-500 mask mask-star-2 mask-half-1"
        value={3}
      />
      <input
        {...field}
        type="radio"
        className="bg-green-500 mask mask-star-2 mask-half-2"
        value={4}
      />
      <input
        {...field}
        type="radio"
        className="bg-green-500 mask mask-star-2 mask-half-1"
        value={5}
      />
      <input
        {...field}
        type="radio"
        className="bg-green-500 mask mask-star-2 mask-half-2"
        value={6}
      />
      <input
        {...field}
        type="radio"
        className="bg-green-500 mask mask-star-2 mask-half-1"
        value={7}
      />
      <input
        {...field}
        type="radio"
        className="bg-green-500 mask mask-star-2 mask-half-2"
        value={8}
      />
      <input
        {...field}
        type="radio"
        className="bg-green-500 mask mask-star-2 mask-half-1"
        value={9}
      />
      <input
        {...field}
        type="radio"
        className="bg-green-500 mask mask-star-2 mask-half-2"
        value={10}
      />
    </div>
  );
}

export default RatingComp;
