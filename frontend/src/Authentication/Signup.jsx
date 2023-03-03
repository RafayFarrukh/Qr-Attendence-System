import React, { useState } from "react";
import { MdEmail } from "react-icons/md";
import classes from "./login.module.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Loader from "react-loader-spinner";
import axios from "axios";
import * as yup from "yup";
import { RiLockPasswordFill } from "react-icons/ri";
const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { handleSubmit, getFieldProps, touched, errors } = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
    },
    validationSchema: yup.object({
      fullName: yup.string().required("E-mail is Required!"),
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
      setLoading(true);
      axios
        .post("/api/auth/teacher/register", {
          fullName: values.fullName,
          email: values.email,
          password: values.password,
        })
        .then((resp) => {
          navigate("/login");
          console.log(resp);
          if (resp.data.success == false) {
            console.log(resp.data.message);
          }
          toast.success("Successfully Signedup", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1500,
          });
        })
        .catch((res) => {
          console.log(res);
          if (res.response.data.success == false) {
            toast.error(res.response.data.error, {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 2000,
            });
          }
        })
        .finally(() => {
          setLoading(false);
        });
      // console.log({
      //   email: values.email,
      //   password: values.password,
      // });
    },
  });
  return (
    <>
      <div className="">
        <div className="mt-24 ">
          <div className="w-full md:w-96 md:max-w-full mx-auto shadow-lg">
            <div className="p-6  border-gray-300 sm:rounded-md">
              <h1 className="text-center font-semibold text-3xl lg:text-4xl text-gray-800 mb-12 mr-20">
                SignUp
              </h1>
              <form action="submit" onSubmit={handleSubmit}>
                <label className="block mb-2">
                  <span className="text-gray-800  ml-2 mt-8 font-bold flex items-center gap-x-3">
                    <MdEmail />
                    FullName
                  </span>
                  <input
                    name="fullName"
                    {...getFieldProps("fullName")}
                    type="text"
                    className={classes.inputsignup}
                    placeholder="name"
                    required
                  />
                </label>
                {touched.fullName && errors.fullName ? (
                  <small>{errors.fullName}</small>
                ) : null}
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
                    {loading ? (
                      <Loader.TailSpin
                        type="ThreeDots"
                        color="#fff"
                        height={25}
                        width={30}
                      />
                    ) : (
                      "Sign Up"
                    )}
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
