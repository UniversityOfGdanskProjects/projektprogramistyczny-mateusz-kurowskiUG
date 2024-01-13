"use client";
import React from "react";
import LogRegForm from "./LogRegForm";
import LoginInput from "./LoginInput";
import FormCheckbox from "./RegisterCheckbox";

function RegisterForm({ validationSchema, initialValues, submitHandler }) {
  return (
    <LogRegForm
      validationSchema={validationSchema}
      initialValues={initialValues}
      submitHandler={submitHandler}
    >
      <LoginInput name="email" label="Email" placeholder="Email" type="email" />
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
    </LogRegForm>
  );
}

export default RegisterForm;
