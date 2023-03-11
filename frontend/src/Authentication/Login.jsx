import React, { useState } from "react";
import LockIcon from "@mui/icons-material/Lock";
import EmailIcon from "@mui/icons-material/Email";
import classes from "./login.module.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Formik, Field } from "formik";
import { useNavigate } from "react-router-dom";
import * as Loader from "react-loader-spinner";
import axios from "axios";
import BaseURL from "../services/BaseURL";
import * as Yup from "yup";
import Header from "../pages/Header";
import Navbar from "../pages/Navbar";
const validationSchema = Yup.object().shape({
  email: Yup.string().required("E-mail is Required!").email("E-mail Invalid"),
  password: Yup.string()
    .required("Password is Required")
    .matches(/(?=[a-zA-Z])/, "A Password Must contain atleast 1 Character")

    .min(5, "Password must be atleast 5 characters"),
});
const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Navbar />
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          setLoading(true);

          axios
            .post(`${BaseURL}/api/auth/teacher/login`, {
              email: values.email,
              password: values.password,
            })
            .then((resp) => {
              localStorage.setItem("Token", resp.data.token);

              localStorage.setItem(
                "Teacher",
                JSON.stringify(resp.data.teacher)
              );
              navigate("/");
              toast.success("Successfully Logged in", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
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
        }}
      >
        {(props) => {
          const { touched, errors, handleSubmit } = props;
          return (
            <div className="">
              <div className="mt-24 ">
                <div className="w-full md:w-96 md:max-w-full mx-auto shadow-lg">
                  <div className="p-6  border-gray-300 sm:rounded-md">
                    <h1 className="text-center font-semibold text-3xl lg:text-4xl text-gray-800 mb-12 mr-20">
                      Login
                    </h1>
                    <form
                      method="POST"
                      action=""
                      onSubmit={(e) => {
                        if (errors !== null) {
                          setLoading(false);
                        } else {
                          setLoading(true);
                        }
                        e.preventDefault();
                        handleSubmit();
                      }}
                    >
                      <label className="block mb-2">
                        <EmailIcon />
                        <span className="text-gray-700 ml-2 font-bold">
                          {" "}
                          Email address
                        </span>
                        <Field
                          name="email"
                          className={classes.inputsignup}
                          type="email"
                          placeholder="Enter Email here"
                        />
                      </label>
                      {touched.email && errors.email ? (
                        <small>{errors.email}</small>
                      ) : null}
                      <label className="block mb-2">
                        <LockIcon />
                        <span className="text-gray-700 ml-2 font-bold">
                          Password
                        </span>
                        <Field
                          name="password"
                          type="password"
                          className={classes.inputsignup}
                          placeholder="Enter Password here"
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
                            "Log in"
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          );
        }}
      </Formik>
    </>
  );
};

export default Login;
