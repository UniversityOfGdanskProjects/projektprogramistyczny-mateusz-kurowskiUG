"use client";
import React, { useContext } from "react";
import loginContext from "./loginContext";
import { useRouter } from "next/navigation";

function Page() {
  const { loggedIn } = useContext(loginContext);
  const router = useRouter();
  if (loggedIn) router.push("/home/");
  return <>xyz</>;
}

export default Page;
