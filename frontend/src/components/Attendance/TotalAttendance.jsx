import React, { useEffect, useState } from 'react';
import axios from 'axios';
import baseURL from '../../services/BaseURL';
import axiosInstance from '../../services/axiosInstance';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  RiCheckboxCircleLine,
  RiCheckboxBlankLine,
  RiFileList3Line,
  RiUserLine,
} from 'react-icons/ri';
import { IoCloseCircleOutline } from 'react-icons/io5';
import * as Loader from 'react-loader-spinner';
import { Typography } from '@mui/material';
import OneAttendance from './OneAttendance';

const AttendanceList = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const location = useLocation();
  const [students, setTotalStudents] = useState(0);
  const navigate = useNavigate();
  const split = location.pathname.split('/');
  const id = split[2];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        setLoading(true);

        const response = await axiosInstance.get(
          `${baseURL}/api/class/teacher/attendance/totalAttendances/${id}`,
        );
        console.log(response.data.attendance);
        setError('');
        setAttendanceData(response.data.attendance);
        console.log(attendanceData[0].attendance.length, 'attendancedata');
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(error.response.data.message);
        console.error(error);
      }
    };

    fetchAttendanceData();
  }, []);

  const totalStudents = attendanceData[0]?.attendance?.length;

  const formatDate = (dateString) => {
    const options = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };
    return new Date(dateString).toLocaleString('en-US', options);
  };

  const handleAttendanceClick = (attendanceItem) => {
    console.log(attendanceItem, 'attendanceItem in handleAttendanceClick');
    <OneAttendance attendanceItem={attendanceItem} />;
    navigate(`/oneAttendance`, { state: { attendanceItem } });
  };

  return (
    <div className='container mx-auto py-8'>
      <div className='flex items-center mb-4 ml-3'>
        <RiFileList3Line className='text-2xl mr-2' />
        <h1 className='text-3xl font-bold'>Attendance List</h1>
        <div className='ml-auto flex items-center'>
          <RiUserLine className='text-xl mr-1' />
          Total Students: <span className='ml-1'> </span>
          <span className='text-lg mr-5 text-lg font-bold'>
            {totalStudents}
          </span>
        </div>
      </div>
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
              <th className='py-3 px-4 bg-gray-600 text-white font-medium text-left'>
                Date
              </th>
              <th className='py-3 px-4 bg-gray-600 text-white font-medium text-left'>
                Students Present
              </th>
              <th className='py-3 px-4 bg-gray-600 text-white font-medium text-left'>
                Students Absent
              </th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((attendanceItem) => (
              <tr
                key={attendanceItem.date}
                className='cursor-pointer hover:bg-gray-100 transform transition-all duration-300'
                onClick={() => handleAttendanceClick(attendanceItem)}
              >
                <td className='py-3 px-4 border-b border-gray-300'>
                  {formatDate(attendanceItem.date)}
                </td>
                <td className='py-3 px-4 border-b border-gray-300'>
                  <div className='flex items-center text-lg font-bold'>
                    {attendanceItem.attendance.filter(
                      (student) => student.status === 'present',
                    ).length > 0 ? (
                      <RiCheckboxCircleLine className='text-green-500 mr-1 ' />
                    ) : (
                      <RiCheckboxBlankLine className='text-gray-400 mr-1' />
                    )}
                    {
                      attendanceItem.attendance.filter(
                        (student) => student.status === 'present',
                      ).length
                    }
                  </div>
                </td>
                <td className='py-3 px-4 border-b border-gray-300'>
                  <div className='flex items-center'>
                    {attendanceItem.attendance.filter(
                      (student) => student.status === 'absent',
                    ).length > 0 ? (
                      <IoCloseCircleOutline className='text-red-500 mr-1' />
                    ) : (
                      <RiCheckboxBlankLine className='text-gray-400 mr-1' />
                    )}
                    {
                      attendanceItem.attendance.filter(
                        (student) => student.status === 'absent',
                      ).length
                    }
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          {error && (
            <Typography
              variant='body2'
              color='error'
              sx={{
                mt: '1rem',
                textAlign: 'left',
                fontSize: '1rem',
                ml: '1rem',
              }}
            >
              {error}
            </Typography>
          )}
        </table>
      )}
    </div>
  );
};

export default AttendanceList;
