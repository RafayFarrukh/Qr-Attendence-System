import { useState } from 'react';
import axios from 'axios';
import baseURL from '../../services/BaseURL';
import axiosInstance from '../../services/axiosInstance';

function CreateCourse() {
  const [courseCode, setCourseCode] = useState('');
  const [courseShortName, setCourseShortName] = useState('');
  const [courseName, setCourseName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

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

      setMessage(responseMessage);
      setCourseCode('');
      setCourseShortName('');
      setCourseName('');

      console.log(course_);
    } catch (error) {
      console.error(error);
      setMessage(error.response.data.message);
    }
  };

  return (
    <div className='flex justify-center mt-20'>
      <form
        onSubmit={handleSubmit}
        className='bg-white p-8 rounded-lg shadow-lg'
      >
        <h2 className='text-2xl font-bold mb-5'>Create a new course</h2>
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
          Create Course
        </button>
      </form>
    </div>
  );
}

export default CreateCourse;
