import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from '../../services/axiosInstance';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../../App';
import baseURL from '../../services/BaseURL';
import { FaUsers, FaQrcode } from 'react-icons/fa';
import * as Loader from 'react-loader-spinner';

const OneCourse = () => {
  const { state, dispatch } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const [course, setCourse] = useState();
  const [classId, setClassId] = useState();
  const split = location.pathname.split('/');
  var id = split[2];
  useEffect(() => {
    console.log(id, 'od');
    setLoading(true);

    axiosInstance
      .get(`${baseURL}/api/course/teacher/showOneCourse/${id}`)
      .then((res) => {
        console.log(res.data.classObj);
        localStorage.setItem('classId', id);
        dispatch({ type: 'FetchClassId', payload: id });
        setCourse(res.data.classObj);
        setLoading(false);
      });
  }, []);
  useEffect(() => {
    console.log(state);
  }, []);

  return (
    <>
      {course != null && (
        <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
          <div className='ml-4'>
            <div className='bg-gray-100 shadow-lg rounded-lg p-6 cursor-pointer'>
              <h3 className='text-lg font-bold mb-4'>Course Code</h3>
              <p className='text-gray-800'>{course.Course._id.courseCode}</p>
            </div>
          </div>
          <div className='ml-4'>
            <div className='bg-gray-100 shadow-lg rounded-lg p-6 cursor-pointer'>
              <h3 className='text-lg font-bold mb-4'>Course Name</h3>
              <p className='text-gray-800'>{course.Course._id.courseName}</p>
            </div>
          </div>
          <div className='ml-4'>
            <div className='bg-gray-100 shadow-lg rounded-lg p-6 cursor-pointer'>
              <h3 className='text-lg font-bold mb-4'>Course Short Name</h3>
              <p className='text-gray-800'>
                {course.Course._id.courseShortName}
              </p>
            </div>
          </div>
          <div className='ml-4'>
            <div
              className='bg-gray-700 shadow-lg rounded-lg p-6 transform transition duration-300 hover:-translate-y-1 hover:scale-110 cursor-pointer flex items-center justify-center text-white'
              onClick={() => {
                navigate(`/attendancePicker/${id}`);
              }}
            >
              <FaUsers size={24} className='mb-2' />
              <h3 className='text-lg font-bold mb-2 ml-2'>Total Attendance</h3>
              <p className='text-white'>All Semester Attendance</p>
            </div>
          </div>
          <div className='ml-4'>
            <div
              className='bg-gray-600 shadow-lg rounded-lg p-6 transform transition duration-300 hover:-translate-y-1 hover:scale-110 cursor-pointer flex items-center justify-center text-white'
              onClick={() => {
                navigate('/takeAttendance', { classId: classId });
              }}
            >
              <FaQrcode size={24} className='mb-2' />
              <h3 className='text-lg font-bold mb-2 ml-2'>Take Attendance</h3>
              <p className='text-white'>
                Students will scan the QR code to mark their attendance.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OneCourse;
