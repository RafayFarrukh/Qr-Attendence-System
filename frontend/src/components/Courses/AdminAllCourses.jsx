import React, { useState, useEffect } from 'react';
import axios from 'axios';
import baseURL from '../../services/BaseURL';
import axiosInstance from '../../services/axiosInstance';
import * as Loader from 'react-loader-spinner';
import { SiDiscourse } from 'react-icons/si';
import { Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai';

const AdminAllCourses = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get(
        `${baseURL}/api/course/teacher/courses`,
      );
      setTeachers(response.data.courses);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance
        .get(`${baseURL}/api/course/teacher/search`, {
          params: { course: searchQuery },
        })
        .then((res) => {
          setTeachers(res.data.courses);
          setError('');
          console.log(res, 'res');
        })
        .catch((e) => {
          console.log(e, 'ee');
          setTeachers([]);
          setError(e.response.data.message);
        });

      setTeachers(response.data.courses);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const handleDelete = async (courseId) => {
    try {
      setLoading(true);
      await axiosInstance.delete(
        `${baseURL}/api/course/teacher/delete/${courseId}`,
      );
      setLoading(false);
      toast.success('Course deleted successfully', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      fetchTeachers(); // Refresh the course list
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data.message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className='container mx-auto mt-10'>
      <div className='flex items-center'>
        <h1 className='text-2xl font-bold mb-4 ml-12'>
          <SiDiscourse className='inline-block mr-3 ' />
          Courses
        </h1>
        <div className='flex items-center ml-auto mr-8 mb-4'>
          <input
            type='text'
            placeholder='Search Course...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            className='px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
          <button
            onClick={handleSearch}
            className='ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600'
          >
            Search
          </button>
        </div>
      </div>
      {loading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '400px',
          }}
        >
          <Loader.TailSpin
            type='ThreeDots'
            color='black'
            height={150}
            width={150}
          />
        </div>
      ) : (
        <table className='min-w-full bg-white border border-gray-300'>
          <thead>
            <tr>
              <th className='px-6 py-3 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase border-b border-gray-300'>
                Course Code
              </th>
              <th className='px-6 py-3 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase border-b border-gray-300'>
                Course Short Name
              </th>
              <th className='px-6 py-3 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase border-b border-gray-300'>
                Course Full Name
              </th>
              <th className='px-6 py-3 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase border-b border-gray-300'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {teachers?.map?.((teacher) => (
              <tr key={teacher._id}>
                <td className='px-6 py-4 border-b border-gray-300'>
                  {teacher.courseCode}
                </td>
                <td className='px-6 py-4 border-b border-gray-300'>
                  {teacher.courseShortName}
                </td>
                <td className='px-6 py-4 border-b border-gray-300'>
                  {teacher.courseName}
                </td>
                <td className='px-6 py-4 border-b border-gray-300'>
                  <button
                    className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'
                    onClick={() =>
                      navigate(`/edit-course/${teacher._id}`, {
                        state: {
                          courseCode: teacher.courseCode,
                          courseShortName: teacher.courseShortName,
                          courseName: teacher.courseName,
                        },
                      })
                    }
                  >
                    <AiFillEdit />
                  </button>
                  <button
                    className='bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 ml-2'
                    onClick={() => handleDelete(teacher._id)}
                  >
                    <AiFillDelete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {error && (
        <Typography
          variant='body2'
          color='error'
          sx={{ mt: '1rem', textAlign: 'left', fontSize: '1rem', ml: '1rem' }}
        >
          {error}
        </Typography>
      )}
    </div>
  );
};

export default AdminAllCourses;
