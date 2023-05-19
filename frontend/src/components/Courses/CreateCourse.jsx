import React, { useState, useRef } from 'react';
import axios from 'axios';
import axiosInstance from '../../services/axiosInstance';
import baseURL from '../../services/BaseURL';
import { toast } from 'react-toastify';
import * as Loader from 'react-loader-spinner';

const CreateCourse = () => {
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [courseCode, setCourseCode] = useState('');
  const [courseShortName, setCourseShortName] = useState('');
  const [courseName, setCourseName] = useState('');
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
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
    axiosInstance
      .post(`${baseURL}/api/course/teacher/register/excel`, formData, config)
      .then((response) => {
        console.log(response.data, 'response');
        setLoading(false);
        setSelectedFile(null);
        toast.success('Successfully Uploaded', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
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
        setSelectedFile(null); // Clear the selected file
        if (fileInputRef.current) {
          fileInputRef.current.value = ''; // Reset the file input value
        }
      });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading1(true);

    try {
      const response = await axiosInstance.post(
        `${baseURL}/api/course/teacher/addCourse`,
        {
          courseCode,
          courseShortName,
          courseName,
        },
      );

      const { message: responseMessage, course_ } = response.data;
      toast.success('Successfully Uploaded', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      // setMessage(responseMessage);
      setCourseCode('');
      setCourseShortName('');
      setCourseName('');
      setLoading1(false);

      console.log(course_);
    } catch (error) {
      setLoading1(false);

      console.error(error);
      toast.error(error.response.data.message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      // setMessage(error.response.data.message);
    }
  };
  return (
    <>
      <div className='bg-white p-8 rounded-lg  flex flex-col items-center justify-center'>
        <h2 className='text-2xl font-bold mb-5'>Create a new course</h2>

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

        <form
          onSubmit={handleSubmit}
          className='mt-6 flex flex-col items-center shadow-md p-10'
        >
          {message && <div className='text-red-500 mb-4'>{message}</div>}
          <div className='mb-4'>
            <label
              htmlFor='courseCode'
              className='block text-gray-700 font-bold mb-2'
            >
              Course Code:
            </label>
            <input
              type='text'
              name='courseCode'
              id='courseCode'
              value={courseCode}
              onChange={(event) => setCourseCode(event.target.value)}
              className='border border-gray-400 p-2 w-full rounded-lg'
              required
            />
          </div>
          <div className='mb-4'>
            <label
              htmlFor='courseShortName'
              className='block text-gray-700 font-bold mb-2'
            >
              Course Short Name:
            </label>
            <input
              type='text'
              name='courseShortName'
              id='courseShortName'
              value={courseShortName}
              onChange={(event) => setCourseShortName(event.target.value)}
              className='border border-gray-400 p-2 w-full rounded-lg'
              required
            />
          </div>
          <div className='mb-4'>
            <label
              htmlFor='courseName'
              className='block text-gray-700 font-bold mb-2'
            >
              Course Name:
            </label>
            <input
              type='text'
              name='courseName'
              id='courseName'
              value={courseName}
              onChange={(event) => setCourseName(event.target.value)}
              className='border border-gray-400 p-2 w-full rounded-lg'
              required
            />
          </div>
          <button
            type='submit'
            className='bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700'
          >
            {loading1 ? (
              <Loader.TailSpin
                type='ThreeDots'
                color='#fff'
                height={25}
                width={30}
              />
            ) : (
              'Create Course'
            )}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateCourse;
