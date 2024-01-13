"use client";
import React, { useState } from "react";
import loginContext from "../loginContext";
import NavBar from "./NavBar";
import Footer from "./Footer";
import LoginForm from "./LoginForm";
import LogRegForm from "./LogRegForm";
import LoginInput from "./LoginInput";
import {
  loginInitialValues,
  loginSchema,
  registerInitialValues,
  registerSchema,
} from "./utils";
import RegisterForm from "./RegisterForm";
function Layout({ children }) {
  //   const { loggedIn, theme } = useContext(loginContext);
  const [theme, setTheme] = useState("dark");
  const [loggedIn, setLoggedIn] = useState(false);
  const [wantToLogin, setWantToLogin] = useState(false);
  return (
    <loginContext.Provider
      value={{ loggedIn, theme, wantToLogin, setWantToLogin }}
    >
      <NavBar />
      {loggedIn ? (
        children
      ) : wantToLogin ? (
        <LoginForm
          initialValues={loginInitialValues}
          validationSchema={loginSchema}
        />
      ) : (
        <RegisterForm
          initialValues={registerInitialValues}
          validationSchema={registerSchema}
        />
      )}
      <Footer />
    </loginContext.Provider>
  );
}

export default Layout;
