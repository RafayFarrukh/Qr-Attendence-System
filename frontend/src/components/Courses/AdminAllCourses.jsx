import React, { useState, useEffect } from 'react';
import axios from 'axios';
import baseURL from '../../services/BaseURL';
import axiosInstance from '../../services/axiosInstance';
import * as Loader from 'react-loader-spinner';
import { SiDiscourse } from 'react-icons/si';

const AdminAllCourses = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className='container mx-auto mt-10'>
      <h1 className='text-2xl font-bold mb-4 ml-5'>
        <SiDiscourse className='inline-block mr-3 ' />
        Courses
      </h1>
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
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminAllCourses;
