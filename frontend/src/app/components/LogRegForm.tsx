"use client";
import React from "react";
import { Formik, Form, FormikProps } from "formik";
import * as Yup from "yup";

const LogRegForm = ({
  children,
  validationSchema,
  initialValues,
  submitHandler,
  type,
}: {
  children: React.JSX.Element;
  validationSchema: Yup.ObjectSchema<any>;
  initialValues: Yup.StringSchema<string, Yup.AnyObject, undefined, "">;
  handler: () => void;
  type: string;
}) => {
  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          const email = values.email.toString();
          const password = values.password.toString();
          submitHandler(email, password);
        }}
      >
        {(props: FormikProps<{ email: string; password: string }>) => (
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
                {type}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LogRegForm;
