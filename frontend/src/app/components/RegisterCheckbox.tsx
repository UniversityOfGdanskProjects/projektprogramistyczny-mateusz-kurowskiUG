import { useField } from "formik";
import React from "react";

function RegisterCheckbox({ name, label }) {
  const [field, meta, helpers] = useField(name);
  return (
    <div className="form-control">
      {field.value ? "true" : "false"}
      <label className="label cursor-pointer">
        <span className="label-text">{label}</span>
        <input {...field} type="checkbox" className="checkbox" />
        {meta.touched && meta.error ? (
          <span className="text-red-600">{meta.error}</span>
        ) : (
          "No errors"
        )}
      </label>
    </div>
  );
}

export default RegisterCheckbox;
