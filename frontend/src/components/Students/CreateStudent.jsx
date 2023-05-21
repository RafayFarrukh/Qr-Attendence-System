import React, { useState, useRef } from 'react';
import axios from 'axios';
import axiosInstance from '../../services/axiosInstance';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import baseURL from '../../services/BaseURL';
import { toast } from 'react-toastify';
import * as Loader from 'react-loader-spinner';
import * as Yup from 'yup';
import BaseURL from '../../services/BaseURL';
import { Formik, Field } from 'formik';
import MaskedInput from 'react-input-mask';
const validationSchema = Yup.object().shape({
  stdId: Yup.string()
    .required('Student ID is Required')
    .min(12, 'Student ID must should be 12 characters'),
  fullName: Yup.string()
    .required('Username is Required')
    .min(5, 'Username must be more then 5 characters'),
  email: Yup.string().required('E-mail is Required!').email('E-mail Invalid'),
  password: Yup.string()
    .required('Password is Required')
    // .matches(/(?=[a-zA-Z])/, 'A Password Must contain atleast 1 Character')

    .min(5, 'Password must be atleast 5 characters'),
});
const CreateStudents = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    setLoading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);
    console.log(selectedFile, 'selectedFile'); // Check the value of selectedFile
    console.log(formData, 'formData'); // Check the value of formData
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    axios
      .post(`${baseURL}/api/auth/student/register/excel`, formData, config)
      .then((response) => {
        console.log(response.data, 'response');

        setSelectedFile(null);
        toast.success('Successfully Uploaded', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
        setLoading(false);

        // Handle success response
      })
      .catch((error) => {
        setLoading(false);

        toast.error(error.response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
        console.error(error, 'error');
        // Handle error response
      })
      .finally(() => {
        setLoading(false);

        setSelectedFile(null); // Clear the selected file
        if (fileInputRef.current) {
          fileInputRef.current.value = ''; // Reset the file input value
        }
      });
  };

  return (
    <div className='bg-white p-8 rounded-lg  flex flex-col items-center justify-center'>
      <h2 className='text-2xl font-bold mb-10'>Add New Students</h2>

      <div className='flex shadow-lg items-center justify-center mt-4'>
        <div className='mr-2'>
          <div className='flex mb-4'>
            <input
              type='file'
              className='border border-gray-400 p-2 rounded-l-lg'
              onChange={handleFileChange}
              ref={fileInputRef}
            />
            <button
              className='px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600'
              onClick={handleUpload}
              // disabled={!selectedFile}
            >
              {loading ? (
                <Loader.TailSpin
                  type='ThreeDots'
                  color='#fff'
                  height={25}
                  width={30}
                />
              ) : (
                'Upload'
              )}
            </button>
          </div>
        </div>
      </div>

      <Formik
        initialValues={{
          fullName: '',
          email: '',
          password: '',
          stdId: '',
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          setLoading1(true);
          console.log({
            fullName: values.fullName,
            email: values.email,
            password: values.password,
            stdId: values.stdId,
          });
          const allowedDomain = '@cuilahore.edu.pk';
            if (!values.email.endsWith(allowedDomain)) {
              toast.error('Only emails from @cuilahore.edu.pk domain are allowed.', {
                  position: toast.POSITION.TOP_RIGHT,
                  autoClose: 2000,
                });
              setLoading1(false);
      
      return;
    }
          axios
            .post(`${BaseURL}/api/auth/student/register`, {
              stdId: values.stdId,
              fullName: values.fullName,
              email: values.email,
              password: values.password,
            })
            .then((resp) => {
              toast.success('Successfully SignedUp', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
              });
              resetForm();
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
              setLoading1(false);
            });
        }}
      >
        {(props) => {
          const { touched, errors, handleSubmit } = props;
          return (
            <div className=''>
              <div className='mt-16'>
                <div className='w-full md:w-96 md:max-w-full mx-auto shadow-lg'>
                  <div className='p-6 border-gray-300 sm:rounded-md'>
                    {/* <h1 className='text-center font-semibold text-3xl lg:text-4xl text-gray-800 mb-12'>
                      Signup
                    </h1> */}
                    <form method='POST' action='' onSubmit={handleSubmit}>
                      <label className='block mb-3'>
                        <PersonIcon className='h-6 w-6 text-gray-700' />
                        <span className='ml-2 mt-10 font-bold'>Student ID</span>
                        <Field
                    name='stdId'
                    render={({ field }) => (
                      <MaskedInput
                        {...field}
                        mask='aa99-aaa-999'
                        placeholder='Enter Student ID Here'
                        className='border border-gray-300 p-3 rounded-lg w-full mt-3 focus:outline-none focus:border-gray-400'
                      />
                    )}
                  />
                      </label>
                      {touched.stdId && errors.stdId ? (
                        <small>{errors.stdId}</small>
                      ) : null}
                      <label className='block mb-3'>
                        <PersonIcon className='h-6 w-6 text-gray-700' />
                        <span className='ml-2 mt-10 font-bold'>User Name</span>
                        <Field
                          name='fullName'
                          type='text'
                          className='border border-gray-300 p-3 rounded-lg w-full mt-3 focus:outline-none focus:border-gray-400'
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
                          className='border border-gray-300 p-3 rounded-lg w-full mt-3 focus:outline-none focus:border-gray-400'
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
                          className='border border-gray-300 p-3 rounded-lg w-full mt-3 focus:outline-none focus:border-gray-400'
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
                          {loading1 ? (
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
    </div>
  );
};

export default CreateStudents;
