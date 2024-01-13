"use client";
import React from "react";
import { Formik, Form, FormikProps } from "formik";
import LoginInput from "./LoginInput";
import * as Yup from "yup";

const LogRegForm = ({
  children,
  validationSchema,
  initialValues,
  handler,
}: {
  children: React.JSX.Element;
  validationSchema: Yup.ObjectSchema<any>;
  initialValues: Yup.StringSchema<string, Yup.AnyObject, undefined, "">;
  handler: () => void;
}) => {
  const handleSubmit = () => {};
  const validate = () => {};
  return (
    <div>
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {(props: FormikProps<any>) => (
          <Form>
            <div className="style flex flex-col items-center">
              {children}
              <button
                type="submit"
                disabled={!props.isValid && !props.dirty && !props.touched}
                className={`btn btn-lg ${
                  props.isValid ? "btn-primary" : "btn-secondary"
                }`}
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

export default LogRegForm;
