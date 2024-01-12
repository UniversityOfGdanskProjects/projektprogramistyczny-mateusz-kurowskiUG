"use client";
import React, { useContext } from "react";
import loginContext from "../loginContext";

function Footer() {
  const { theme } = useContext(loginContext);
  return (
    <footer
      data-theme={theme}
      className="footer footer-center p-4 bg-base-300 text-base-content"
    >
      <aside>
        <p>
          Made by <strong>Mateusz Kurowski</strong>
        </p>
        <p>
          With the courtasy of <strong>TMDB API</strong>
        </p>
      </aside>
    </footer>
  );
}

export default Footer;
