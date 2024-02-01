import React from "react";
import SortSelect from "./SortSelect";
import GenreSelect from "@/app/home/components/GenreSelect";

function FilterAndSortWatchlist() {
  return (
    <div className="collapse bg-base-200">
      <input type="checkbox" />
      <div className="collapse-title text-xl font-medium text-center">
        Filter and Sort
      </div>
      <div className="collapse-content">
        <div className="flex justify-evenly w-full flex-1 text-center">
          <div className="w-full">
            <div className="header">GenreSelect</div>
          </div>
          <div className="border-l-2 w-full">
            <div className="header">Sort</div>
            <SortSelect />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilterAndSortWatchlist;
