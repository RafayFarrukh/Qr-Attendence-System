import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';
import baseURL from '../../services/BaseURL';
import { toast } from 'react-toastify';

const CourseEditPage = () => {
  const { courseId } = useParams();
  const history = useNavigate();
  const [courseCode, setCourseCode] = useState('');
  const [courseShortName, setCourseShortName] = useState('');
  const [courseName, setCourseName] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const {
    courseCode: initialCourseCode,
    courseShortName: initialCourseShortName,
    courseName: initialCourseName,
  } = location.state || {};
  useEffect(() => {
    setCourseCode(initialCourseCode);
    setCourseShortName(initialCourseShortName);
    setCourseName(initialCourseName);
  }, [initialCourseCode, initialCourseShortName, initialCourseName]);
  const handleSave = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      await axiosInstance.patch(
        `${baseURL}/api/course/teacher/course/${courseId}`,
        {
          courseCode,
          courseShortName,
          courseName,
        },
      );
      setLoading(false);
      toast.success('Course updated successfully', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      console.log('we ar ehere');
      await history('/adminAllCourses');
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data.message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  };

  return (
    <div className='container mx-auto mt-10'>
      <h1 className='text-2xl font-bold mb-4'>Edit Course</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <form
          onSubmit={handleSave}
          className='bg-white p-8 rounded-lg shadow-lg'
        >
          <div className='mb-4'>
            <label htmlFor='courseCode' className='block font-medium'>
              Course Code
            </label>
            <input
              type='text'
              id='courseCode'
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              className='border border-gray-400 p-2 w-full rounded-md'
              required
            />
          </div>
          <div className='mb-4'>
            <label htmlFor='courseShortName' className='block font-medium'>
              Course Short Name
            </label>
            <input
              type='text'
              id='courseShortName'
              value={courseShortName}
              onChange={(e) => setCourseShortName(e.target.value)}
              className='border border-gray-400 p-2 w-full rounded-md'
              required
            />
          </div>
          <div className='mb-4'>
            <label htmlFor='courseName' className='block font-medium'>
              Course Full Name
            </label>
            <input
              type='text'
              id='courseName'
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className='border border-gray-400 p-2 w-full rounded-md'
              required
            />
          </div>
          <button
            className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600'
            type='submit'
          >
            Save
          </button>
        </form>
      )}
    </div>
  );
};

export default CourseEditPage;
