import React, { useState, useEffect } from 'react';
import axios from 'axios';
import baseURL from '../../services/BaseURL';
import * as Loader from 'react-loader-spinner';
import { ImUserTie } from 'react-icons/im';
import { Typography, Button } from '@mui/material';
import axiosInstance from '../../services/axiosInstance';
const AllTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseURL}/api/auth/teacher/all`);
      setTeachers(response.data.teachers);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseURL}/api/auth/teacher/search`, {
        params: { teacher: searchQuery },
      });
      setTeachers(response.data.teachers);
      setError('');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setTeachers([]);
      setError(error.response.data.message);
    }
  };

  const handleMakeAdmin = async (teacherId) => {
    try {
      await axiosInstance.patch(
        `${baseURL}/api/teacher/teacher/${teacherId}/makeAdmin`,
      );
      fetchTeachers();
    } catch (error) {
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
          <ImUserTie className='inline-block mr-4' />
          Teachers
        </h1>
        <div className='flex items-center ml-auto mr-8 mb-4'>
          <input
            type='text'
            placeholder='Search teacher...'
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
        <div className='flex justify-center items-center h-40'>
          <Loader.TailSpin
            type='ThreeDots'
            color='black'
            height={50}
            width={50}
          />
        </div>
      ) : (
        <>
          {teachers.length === 0 ? (
            <Typography variant='body1' sx={{ mt: 2 }}>
              No teachers found.
            </Typography>
          ) : (
            <table className='min-w-full bg-white border border-gray-300'>
              <thead>
                <tr>
                  <th className='px-6 py-3 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase border-b border-gray-300'>
                    Full Name
                  </th>
                  <th className='px-6 py4 border-b border-gray-300'>Email</th>
                  <th className='px-6 py-3 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase border-b border-gray-300'>
                    Admin
                  </th>
                  <th className='px-6 py-3 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase border-b border-gray-300'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((teacher) => (
                  <tr key={teacher._id}>
                    <td className='px-6 py-4 border-b border-gray-300'>
                      {teacher.fullName}
                    </td>
                    <td className='px-6 py-4 border-b border-gray-300'>
                      {teacher.email}
                    </td>
                    <td className='px-6 py-4 border-b border-gray-300'>
                      {teacher.admin ? 'Yes' : 'No'}
                    </td>
                    <td className='px-6 py-4 border-b border-gray-300'>
                      {!teacher.admin && (
                        <Button
                          variant='contained'
                          color='primary'
                          size='small'
                          onClick={() => handleMakeAdmin(teacher._id)}
                        >
                          Make Admin
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
      {error && (
        <Typography
          variant='body2'
          color='error'
          sx={{ mt: '1rem', textAlign: 'left' }}
        >
          {error}
        </Typography>
      )}
    </div>
  );
};

export default AllTeachers;
