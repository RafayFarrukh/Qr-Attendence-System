import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from '../../services/axiosInstance';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../../App';

const OneCourse = () => {
  const { state, dispatch } = useContext(UserContext);

  const location = useLocation();
  const navigate = useNavigate();
  const [course, setCourse] = useState();
  const [classId, setClassId] = useState();
  const split = location.pathname.split('/');
  var id = split[2];
  useEffect(() => {
    console.log(state);
    axiosInstance.get(`/api/course/teacher/showOneCourse/${id}`).then((res) => {
      console.log(res.data.classObj);
      localStorage.setItem('classId', id)
      dispatch({ type: 'FetchClassId', payload: id });
      setCourse(res.data.classObj);
    });
  }, [course]);
  useEffect(() => {
    console.log(state);
  }, []);
  // const teacher = course.teacher;
  return (
    <>
      <table class='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
        <thead>
          <tr className='bg-gray-100 border-b-2 border-gray-300'>
            <th className='px-6 py-3 text-sm font-bold text-left text-gray-600 uppercase tracking-wider'>
              Course Code
            </th>
            <th className='px-6 py-3 text-sm font-bold text-left text-gray-600 uppercase tracking-wider'>
              Course Name
            </th>
            <th className='px-6 py-3 text-sm font-bold text-left text-gray-600 uppercase tracking-wider'>
              Couse Short Name
            </th>
          </tr>
        </thead>
        {course != null ? (
          <tbody>
            <tr class='border-b border-gray-200 hover:bg-gray-100 '>
              <td class='py-4 px-6'>{course.Course._id.courseCode}</td>
              <td class='py-4 px-6'>{course.Course._id.courseName}</td>
              <td class='py-4 px-6'>{course.Course._id.courseShortName}</td>
            </tr>
          </tbody>
        ) : (
          <></>
        )}
      </table>
      {course != null ? (
        <div class='mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
          <div class='ml-4 bg-gray-700 shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:-translate-y-1 hover:scale-110 cursor-pointer'>
            <div
              class='px-6 py-4'
              onClick={() => {
                navigate('/attendancePicker');
              }}
            >
              <h3 class='text-lg font-bold text-blue-800 dark:text-white'>
                Total Attendance
              </h3>
              <p class='mt-2 font-bold text-gray-800 dark:text-gray-300'>
                All Semester Attendance{' '}
              </p>
            </div>
          </div>
          <div class='ml-4 bg-gray-700 shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:-translate-y-1 hover:scale-110 cursor-pointer'>
            <div class='px-6 py-4'>
              <h3 class='text-lg font-bold text-gray-800 dark:text-white'>
                Teacher Email
              </h3>
              <p class='mt-2 text-lg font-bold text-white'>
                {course.teacher.email}
              </p>
            </div>
          </div>
          <div class='ml-4 bg-gray-700 shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:-translate-y-1 hover:scale-110 cursor-pointer'>
            <div class='px-6 py-4'>
              <h3 class='text-lg font-bold text-gray-800 dark:text-white'>
                Course Information
              </h3>
              <p class='mt-2 text-gray-800 dark:text-gray-300'>
                Add any additional information about the course here.
              </p>
            </div>
          </div>
          <div
            onClick={() => {
              navigate('/takeAttendance', { classId: classId });
            }}
            class='ml-4 bg-gray-700 shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:-translate-y-1 hover:scale-110 cursor-pointer'
          >
            <div class='px-6 py-4'>
              <h3 class='text-lg font-bold text-gray-800 dark:text-white'>
                Take Attendance
              </h3>
              <p class='mt-2 text-gray-800 dark:text-gray-300'>
                Students will scan the Qr code to mark their attendance.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default OneCourse;
