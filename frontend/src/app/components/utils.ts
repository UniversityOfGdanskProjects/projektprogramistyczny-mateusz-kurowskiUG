import * as Yup from "yup";
export const loginInitialValues = {
  email: "",
  password: "",
};

export const registerInitialValues = {
  email: "",
  password: "",
  passwordConfirmation: "",
  terms: false,
};

export const passwordRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*[.!@#$%^&+=])(.{6,20})$/;

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
const termsObject = Yup.boolean()
  .oneOf([true], "Must Accept Terms")
  .required("Must Accept Terms");
export const loginSchema = Yup.object({
  email: emailObject,
  password: passwordObject,
});
export const registerSchema = Yup.object({
  email: emailObject,
  password: passwordObject,
  passwordConfirmation: passwordConfirmationObject,
  terms: termsObject,
});

export const handleSearch = (e) => {
  if (e.target.value.length > 3) console.log(e.target.value);
};
