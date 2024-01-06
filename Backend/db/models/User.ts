import { SchemaObject } from "neode";
const userSchema: SchemaObject = {
  id: {
    type: "string",
    // type: "uuid",
    primary: true,
    unique: true,
  },
  password: {
    type: "string",
    required: true,
  },
  email: {
    type: "string",
    required: true,
    email: true,
    unique: true,
  },
  role: {
    type: "string",
    required: true,
  },
  watchlist: {
    type: "nodes",
    target: "Movie",
    relationship: "WATCHLIST",
    direction: "out",
    properties: {
      date: "date",
    },
    eager: true,
    cascade: "delete",
  },
  playlist: {
    type: "nodes",
    target: "Playlist",
    relationship: "PLAYLIST",
    direction: "out",
    properties: {
      name: "string",
      date: "date",
    },
    eager: true,
    cascade: "delete",
  },
  reviewed: {
    type: "relationships",
    target: "Movie",
    relationship: "REVIEWED",
    direction: "out",
    properties: {
      id: "uuid",
      content: "string",
      rating: "number",
      date: "date",
    },
    eager: true,
    cascade: "detach",
  },
  watched: {
    type: "relationships",
    target: "Movie",
    relationship: "WATCHED",
    direction: "out",
    properties: {
      date: "date",
    },
    eager: true,
    cascade: "detach",
  },
};
export default userSchema;
