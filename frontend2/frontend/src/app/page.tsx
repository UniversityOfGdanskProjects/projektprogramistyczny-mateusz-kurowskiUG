"use client";
import { SessionProvider } from "next-auth/react";
import AuthLayout from "./_components/auth-layout";
export default function Home() {
	return (
		<>
			<SessionProvider>
				<AuthLayout />
			</SessionProvider>
		</>
	);
}
