import React, { useContext } from "react";
import { profileContext } from "../profileContext";

function SortSelect() {
  const { watchlist, watchlistDispatch } = useContext(profileContext);
  const sortWatchlist = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [field, order] = e.target.value.split(" ");
    console.log(field, order);

    watchlistDispatch({ type: "sort", payload: { field, order } });
  };
  return (
    <select
      onChange={sortWatchlist}
      className=" text-center select select-bordered w-full max-w-xs"
    >
      <option disabled>default</option>
      <option value="title ASC">Title ASC</option>
      <option value="title DESC">Title DESC</option>
      <option value="release_date ASC">Release date ASC</option>
      <option value="release_date DESC">Release date DESC</option>
      <option value="popularity ASC">Rating ASC</option>
      <option value="popularity DESC">Rating DESC</option>
    </select>
  );
}

export default SortSelect;
