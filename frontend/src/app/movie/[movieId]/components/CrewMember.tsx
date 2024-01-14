import React from "react";
import { CastInterface } from "../../../../../interfaces/Cast.model";
import Image from "next/image";

function CrewMember({ member }: { member: CastInterface }) {
  return (
    <div className="flex flex-col w-28">
      <div className="card-compact bg-base-100 shadow-xl ">
        <figure>
          <Image
            src={`https://image.tmdb.org/t/p/w500${member.profile_path}`}
            width={500}
            height={500}
            placeholder="blur"
            blurDataURL="public/images/no_image.jpg"
            alt="no picture"
            className="rounded-xl"
          />
        </figure>
      </div>
      <div className="card-body items-center text-center">
        <p className="card-title">{member.name}</p>
        <p className="text-sm">{member.character}</p>
      </div>
    </div>
  );
}

export default CrewMember;
