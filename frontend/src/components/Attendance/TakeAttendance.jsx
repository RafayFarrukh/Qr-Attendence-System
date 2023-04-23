import React, { useState, useRef, useEffect, useContext } from 'react';
import { UserContext } from '../../App';
// import './TakeAttendance.css'
import axios from 'axios';
import axiosInstance from '../../services/axiosInstance';
import QRCode from 'react-qr-code';
import { useLocation, useParams } from 'react-router-dom';
import baseURL from '../../services/BaseURL';

const TakeAttendance = (
  { setQrText, qrText, currentDate, setCurrentDate },
  props,
) => {
  const { state } = useContext(UserContext);
  const [attendance, setAttendance] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  useEffect(() => {
    console.log(selectedDate, 'selected date in take attendance');
    setSelectedDate(currentDate);
  }, [currentDate, selectedDate]);
  const date = selectedDate;
  const year = date?.getFullYear();
  const month = date?.getMonth() + 1;
  const day = date?.getDate();
  const formattedDate = `${year}-${month?.toString().padStart(2, '0')}-${day
    ?.toString()
    .padStart(2, '0')}`;

  // const classId = props;
  const classId = localStorage.getItem('classId');

  // const [class, setClass] = useState("");
  const [text, setText] = useState('');

  useEffect(() => {
    console.log('in hte useEffect');
    // setSelectedDate(currentDate);

    axiosInstance
      .post(
        `${baseURL}/api/class/teacher/attendance/RealTimeAttendance/${classId}`,
        {
          date: formattedDate,
        },
      )
      .then((res) => {
        console.log(res.data.attendance, 'res data');
        setAttendance(res.data.attendance);
        // attendance = res.data.attendance;
      })
      .catch((res) => {});
  }, [formattedDate]);

  const [isChecked, setIsChecked] = useState([]);
  useEffect(() => {
    setIsChecked(
      attendance.map((student) => ({
        stdId: student.stdId,
        isChecked: student.status === 'present',
      })),
    );
  }, [attendance]);
  const handleCheckboxClick = (stdId) => {
    console.log('we are in on change', stdId);
    setIsChecked((prevList) =>
      prevList.map((student) => {
        try {
          console.log('current student:', student);
          console.log('should update:', student.stdId === stdId);
          return student.stdId === stdId
            ? { ...student, isChecked: !student.isChecked }
            : student;
        } catch (error) {
          console.log('Error:', error);
        }
      }),
    );
  };

  const submit = async (e) => {
    e.preventDefault();
    // e.target.reset();
    const timestamp = Date.now();

    const teacherId = state?.user?._id;
    const classId = localStorage.getItem('classId');
    const data1 = { classId, teacherId, timestamp };
    const data = JSON.stringify(data1);
    // setQrText(`Author: ${User.fullName}, Text: ${text}`);
    setQrText(data);

    // --download img
    const svg = document.getElementById('QRCode');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = 'QRCode';
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;

    // ---
  };
  return (
    <>
      <div className='flex flex-col lg:flex-row mt-9'>
        <div className='bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-full lg:w-80 p-8 pt-9 m-3 bg-hero-pattern bg-no-repeat bg-cover bg-center'>
          <form action='' onSubmit={submit} className='flex flex-col'>
            <label htmlFor='classId' className='font-bold mb-2 text-gray-800'>
              Enter Description
            </label>
            <input
              name='text'
              type='text'
              placeholder='input'
              onChange={(e) => setText(e.target.value)}
              required
              className='bg-gray-200 dark:bg-gray-800 rounded-lg py-2 px-3 mb-3 focus:outline-none focus:shadow-outline'
            />
            <button
              type='submit'
              onClick={submit}
              className='bg-sky-600 hover:bg-sky-300 text-black font-bold py-2 px-4 rounded'
            >
              Generate
            </button>
          </form>
          {qrText.length > 0 && (
            <QRCode id='QRCode' className='mt-5' value={qrText} />
          )}
        </div>
        <div className='flex-1 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-auto rounded-xl p-8 pt-9 m-3'>
          <h2 className='text-lg font-bold mb-4 text-gray-800'>
            Student Attendance
          </h2>
          <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
            <thead className='text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
              <tr>
                <th scope='col' className='py-3 px-6'>
                  Roll Number
                </th>
                <th scope='col' className='py-3 px-6'>
                  Student Name
                </th>
                <th scope='col' className='py-3 px-6'>
                  Marked
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Replace this with the actual attendance data */}
              {attendance.map((student, index) => (
                <tr className='border-b border-gray-200 dark:border-gray-700'>
                  <td className='py-4 px-6'>{student.stdId}</td>
                  <td className='py-4 px-6'>{student.fullName}</td>
                  <td className='py-4 px-6'>
                    <div className='flex items-center'>
                      <input
                        id={student.stdId}
                        type='checkbox'
                        className='hidden'
                        checked={
                          isChecked.find((s) => s.stdId === student.stdId)
                            ?.isChecked
                        }
                        onChange={() => handleCheckboxClick(student.stdId)}
                      />
                      <label
                        htmlFor={student.stdId}
                        className='flex items-center cursor-pointer'
                      >
                        <div className='relative'>
                          <div className='block bg-gray-600 w-12 h-6 rounded-full'></div>
                          <div
                            className={`${
                              isChecked.find((s) => s.stdId === student.stdId)
                                ?.isChecked
                                ? 'translate-x-6 bg-green-400'
                                : 'translate-x-0 bg-white'
                            } absolute left-0 top-0 w-6 h-6 rounded-full shadow-md transform transition-all duration-300`}
                          ></div>
                        </div>
                        <span className='ml-2'>
                          {isChecked.find((s) => s.stdId === student.stdId)
                            ?.isChecked
                            ? 'Present'
                            : 'Absent'}
                        </span>
                      </label>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default TakeAttendance;
