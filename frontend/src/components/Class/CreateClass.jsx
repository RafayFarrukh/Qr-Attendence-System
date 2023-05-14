import { useState } from 'react';
import axios from 'axios';
import baseURL from '../../services/BaseURL';
import axiosInstance from '../../services/axiosInstance';
function CreateClass() {
  const [courseCode, setCourseCode] = useState('');
  const [teacherEmail, setTeacherEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axiosInstance.post(
        `${baseURL}/api/class/teacher/addClass`,
        {
          courseCode,
          teacher: teacherEmail,
        },
      );

      const { message: responseMessage, class_ } = response.data;

      setMessage(responseMessage);
      setCourseCode('');
      setTeacherEmail('');

      console.log(class_);
    } catch (error) {
      console.error(error, 'eror');
      setMessage(error.response.data.message);
    }
  };

  return (
    <div className='flex justify-center mt-8'>
      <form
        onSubmit={handleSubmit}
        className='bg-white p-8 rounded-lg shadow-lg'
      >
        <h2 className='text-2xl font-bold mb-4'>Create a new class</h2>
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
            htmlFor='teacherEmail'
            className='block text-gray-700 font-bold mb-2'
          >
            Teacher Email:
          </label>
          <input
            type='email'
            name='teacherEmail'
            id='teacherEmail'
            value={teacherEmail}
            onChange={(event) => setTeacherEmail(event.target.value)}
            className='border border-gray-400 p-2 w-full rounded-lg'
            required
          />
        </div>
        <button
          type='submit'
          className='bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700'
        >
          Create Class
        </button>
      </form>
    </div>
  );
}

export default CreateClass;
