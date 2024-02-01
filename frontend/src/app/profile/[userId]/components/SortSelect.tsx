import React from "react";

function SortSelect() {
  return (
    <select className=" text-center select select-bordered w-full max-w-xs">
      <option selected>default</option>
      <option value="title">Title ASC</option>
      <option value="title">Title DESC</option>
      <option value="release">Release date ASC</option>
      <option value="release">Release date DESC</option>
      <option value="rating">Rating ASC</option>
      <option value="rating">Rating DESC</option>
    </select>
  );
}

export default SortSelect;
