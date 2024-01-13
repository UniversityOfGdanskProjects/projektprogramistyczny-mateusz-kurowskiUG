import React from "react";

const loginContext = React.createContext({
  loggedIn: false,
  theme: "dark",
  wantToLogin: false,
});
export default loginContext;
