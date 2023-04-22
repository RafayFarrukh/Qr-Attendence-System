import React, { useState, useEffect } from 'react';
import axiosInstance from '../../services/axiosInstance';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import baseURL from '../../services/BaseURL';

const AllCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [singlecourse, setSinglecourse] = useState();
  const token = localStorage.getItem('Token');

  useEffect(() => {
    axiosInstance
      .get(`${baseURL}/api/course/teacher/ShowAllCourses`)
      .then((res) => {
        setSinglecourse(res.data.courseList?.map((course) => course._id));
        // console.log(courseList.map((course) => course.Course));
        setCourses(res.data.courseList?.map((course) => course.Course));

        //   console.log(res.data.courseList.map((course) => course.Course));
        // console.log(courses);
      });
  }, [courses]);
  return (
    <>
      <table class='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
        <thead class='text-xs text-gray-700  bg-slate-900 dark:bg-gray-700 dark:text-gray-400'>
          <tr>
            <th scope='col' class='py-3 px-6'>
              Course Code
            </th>
            <th scope='col' class='py-3 px-6'>
              CourseName
            </th>
            <th scope='col' class='py-3 px-6'>
              CourseShortNam
            </th>
            <th scope='col' class='py-3 px-6'>
              Details
            </th>
          </tr>
        </thead>
        <tbody>
          {courses?.length >= 0 ? (
            courses?.map((course, key) => (
              <tr key={course._id}>
                <td className='py-4 px-6'>{course._id.courseCode}</td>
                <td className='py-4 px-6'>{course._id.courseName}</td>
                <td className='py-4 px-6'>{course._id.courseShortName}</td>
                {/* <td className="py-4 px-6">{course._id}</td> */}

                <td className='flex py-4 px-6'>
                  <button
                    type='submit'
                    class='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                    onClick={() => {
                      navigate(`/onecourse/${singlecourse}`);
                      //   setSinglecourse(course._id._id);
                    }}
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3}>No courses</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};

export default AllCourses;
