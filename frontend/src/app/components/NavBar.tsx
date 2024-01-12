"use client";
import React, { useContext } from "react";
import LogInSection from "./LogInSection";
import Link from "next/link";
import Image from "next/image";
import avatar from "./avatar.jpg";
import loginContext from "../loginContext";
import tmdbLogo from "../../tmdb-logo.svg";
function NavBar() {
  const { theme, loggedIn } = useContext(loginContext);
  const links = ["home", "about", "contact"];
  return (
    <div data-theme={theme} className="navbar justify-between bg-base-100">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">
          <Image src={tmdbLogo} width={100}></Image>
        </a>
      </div>

      <div className="flex-none gap-2">
        {loggedIn ? (
          <div className="form-control">
            <input
              type="text"
              placeholder="Search"
              className="input input-bordered w-24 md:w-auto"
            />
          </div>
        ) : null}

        {!loggedIn ? (
          <LogInSection />
        ) : (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <Image
                  alt="Tailwind CSS Navbar component"
                  src={avatar}
                  width={40}
                  height={40}
                />
              </div>
            </div>

            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </a>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <a>Logout</a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default NavBar;
