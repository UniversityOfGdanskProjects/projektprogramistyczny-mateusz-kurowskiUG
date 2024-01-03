import { SchemaObject } from "neode";
const userSchema: SchemaObject = {
  id: {
    type: "uuid",
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
  watchlist: {
    type: "relationship",
    target: "Watchlist",
    relationship: "WATCHLIST",
    direction: "out",
    properties: {
      name: "string",
    },
    cascade: "delete",
    eager: true,
    
  },
};
export default userSchema;
