"use client";

import React from "react";

function FilterMovies() {
  return (
    <>
      <div className="collapse bg-base-200">
        <input type="checkbox" className="peer" />
        <div className="collapse-title bg-info text-primary-content peer-checked:bg-white peer-checked:text-secondary-content text-center text-3xl">
          Filter
        </div>
        <div className="collapse-content bg-white text-primary-content peer-checked:bg-white peer-checked:text-secondary-content flex flex-col">
          <form action="" className="flex ">
            <div className="field">1</div>
            <div className="field">2</div>
            <div className="field">3</div>
          </form>
          <button className="btn btn-info self-end">Info</button>
        </div>
      </div>
    </>
  );
}

export default FilterMovies;
