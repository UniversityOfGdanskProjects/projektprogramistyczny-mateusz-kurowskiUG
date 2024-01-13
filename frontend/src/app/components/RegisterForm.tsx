import React from "react";
import LogRegForm from "./LogRegForm";
import LoginInput from "./LoginInput";
import RegisterCheckbox from "./RegisterCheckbox";

function RegisterForm({ validationSchema, initialValues, handler }) {
  return (
    <LogRegForm
      validationSchema={validationSchema}
      initialValues={initialValues}
      handler={handler}
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
      <RegisterCheckbox name="checkbox" label={"I accept the terms."} />
    </LogRegForm>
  );
}

export default RegisterForm;
