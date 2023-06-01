import React, { useState, useEffect } from 'react';
import axiosInstance from '../../services/axiosInstance';

import baseURL from '../../services/BaseURL';
import * as Loader from 'react-loader-spinner';
import { HiOutlineAcademicCap } from 'react-icons/hi';
import { Typography } from '@mui/material';

const TotalClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get(
        `${baseURL}/api/class/teacher/totalclasses`,
        {
          params: { course: searchQuery },
        },
      );
      setClasses(response.data.classes);
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
        .get(`${baseURL}/api/class/teacher/search`, {
          params: { course: searchQuery },
        })
        .then((res) => {
          setClasses(res.data.classes);
          setError('');
          console.log(res, 'res');
        })
        .catch((e) => {
          console.log(e, 'ee');
          setClasses([]);
          setError(e.response.data.message);
        });

      setClasses(response.data.classes);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
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
          <HiOutlineAcademicCap className='inline-block mr-3' />
          Classes
        </h1>
        <div className='flex items-center ml-auto mr-8 mb-4'>
          <input
            type='text'
            placeholder='Search Class...'
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
                Course Name
              </th>
              <th className='px-6 py-3 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase border-b border-gray-300'>
                Teacher Email
              </th>
              <th className='px-6 py-3 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase border-b border-gray-300'>
                Total Students
              </th>
            </tr>
          </thead>
          <tbody>
            {classes?.map?.((class_) => (
              <tr key={class_._id}>
                <td className='px-6 py-4 border-b border-gray-300'>
                  {class_.courseDetails.courseCode}
                </td>
                <td className='px-6 py-4 border-b border-gray-300'>
                  {class_.courseDetails.courseName}
                </td>
                <td className='px-6 py-4 border-b border-gray-300'>
                  {class_.teacher.email}
                </td>
                <td className='px-6 py-4 border-b border-gray-300'>
                  Total Students: {class_.students.length}
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

export default TotalClasses;
