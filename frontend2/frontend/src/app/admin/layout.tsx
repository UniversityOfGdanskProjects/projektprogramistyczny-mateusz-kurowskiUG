import Footer from "../_components/footer";
import AdminNavBar from "./components/admin-navbar.tsx";

const Layout = ({ children }: { children: Readonly<React.ReactNode> }) => {
	return (
		<>
			<AdminNavBar />
			{children}
			<Footer />
		</>
	);
};

export default Layout;
