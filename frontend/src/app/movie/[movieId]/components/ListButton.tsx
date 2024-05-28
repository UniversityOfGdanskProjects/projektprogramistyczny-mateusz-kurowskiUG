import React from "react";
import heartSvg from "/public/heart.svg";
import Image from "next/image";

function ListButton({
  color,
  text,
  fullHeart,
  onClick,
}: {
  color: string;
  text: string;
  fullHeart: boolean;
  onClick: () => void;
}) {
  return (
    <button className={`btn ${color}`} onClick={onClick}>
      {fullHeart ? (
        <Image alt="dyed heart" src={heartSvg} width={25} height={25} />
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      )}
      {text}
    </button>
  );
}

export default ListButton;
