import React, { useState } from 'react';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import { Formik, Field } from 'formik';
import classes from './login.module.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import * as Loader from 'react-loader-spinner';
import axios from 'axios';
import * as Yup from 'yup';
import BaseURL from '../services/BaseURL';
import Navbar from '../pages/Navbar';
const validationSchema = Yup.object().shape({
  fullName: Yup.string()
    .required('Username is Required')
    .min(5, 'Username must be more then 5 characters'),
  email: Yup.string().required('E-mail is Required!').email('E-mail Invalid'),
  password: Yup.string()
    .required('Password is Required')
    .matches(/(?=[a-zA-Z])/, 'A Password Must contain atleast 1 Character')

    .min(5, 'Password must be atleast 5 characters'),
});
const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Navbar />
      <Formik
        initialValues={{
          fullName: '',
          email: '',
          password: '',
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          setLoading(true);
          console.log({
            fullName: values.fullName,
            email: values.email,
            password: values.password,
          });
          axios
            .post(`${BaseURL}/api/auth/teacher/register`, {
              fullName: values.fullName,
              email: values.email,
              password: values.password,
            })
            .then((resp) => {
              toast.success('Successfully SignedUp', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
              });
              navigate('/login');
            })
            .catch((res) => {
              if (res.response.data.success === false) {
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
            <div className=''>
              <div className='mt-24'>
                <div className='w-full md:w-96 md:max-w-full mx-auto shadow-lg'>
                  <div className='p-6 border-gray-300 sm:rounded-md'>
                    <h1 className='text-center font-semibold text-3xl lg:text-4xl text-gray-800 mb-12'>
                      Signup
                    </h1>
                    <form method='POST' action='' onSubmit={handleSubmit}>
                      <label className='block mb-3'>
                        <PersonIcon className='h-6 w-6 text-gray-700' />
                        <span className='ml-2 mt-10 font-bold'>User Name</span>
                        <Field
                          name='fullName'
                          type='text'
                          className={classes.inputsignup}
                          placeholder='Enter Name Here'
                        />
                      </label>
                      {touched.fullName && errors.fullName ? (
                        <small>{errors.fullName}</small>
                      ) : null}
                      <label className='block mb-3'>
                        <EmailIcon className='h-6 w-6 text-gray-700' />
                        <span className='ml-2 font-bold'>Email address</span>
                        <Field
                          name='email'
                          className={classes.inputsignup}
                          type='email'
                          placeholder='Enter Email here'
                        />
                      </label>
                      {touched.email && errors.email ? (
                        <small>{errors.email}</small>
                      ) : null}
                      <label className='block mb-3'>
                        <LockIcon className='h-6 w-6 text-gray-700' />
                        <span className='ml-2 font-bold'>Password</span>
                        <Field
                          name='password'
                          type='password'
                          className={classes.inputsignup}
                          placeholder='Enter Password here'
                        />
                      </label>
                      {touched.password && errors.password ? (
                        <small>{errors.password}</small>
                      ) : null}
                      <div className='mb-6'>
                        <button
                          type='submit'
                          className='h-10 px-5 bg-sky-600 text-white rounded-lg transition-colors duration-150 focus:shadow-outline hover:bg-sky-300'
                        >
                          {loading ? (
                            <Loader.TailSpin
                              type='ThreeDots'
                              color='#fff'
                              height={25}
                              width={30}
                            />
                          ) : (
                            'Sign Up'
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

export default Signup;
