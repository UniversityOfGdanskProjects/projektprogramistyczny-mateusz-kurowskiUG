"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

const Page = () => {
	const { data: session, status } = useSession();
	const router = useRouter();
	if (status === "loading") return <p>Loading...</p>;

	if (status === "unauthenticated") router.push("/");

	return (
		<>
			<h1>Protected Page</h1>
			<p>You can view this page because you are signed in.</p>
		</>
	);
};

export default Page;
