import React, { useState, useEffect } from 'react';
import axios from 'axios';
import baseURL from '../../services/BaseURL';

const AllTeachers = () => {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/auth/teacher/all`);
      setTeachers(response.data.teachers);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='container mx-auto mt-10'>
      <h1 className='text-2xl font-bold mb-4'>Teachers</h1>
      <table className='min-w-full bg-white border border-gray-300'>
        <thead>
          <tr>
            <th className='px-6 py-3 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase border-b border-gray-300'>
              Full Name
            </th>
            <th className='px-6 py-3 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase border-b border-gray-300'>
              Email
            </th>
            <th className='px-6 py-3 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase border-b border-gray-300'>
              Admin
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllTeachers;
