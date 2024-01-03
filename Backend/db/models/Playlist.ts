import { SchemaObject } from "neode";
const playlistSchema: SchemaObject = {
  id: {
    type: "uuid",
    primary: true,
    unique: true,
  },
  name: { type: "string", required: true },
  date: { type: "date", required: true },
  has: {
    type: "relationships",
    target: "Movie",
    relationship: "HAS",
    direction: "out",
    properties: {
      date: "date",
    },
    eager: true,
    cascade: "delete",
  },
  playlist: {
    type: "relationships",
    target: "User",
    relationship: "PLAYLIST",
    direction: "in",
    properties: {
      date: "date",
    },
    cascade: "delete",
    eager: true,
  },
};
export default playlistSchema;
