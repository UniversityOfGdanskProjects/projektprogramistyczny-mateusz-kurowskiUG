import type React from "react";
import NavBar from "../_components/navbar";
import Footer from "../_components/footer";

const layout = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	return (
		<>
			<NavBar />
			{children}
			<Footer />
		</>
	);
};

export default layout;
