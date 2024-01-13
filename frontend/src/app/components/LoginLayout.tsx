"use client";
import React, { useState } from "react";
import loginContext from "../loginContext";
import NavBar from "./NavBar";
import Footer from "./Footer";
import LoginForm from "./LoginForm";
import {
  handleSearch,
  loginInitialValues,
  loginSchema,
  registerInitialValues,
  registerSchema,
} from "./utils";
import RegisterForm from "./RegisterForm";
function Layout({ children }) {
  const [theme, setTheme] = useState("dark");
  const [loggedIn, setLoggedIn] = useState(true);
  const [wantToLogin, setWantToLogin] = useState(false);
  const handleLogin = () => {
    setLoggedIn(true);
  };
  const handleRegister = () => {
    setLoggedIn(true);
  };
  const handleLogout = () => {
    setLoggedIn(false);
  };
  return (
    <loginContext.Provider
      value={{
        loggedIn,
        theme,
        wantToLogin,
        setWantToLogin,
        handleLogout,
        handleSearch,
      }}
    >
      <NavBar />
      {loggedIn ? (
        children
      ) : wantToLogin ? (
        <LoginForm
          initialValues={loginInitialValues}
          validationSchema={loginSchema}
          submitHandler={handleLogin}
        />
      ) : (
        <RegisterForm
          initialValues={registerInitialValues}
          validationSchema={registerSchema}
          submitHandler={handleRegister}
        />
      )}
      <Footer />
    </loginContext.Provider>
  );
}

export default Layout;
