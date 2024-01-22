"use client";

import loginContext from "@/app/loginContext";
import React, { useContext } from "react";
import MovieInterface from "../../../../interfaces/Movie.model";
import PopularMovie from "./PopularMovie";

function InnerNavBar() {
  const { searchResults } = useContext(loginContext);
  return (
    <>
      {searchResults ? (
        <>
          <div className="w-full">
            <div className="flex flex-1 overflow-x-auto">
              {searchResults.map((result: MovieInterface) => (
                <PopularMovie
                  height="10"
                  width="10"
                  popular={false}
                  key={crypto.randomUUID()}
                  movie={result}
                />
              ))}
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}

export default InnerNavBar;
