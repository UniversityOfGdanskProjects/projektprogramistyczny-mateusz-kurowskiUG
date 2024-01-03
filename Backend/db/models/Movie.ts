import { SchemaObject } from "neode";
const movieSchema: SchemaObject = {
  id: {
    type: "uuid",
    primary: true,
    unique: true,
  },
  title: {
    type: "string",
    required: true,
  },
  // overview: {
  //   type: "string",

  // },
  popularity: {
    type: "number",
    required: true,
  },
  release_date: {
    type: "string",
    required: true,
  },
  poster_path: {
    type: "string",
  },

  adult: {
    type: "boolean",
    required: true,
  },
  backdrop_path: {
    type: "string",
  },
  budget: {
    type: "number",
    required: true,
  },
  status: {
    type: "string",
    required: true,
  },
  has: {
    type: "relationship",
    target: "Watchlist",
    relationship: "HAS",
    direction: "in",
    properties: {
      name: "string",
    },
    cascade: "detach",
    eager: true,
  },
  reviewed: {
    type: "relationships",
    target: "User",
    relationship: "REVIEWED",
    direction: "in",
    properties: {
      name: "string",

    },
    cascade: "detach",
    eager: true,
  },
};
export default movieSchema;
