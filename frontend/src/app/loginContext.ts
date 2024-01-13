"use client";
import React from "react";

const loginContext = React.createContext({
  loggedIn: false,
  theme: "dark",
  wantToLogin: false,
  setWantToLogin: (wantToLogin: boolean): void => {},
  setLoggedIn: (loggedIn: boolean): void => {},
  handleLogout: (loggedIn: boolean): void => {},
  handleSearch: (search: string): void => {},
});
export default loginContext;
