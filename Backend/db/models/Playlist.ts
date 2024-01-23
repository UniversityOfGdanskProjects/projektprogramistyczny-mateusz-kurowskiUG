import { SchemaObject } from "neode";
const playlistSchema: SchemaObject = {
  id: {
    type: "string",
    // type: "uuid",
    unique: true,
    primary: true,
  },
  name: { type: "string", required: true },
  date: { type: "datetime", required: true },
  checksum: { type: "string", required: false },
  has: {
    type: "nodes",
    target: "Movie",
    relationship: "HAS",
    direction: "out",
    properties: {
      date: "datetime",
    },
    eager: true,
    cascade: "detach",
  },
  playlist: {
    type: "node",
    target: "User",
    relationship: "PLAYLIST",
    direction: "in",
    properties: {
      date: "datetime",
    },
    cascade: "detach",
    eager: true,
  },
};
export default playlistSchema;
