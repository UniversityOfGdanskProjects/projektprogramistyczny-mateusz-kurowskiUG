import { SchemaObject } from "neode";
const watchlistSchema: SchemaObject = {
  id: {
    type: "uuid",
    primary: true,
    unique: true,
  },
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
  watchlist: {
    type: "relationship",
    target: "User",
    relationship: "WATCHLIST",
    direction: "in",
    properties: {
      name: "string",
    },
    cascade: "delete",
    eager: true,
  },
};
export default watchlistSchema;
