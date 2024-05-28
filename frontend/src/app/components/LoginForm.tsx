"use client";
import React, { useContext } from "react";
import LogRegForm from "./LogRegForm";
import LoginInput from "./LoginInput";
import * as Yup from "yup";
import axios from "axios";
import loginContext from "../loginContext";

function LoginForm({
  validationSchema,
  initialValues,
}: {
  validationSchema: Yup.ObjectSchema<Yup.AnyObject, "">;
  initialValues: Yup.StringSchema<string, Yup.AnyObject, undefined, "">;
}) {
  const { setUser, setLoggedIn } = useContext(loginContext);
  const loginHandler = async (email: string, password: string) => {
    if (!email || !password) return alert("Please fill in all fields");
    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/login",
        {
          email,
          password,
        }
      );
      if (response.status === 200) {
        setLoggedIn(true);
        const { id, email, role } = response.data.data;

        setUser({ userId: id, email, role });
        localStorage.setItem("userId", id);
        localStorage.setItem("email", email);
        localStorage.setItem("role", role);
        localStorage.setItem("loggedIn", "true");
      } else {
        alert("Wrong creds");
      }
    } catch (error) {
      alert("Wrong creds");
    }
  };
  return (
    <LogRegForm
      validationSchema={validationSchema}
      initialValues={initialValues}
      submitHandler={loginHandler}
      type={"Login"}
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
      </>
    </LogRegForm>
  );
}

export default LoginForm;
