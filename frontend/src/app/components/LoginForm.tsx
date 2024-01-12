"use client";
import React from "react";
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  useField,
  FormikProps,
} from "formik";
import LoginInput from "./LoginInput";
import * as Yup from "yup";

const LoginForm = () => {
  const handleSubmit = () => {};
  const validate = () => {};
  return (
    <div>
      <h1>Any place in your app!</h1>
      <Formik
        initialValues={{ email: "", password: "" }}
        validate={validate}
        onSubmit={handleSubmit}
        validationSchema={Yup.object({
          email: Yup.string()
            .email("This is not an email")
            .min(3)
            .max(15)
            .required(),
          password: Yup.string().min(3).max(15).required(),
        })}
      >
        {(props: FormikProps<any>) => (
          <Form>
            <div className="style flex flex-col items-center">
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
              <button
                disabled={!props.isValid && props.touched && props.dirty}
                className="btn btn-lg btn-primary"
              >
                Responsive
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginForm;
