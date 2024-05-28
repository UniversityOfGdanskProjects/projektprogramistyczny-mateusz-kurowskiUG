// Colorful.jsx

import React from "react";
import variables from "../style.module.scss";

function Colorful() {
  const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  return (
    <div className="flex flex-col w-full text-center">
      {arr.map((i, index) => (
        <div
          className={`h-10 w-full text-center  colorful-${index + 1}`}
          key={i}
        >
          Color
        </div>
      ))}
    </div>
  );
}

export default Colorful;
