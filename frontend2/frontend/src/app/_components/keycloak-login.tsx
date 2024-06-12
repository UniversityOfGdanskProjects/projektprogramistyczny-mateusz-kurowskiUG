import { Button } from "@/components/ui/button";
import React from "react";
import Login from "./login";
import Image from "next/image";
import keycloakLogo from "../../../static/keycloak-logo.svg";
const KeycloakLoginButton = () => {
	return (
		<div className="flex justify-center">
			<Button className="flex justify-evenly">
				<Image src={keycloakLogo} width={25} height={25} />
				<Login />
			</Button>
		</div>
	);
};

export default KeycloakLoginButton;
