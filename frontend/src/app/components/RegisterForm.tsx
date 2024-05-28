"use client";
import React, { useContext } from "react";
import LogRegForm from "./LogRegForm";
import LoginInput from "./LoginInput";
import FormCheckbox from "./RegisterCheckbox";
import axios from "axios";
import loginContext from "../loginContext";

function RegisterForm({ validationSchema, initialValues }) {
  const { setWantToLogin } = useContext(loginContext);
  const handleRegister = async (email: string, password: string) => {
    if (!email || !password) return alert("Please fill in all fields");
    try {
      const registerResponse = await axios.post(
        "http://localhost:3000/api/users/register",
        {
          email,
          password,
        }
      );
      if (registerResponse.status === 200) {
        setWantToLogin(true);
        return;
      }
      return;
    } catch (e) {
      alert("Account exists. Please login.");
      return;
    }
  };
  return (
    <LogRegForm
      validationSchema={validationSchema}
      initialValues={initialValues}
      submitHandler={handleRegister}
      type={"Register"}
    >
      <>
        <LoginInput
          name="email"
          label="Email"
          placeholder="Email"
          type="email"
        />
        <LoginInput
          name="password"
          label="Password"
          placeholder="Password"
          type="password"
        />
        <LoginInput
          name="passwordConfirmation"
          label="Confirm Password"
          placeholder="Password"
          type="password"
        />
        <FormCheckbox name={"terms"} label={"I accept the terms."} />
      </>
    </LogRegForm>
  );
}

export default RegisterForm;
