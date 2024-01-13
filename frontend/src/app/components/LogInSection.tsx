"use client";
import React, { useContext } from "react";
import loginContext from "../loginContext";

function LogInSection() {
  const { wantToLogin, setWantToLogin } = useContext(loginContext);
  const handleSetLoginForm = () => {
    if (!wantToLogin) setWantToLogin(!wantToLogin);
  };
  const handleSetRegisterForm = () => {
    if (wantToLogin) setWantToLogin(!wantToLogin);
  };
  return (
    <div className="flex gap-2">
      <button
        onClick={handleSetLoginForm}
        className={`btn  ${wantToLogin ? "btn-info" : "btn-accent"}`}
      >
        Login
      </button>
      <button
        onClick={handleSetRegisterForm}
        className={`btn  ${!wantToLogin ? "btn-info" : "btn-accent"}`}
      >
        Register
      </button>
    </div>
  );
}

export default LogInSection;
