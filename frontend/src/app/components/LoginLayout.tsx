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
import UserInterface from "../../../interfaces/User.model";
import MovieInterface from "../../../interfaces/Movie.model";
function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [theme] = useState<string>("dark");
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [wantToLogin, setWantToLogin] = useState<boolean>(false);
  const [user, setUser] = useState<UserInterface>({} as UserInterface);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<MovieInterface[]>([]);

  useEffect(() => {
    if (
      localStorage.getItem("loggedIn") === "true" &&
      !loggedIn &&
      !user.userId
    ) {
      const userId = localStorage.getItem("userId");
      const email = localStorage.getItem("email");
      const role = localStorage.getItem("role");
      setUser({
        userId,
        email,
        role,
      });
      setLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    setLoggedIn(false);
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("loggedIn");
    setUser({} as UserInterface);
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
      {loggedIn && user && user.userId ? (
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
