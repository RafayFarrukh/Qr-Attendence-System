import React, { useState, useEffect } from 'react';
import axiosInstance from '../../services/axiosInstance';
import baseURL from '../../services/BaseURL';
import { toast } from 'react-toastify';
import * as Loader from 'react-loader-spinner';
import { RiUserFill, RiMailFill } from 'react-icons/ri';
import { MdCheckBox } from 'react-icons/md';
import { AiTwotoneCalendar } from 'react-icons/ai';
import { FaUsers } from 'react-icons/fa';
function CreateClass() {
  const [courseCode, setCourseCode] = useState('');
  const [teacherEmail, setTeacherEmail] = useState('');
  const [teachersList, setTeachersList] = useState([]);
  const [coursesList, setCoursesList] = useState([]);
  const [message, setMessage] = useState('');
  const [batches, setBatches] = useState();
  const [selectedBatch, setSelectedBatch] = useState('');
  const [studentsList, setStudentsList] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);

  const [selectedStudents, setSelectedStudents] = useState([]);
  useEffect(() => {
    // Fetch teachers list
    const fetchTeachers = async () => {
      try {
        const response = await axiosInstance.get(
          `${baseURL}/api/course/teacher/teachers`,
        );
        setTeachersList(response.data.teachers);
      } catch (error) {
        console.error(error);
      }
    };

    // Fetch courses list
    const fetchCourses = async () => {
      try {
        const response = await axiosInstance.get(
          `${baseURL}/api/course/teacher/courses`,
        );
        console.log(response.data.courses, 'courseslist');
        setCoursesList(response.data.courses);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTeachers();
    fetchCourses();
  }, []);
  const fetchStudentsByBatch = async () => {
    try {
      // Make a request to the backend API to fetch students by batch
      const response = await axiosInstance.post(
        `${baseURL}/api/class/teacher/batches/create`,
      );
      console.log(response.data.batches, 'batches');
      setBatches(response.data.batches);

      const responseStudents = await axiosInstance.get(
        `${baseURL}/api/class/teacher//students/batch/${selectedBatch}`,
      );
      setStudentsList(responseStudents.data.students);
      console.log(responseStudents.data.students, 'response students');
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchStudentsByBatch();
  }, [selectedBatch]);
  const handleStudentSelection = (event) => {
    const studentId = event.target.value;
    const isChecked = event.target.checked;
    let updatedSelectedStudents = [];

    if (isChecked) {
      updatedSelectedStudents = [...selectedStudents, studentId];
    } else {
      updatedSelectedStudents = selectedStudents.filter(
        (id) => id !== studentId,
      );
    }

    setSelectedStudents(updatedSelectedStudents);
    setSelectAll(updatedSelectedStudents.length === studentsList.length);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedStudents([]);
    } else {
      const allStudentIds = studentsList.map((student) => student._id);
      setSelectedStudents(allStudentIds);
    }
    setSelectAll(!selectAll);
  };

  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();
    // Get the selected student IDs
    const selectedStudents = [];
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      console.log(checkbox.value, 'checkbbox');
      if (checkbox.checked && checkbox.value != 'on') {
        selectedStudents.push(checkbox.value);
      }
    });

    console.log(selectedStudents, 'selected students');
    try {
      const response = await axiosInstance.post(
        `${baseURL}/api/class/teacher/addClass`,
        {
          courseCode,
          teacher: teacherEmail,
          students: selectedStudents,
        },
      );
      toast.success('Successfully Created Class', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
      });
      const { message: responseMessage, class_ } = response.data;
      // setMessage(responseMessage);
      setCourseCode('');
      setTeacherEmail('');
      setSelectedStudents([]);
      setBatches();
      setSelectedBatch('');
      setStudentsList([]);
      setSelectAll(false);
      setLoading(false);
      console.log(class_);
    } catch (error) {
      console.error(error, 'eror');
      setLoading(false);
      setMessage(error.response.data.message);
    }
  };

  return (
    <div className='flex justify-center mt-8'>
      <form
        onSubmit={handleSubmit}
        className='bg-white p-8 rounded-lg shadow-lg'
      >
        <h2 className='text-2xl font-bold mb-4'>
          <FaUsers className='inline-block mr-8 text-blue-600' /> Create a new
          class
        </h2>
        {message && <div className='text-red-500 mb-4'>{message}</div>}
        <div className='mb-4'>
          <label
            htmlFor='courseCode'
            className='block text-gray-700 font-bold mb-2'
          >
            <RiUserFill className='inline-block mr-2 text-blue-600' />
            Course Code:
          </label>
          <input
            type='text'
            name='courseCode'
            id='courseCode'
            value={courseCode}
            onChange={(event) => setCourseCode(event.target.value)}
            className='border border-gray-400 p-2 w-full rounded-lg'
            required
          />
        </div>
        <div className='mb-4'>
          <label
            htmlFor='teacherEmail'
            className='block text-gray-700 font-bold mb-2'
          >
            <RiMailFill className='inline-block mr-2 text-blue-600' />
            Teacher Email:
          </label>
          <select
            name='teacherEmail'
            id='teacherEmail'
            value={teacherEmail}
            onChange={(event) => setTeacherEmail(event.target.value)}
            className='border border-gray-400 p-2 w-full rounded-lg'
            required
          >
            <option value=''>Select Teacher</option>
            {teachersList.map((teacher) => (
              <option key={teacher._id} value={teacher.email}>
                {teacher.email}
              </option>
            ))}
          </select>
        </div>

        <div className='mb-4'>
          <label
            htmlFor='course'
            className='block text-gray-700 font-bold mb-2'
          >
            <RiUserFill className='inline-block mr-2 text-blue-600' />
            Course:
          </label>
          <select
            name='course'
            id='course'
            value={courseCode}
            onChange={(event) => setCourseCode(event.target.value)}
            className='border border-gray-400 p-2 w-full rounded-lg'
            required
          >
            <option value=''>Select Course</option>
            {coursesList.map((course) => (
              <option key={course._id} value={course.courseCode}>
                {course.courseName}
              </option>
            ))}
          </select>
        </div>
        <div className='mb-4'>
          <label htmlFor='batch' className='block text-gray-700 font-bold mb-2'>
            <AiTwotoneCalendar className='inline-block mr-2 text-blue-600' />{' '}
            Batch:
          </label>
          <select
            name='batch'
            id='batch'
            value={selectedBatch}
            onChange={(event) => setSelectedBatch(event.target.value)}
            className='border border-gray-400 p-2 w-full rounded-lg'
            required
          >
            <option value=''>Select Batch</option>
            {batches?.map?.((course) => (
              <option key={course._id} value={course.courseCode}>
                {course}
              </option>
            ))}
          </select>
        </div>

        <div className='mb-4'>
          <label className='block text-gray-700 font-bold mb-2'>
            Select Students:
          </label>
          <div className='flex flex-col'>
            <label className='flex items-center mb-2'>
              <input
                type='checkbox'
                checked={selectAll}
                onChange={handleSelectAll}
                className='mr-2'
              />
              Select All
            </label>
            {studentsList?.map?.((student) => (
              <label key={student._id} className='flex items-center mb-2'>
                <input
                  type='checkbox'
                  value={student._id}
                  onChange={handleStudentSelection}
                  checked={selectedStudents.includes(student._id)}
                  className='mr-2'
                />
                {student.email}
              </label>
            ))}
          </div>
        </div>

        <button
          type='submit'
          className='bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700'
        >
          {loading ? (
            <Loader.TailSpin
              type='ThreeDots'
              color='#fff'
              height={25}
              width={30}
            />
          ) : (
            'Create Class'
          )}
        </button>
      </form>
    </div>
  );
}

export default CreateClass;
