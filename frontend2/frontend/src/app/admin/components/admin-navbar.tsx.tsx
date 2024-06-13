import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";
import React from "react";

const AdminNavBar = () => {
	return (
		<div className="flex p-2 justify-between">
			<div className="left flex gap-2">
				<div className="logo text-2xl">
					<Link href="/admin">Admin</Link>
				</div>
				<div className="sections">
					<ul className="flex gap-2">
						<Link href="/admin/users">
							<li>Users</li>
						</Link>
						<Link href="/admin/movies">
							<li>Movies</li>
						</Link>
					</ul>
				</div>
			</div>
			<div className="right flex gap-2">
				<ModeToggle />
				<div>LogoutButton</div>
			</div>
		</div>
	);
};

export default AdminNavBar;
