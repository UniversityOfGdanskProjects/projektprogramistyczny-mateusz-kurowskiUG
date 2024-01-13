"use client";
import Reactfrom, { useContext } from "react";
import Layout from "./components/LoginLayout";
import loginContext from "./loginContext";
import { useRouter } from "next/router";

function page({ children }) {
  const router = useRouter();

  const { theme, setTheme } = useContext(loginContext);
  return <>xyz</>;
}

export default page;
