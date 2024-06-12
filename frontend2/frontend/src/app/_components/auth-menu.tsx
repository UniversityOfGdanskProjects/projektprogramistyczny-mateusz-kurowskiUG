"use client";
import React, { useState } from "react";
import NavBar from "./navbar";
import Footer from "./footer";
import RegisterForm from "./register-form";
import KeycloakLoginButton from "./keycloak-login";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AuthMenu = () => {
	return (
		<>
			<NavBar />
			<Tabs defaultValue="signup" className="w-full">
				<TabsList className="w-full justify-evenly">
					<TabsTrigger value="signup">Sign up</TabsTrigger>
					<TabsTrigger value="signin">Sign in</TabsTrigger>
				</TabsList>
				<TabsContent value="signup">
					<p className="text-center">Create a new account.</p>
					<div className="my-2 p-2">
						<RegisterForm />
					</div>
				</TabsContent>
				<TabsContent value="signin">
					<p className="text-center">Sign in using one of providers below:</p>
					<div className="m-6 p-2 ">
						<KeycloakLoginButton />
					</div>
				</TabsContent>
			</Tabs>
			<Footer />
		</>
	);
};

export default AuthMenu;
