"use client";
import React from "react";
import { useSession } from "next-auth/react";
import AuthMenu from "./auth-menu";
import { useRouter } from "next/navigation";

const AuthLayout = () => {
	const { data: session, status } = useSession();
	const router = useRouter();
	if (session) {
		router.push("/home");
	}
	return <AuthMenu />;
};

export default AuthLayout;
