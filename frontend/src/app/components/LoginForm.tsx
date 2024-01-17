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
  validationSchema: Yup.ObjectSchema<any, Yup.AnyObject, any, "">;
  initialValues: Yup.StringSchema<string, Yup.AnyObject, undefined, "">;
}) {
  const { setUser, setLoggedIn } = useContext(loginContext);
  const error = "";
  const loginHandler = async (email, password) => {
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
        setUser(response.data.data);
        localStorage.setItem("userId", response.data.data.id);
        localStorage.setItem("email", response.data.data.email);
        localStorage.setItem("role", response.data.data.role);
        localStorage.setItem("loggedIn", "true");
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
