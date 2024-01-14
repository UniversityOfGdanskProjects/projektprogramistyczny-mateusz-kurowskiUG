"use client";
import Reactfrom, { useContext } from "react";
import Layout from "./components/LoginLayout";
import loginContext from "./loginContext";
import { useRouter } from "next/navigation";

function page({ children }) {
  const { theme, setTheme, loggedIn } = useContext(loginContext);
  const router = useRouter();
  if (loggedIn) router.push("/home/");
  return <>xyz</>;
}

export default page;
