"use client";
import axios from "axios";
import React, { useContext, useLayoutEffect } from "react";
import { movieContext } from "../../movieContext";
import CastInterface from "../../../../../interfaces/Cast.model";
import CrewMember from "./CrewMember";

function Cast() {
  const { cast, setCast, movieId } = useContext(movieContext);
  useLayoutEffect(() => {
    const loadCast = async (): Promise<CastInterface[]> => {
      try {
        if (!movieId) return [];
        const cast = await axios.get(
          `http://localhost:3000/api/cast/${movieId}`
        );
        if (cast.status === 200) {
          return cast.data.cast;
        } else {
          return [];
        }
      } catch (e) {
        return [];
      }
    };
    loadCast()
      .then((res) => {
        setCast(res);
      })
      .catch(() => {
        setCast([]);
      });
  }, []);
  return (
    <div className="carousel py-5 px-2 flex gap-6 overflow-scroll w-full">
      {!cast || cast.length === 0
        ? null
        : cast.map((member: CastInterface) => (
            <CrewMember key={member.id} member={member} />
          ))}
    </div>
  );
}

export default Cast;
