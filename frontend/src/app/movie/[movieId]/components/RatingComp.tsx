import React from "react";

function RatingComp() {
  return (
    <div>
      <div className="rating rating-lg rating-half">
        <input type="radio" name="rating-10" className="rating-hidden" />
        <input
          type="radio"
          name="rating-10"
          className="bg-green-500 mask mask-star-2 mask-half-1"
          value={1}
        />
        <input
          type="radio"
          name="rating-10"
          className="bg-green-500 mask mask-star-2 mask-half-2"
          value={2}
        />
        <input
          type="radio"
          name="rating-10"
          className="bg-green-500 mask mask-star-2 mask-half-1"
          value={3}
        />
        <input
          type="radio"
          name="rating-10"
          className="bg-green-500 mask mask-star-2 mask-half-2"
          value={4}
        />
        <input
          type="radio"
          name="rating-10"
          className="bg-green-500 mask mask-star-2 mask-half-1"
          value={5}
        />
        <input
          type="radio"
          name="rating-10"
          className="bg-green-500 mask mask-star-2 mask-half-2"
          value={6}
        />
        <input
          type="radio"
          name="rating-10"
          className="bg-green-500 mask mask-star-2 mask-half-1"
          value={7}
        />
        <input
          type="radio"
          name="rating-10"
          className="bg-green-500 mask mask-star-2 mask-half-2"
          value={8}
        />
        <input
          type="radio"
          name="rating-10"
          className="bg-green-500 mask mask-star-2 mask-half-1"
          value={9}
        />
        <input
          type="radio"
          name="rating-10"
          className="bg-green-500 mask mask-star-2 mask-half-2"
          value={10}
        />
      </div>
    </div>
  );
}

export default RatingComp;
