import * as Yup from "yup";
export const reviewInitialValues = {
  content: "",
  rating: 0,
};

export const reviewValidationSchema = Yup.object({
  content: Yup.string()
    .required("Required")
    .min(10, "Your review has to be at least 10 chars long")
    .max(499, "your review is too long"),
  rating: Yup.number().min(0).max(10).required("Required"),
});

export const newPlaylistInitialValues = {
  name: "",
};
export const newPlaylistValidationSchema = Yup.object({
  name: Yup.string().required("Required").min(3).max(20),
});

export type TNewPlaylistFormType = { name: string };
