import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from '../../services/axiosInstance';
import { useNavigate } from 'react-router-dom';
import * as Loader from 'react-loader-spinner';

import axios from 'axios';
import baseURL from '../../services/BaseURL';
import { UserContext } from '../../App';
const AllCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [singlecourse, setSinglecourse] = useState();
  const token = localStorage.getItem('Token');
  const { state, dispatch } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(state, 'state in all courses');
    setLoading(true);

    axiosInstance
      .get(`${baseURL}/api/course/teacher/ShowAllCourses`)
      .then((res) => {
        setSinglecourse(res.data.courseList?.map((course) => course._id));
        setCourses(res.data.courseList?.map((course) => course));
        console.log(courses, 'class');

        setLoading(false);

        //   console.log(res.data.courseList.map((course) => course.Course));
        // console.log(courses);
      });
  }, []);
  return (
    <>
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
                  <td className='py-4 px-6'>{course.Course._id.courseCode}</td>
                  <td className='py-4 px-6'>{course.Course._id.courseName}</td>
                  <td className='py-4 px-6'>
                    {course.Course._id.courseShortName}
                  </td>
                  {/* <td className="py-4 px-6">{course._id}</td> */}

                  <td className='flex py-4 px-6'>
                    <button
                      type='submit'
                      class='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                      onClick={() => {
                        navigate(`/onecourse/${course._id}`);
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
      )}
    </>
  );
};

export default AllCourses;
