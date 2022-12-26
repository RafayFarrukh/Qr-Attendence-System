import React from "react";
import { MdEmail } from "react-icons/md";
import classes from "./login.module.css";
import { useFormik } from "formik";
import * as yup from "yup";
import { RiLockPasswordFill } from "react-icons/ri";
const Login = () => {
  const { handleSubmit, getFieldProps, touched, errors } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object({
      email: yup
        .string()
        .required("E-mail is Required!")
        .email("E-mail Invalid"),
      password: yup
        .string()
        .required("Password is Required")
        .matches(/(?=[a-zA-Z])/, "A Password Must contain atleast 1 Character")

        .min(5, "Password must be atleast 5 characters"),
    }),
    onSubmit: (values) => {
      console.log({
        email: values.email,
        password: values.password,
      });
    },
  });
  return (
    <>
      <div className="">
        <div className="mt-24 ">
          <div className="w-full md:w-96 md:max-w-full mx-auto shadow-lg">
            <div className="p-6  border-gray-300 sm:rounded-md">
              <h1 className="text-center font-semibold text-3xl lg:text-4xl text-gray-800 mb-12 mr-20">
                Login
              </h1>
              <form action="submit" onSubmit={handleSubmit}>
                <label className="block mb-2">
                  <span className="text-gray-800  ml-2 mt-8 font-bold flex items-center gap-x-3">
                    <MdEmail />
                    Email address
                  </span>
                  <input
                    name="email"
                    {...getFieldProps("email")}
                    type="email"
                    className={classes.inputsignup}
                    placeholder="Email"
                    required
                  />
                </label>
                {touched.email && errors.email ? (
                  <small>{errors.email}</small>
                ) : null}
                <label className="block mb-2">
                  <span className="text-gray-800  ml-2 mt-8 font-bold flex items-center gap-x-3">
                    <RiLockPasswordFill />
                    Password
                  </span>
                  <input
                    name="password"
                    type="password"
                    {...getFieldProps("password")}
                    className={classes.inputsignup}
                    minLength="5"
                    placeholder="Password"
                    required
                  />
                </label>
                {touched.password && errors.password ? (
                  <small>{errors.password}</small>
                ) : null}
                <div className="mb-6">
                  <button
                    type="submit"
                    className="
            h-10
            px-5
            text-indigo-100
            bg-sky-600
            rounded-lg
            transition-colors
            duration-150
            focus:shadow-outline
            hover:bg-sky-300
            text-black
          "
                  >
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
