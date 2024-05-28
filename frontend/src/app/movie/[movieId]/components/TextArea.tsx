"use client";

import { useField } from "formik";
import React from "react";

function textArea({ name }: { name: string }) {
  const [field, meta, helpers] = useField(name);

  return (
    <div>
      <textarea
        {...field}
        className="textarea textarea-lg textarea-bordered w-full"
        placeholder="Your review goes here..."
      ></textarea>
    </div>
  );
}

export default textArea;
