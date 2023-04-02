import React, { useState, useEffect } from "react";
import axiosInstance from "../../services/axiosInstance";
import { useNavigate, useLocation } from "react-router-dom";
const OneCourse = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [course, setCourse] = useState();
const [classId,setClassId]=useState()
const split = location.pathname.split("/");
    var id = split[2];
  useEffect(() => {
    
    
    console.log(classId,id)
    axiosInstance
      .get(`/api/course/teacher/showOneCourse/${id}`)
      .then((res) => {
        console.log(res.data.classObj);
        setCourse(res.data.classObj);
      });
  }, []);
   useEffect(() => {
    console.log(id)
  }, []);
  // const teacher = course.teacher;
  return (
  <>
  <table class="table-auto w-full text-sm text-left text-gray-500 dark:text-gray-400">
    <thead class="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        <th scope="col" class="py-3 px-6">
          Course Code
        </th>
        <th scope="col" class="py-3 px-6">
          Course Name
        </th>
        <th scope="col" class="py-3 px-6">
          Course Short Name
        </th>
      </tr>
    </thead>
    {course != null ? (
      <>
        <tbody>
          <td class="py-4 px-6">{course.Course._id.courseCode}</td>
          <td class="py-4 px-6">{course.Course._id.courseName}</td>
          <td class="py-4 px-6">{course.Course._id.courseShortName}</td>
        </tbody>
      </>
    ) : (
      <></>
    )}
  </table>
  {course != null ? (
    <div class="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      <div class="bg-cyan-300 shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:-translate-y-1 hover:scale-110 cursor-pointer">
        <div class="px-6 py-4">
          <h3 class="text-lg font-bold text-blue-800 dark:text-white">Teacher Name</h3>
          <p class="mt-2 font-bold text-gray-800 dark:text-gray-300">{course.teacher.fullName}</p>
        </div>
      </div>
      <div class="bg-cyan-300 shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:-translate-y-1 hover:scale-110 cursor-pointer">
        <div class="px-6 py-4">
          <h3 class="text-lg font-bold text-gray-800 dark:text-white">Teacher Email</h3>
          <p class="mt-2 text-lg font-bold text-white">{course.teacher.email}</p>
        </div>
      </div>
      <div class="bg-cyan-300 shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:-translate-y-1 hover:scale-110 cursor-pointer">
        <div class="px-6 py-4">
          <h3 class="text-lg font-bold text-gray-800 dark:text-white">Course Information</h3>
          <p class="mt-2 text-gray-800 dark:text-gray-300">Add any additional information about the course here.</p>
        </div>
      </div>
       <div onClick={()=>{
        navigate("/takeAttendance", { classId:classId })
       }} class="bg-cyan-300 shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:-translate-y-1 hover:scale-110 cursor-pointer">
        <div class="px-6 py-4">
          <h3 class="text-lg font-bold text-gray-800 dark:text-white">Take Attendance</h3>
          <p class="mt-2 text-gray-800 dark:text-gray-300">Add any additional information about the course here.</p>
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
