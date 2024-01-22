"use client";
import React, { useEffect, useState } from "react";
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
import { useRouter } from "next/navigation";
function Layout({ children }) {
  const router = useRouter();
  const [theme, setTheme] = useState("dark");
  const [loggedIn, setLoggedIn] = useState(false);
  const [wantToLogin, setWantToLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("loggedIn") === "true") {
      setUser({
        userId: localStorage.getItem("userId"),
        email: localStorage.getItem("email"),
        role: localStorage.getItem("role"),
      });
      setLoggedIn(true);
      console.log(user);
    }
  }, []);

  const handleLogout = () => {
    setLoggedIn(false);
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("loggedIn");
    setUser(null);
    router.push("/");
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
        setLoggedIn,
        user,
        setUser,
        searchTerm,
        setSearchTerm,
        searchResults,
        setSearchResults,
      }}
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
