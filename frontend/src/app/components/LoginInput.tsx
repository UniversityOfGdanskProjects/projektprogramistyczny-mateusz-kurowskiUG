"use client";
import { useField } from "formik";
import React from "react";

function LoginInput({
  name,
  label,
  placeholder,
  type,
}: {
  name: string;
  label: string;
  placeholder: string;
  type: string;
}) {
  const [field, meta] = useField(name);
  return (
    <>
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">{label}</span>
        </div>
        <input
          {...field}
          placeholder={placeholder}
          type={type ? type : "text"}
          className="input input-bordered w-full max-w-xs"
          autoComplete="off"
        />
        <div className="label">
          <span className="label-text-alt"></span>
          <span className="label-text-alt">
            {meta.touched && meta.error ? (
              <span className="text-red-600">{meta.error}</span>
            ) : null}
          </span>
        </div>
      </label>
    </>
  );
}

export default LoginInput;
