import * as Yup from "yup";
export const loginInitialValues = {
  email: "",
  password: "",
};

export const registerInitialValues = {
  email: "",
  password: "",
  passwordConfirmation: "",
  checkbox: true,
};

const passwordRegex = /^[a-z]{3,}$/;

const emailObject = Yup.string()
  .email("Invalid email address")
  .required("Email is required");
const passwordObject = Yup.string()
  .required("Password is required")
  .matches(passwordRegex, "Password must match password regex");
const passwordConfirmationObject = Yup.string().test(
  "passwords-match",
  "Passwords must match",
  function (value) {
    return this.parent.password === value;
  }
);
const checkboxObject = Yup.boolean().isTrue("Must Accept Terms and Conditions");

export const loginSchema = Yup.object({
  email: emailObject,
  password: passwordObject,
});
export const registerSchema = Yup.object({
  email: emailObject,
  password: passwordObject,
  passwordConfirmation: passwordConfirmationObject,
  confirmation: checkboxObject,
});
