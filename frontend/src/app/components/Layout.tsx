"use client";
import React, { useState } from "react";
import loginContext from "../loginContext";
import NavBar from "./NavBar";
import Footer from "./Footer";
import LoginForm from "./LoginForm";
function Layout({ children }) {
  //   const { loggedIn, theme } = useContext(loginContext);
  const [theme, setTheme] = useState("dark");
  const [loggedIn, setLoggedIn] = useState(false);
  return (
    <loginContext.Provider value={{ loggedIn, theme }}>
      <NavBar />
      {loggedIn ? children : <LoginForm />}
      <Footer />
    </loginContext.Provider>
  );
}

export default Layout;
