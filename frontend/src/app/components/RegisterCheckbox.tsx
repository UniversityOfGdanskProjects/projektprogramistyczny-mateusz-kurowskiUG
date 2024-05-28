"use client";
import { useField } from "formik";
import React from "react";

function FormCheckbox({ name, label }) {
  const [field, meta] = useField(name);
  return (
    <div className="form-control">
      <label className="label cursor-pointer">
        <span
          className={`label-text ${
            meta.touched && meta.error ? "text-red-700" : null
          }`}
        >
          {label}
        </span>
        <input {...field} type="checkbox" className="checkbox" />
      </label>
    </div>
  );
}

export default FormCheckbox;
