import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import axiosInstance from '../../services/axiosInstance';

const OneAttendance = () => {
  const location = useLocation();
  const attendanceItem = location.state?.attendanceItem;
  const classId = location.state?.id;
  const [modifiedAttendance, setModifiedAttendance] = useState(null);
  const navigate = useNavigate();

  const handleAttendanceStatusChange = (studentId, status) => {
    const updatedAttendance = {
      ...modifiedAttendance,
      attendance: modifiedAttendance.attendance.map((student) => {
        if (student.stdId === studentId) {
          return {
            ...student,
            status: status,
          };
        }
        return student;
      }),
    };
    setModifiedAttendance(updatedAttendance);
  };

  const handleSelectAll = (status) => {
    const updatedAttendance = {
      ...modifiedAttendance,
      attendance: modifiedAttendance.attendance.map((student) => ({
        ...student,
        status: status,
      })),
    };
    setModifiedAttendance(updatedAttendance);
  };

  const handleSaveAttendance = async () => {
    try {
      console.log(modifiedAttendance, classId, 'modified');
      await axiosInstance.patch('/api/class/teacher/attendance/edit', {
        students: modifiedAttendance.attendance,
        date: modifiedAttendance.date,
        ClassId: classId,
      });
      await navigate(`/attendancePicker/${classId}`);
      // Handle successful save
      // You can also reset the modifiedAttendance state if needed
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  useEffect(() => {
    setModifiedAttendance(attendanceItem);
  }, [attendanceItem]);

  return (
    <div>
      <h2 className='text-2xl font-bold mb-4'>Attendance Details</h2>
      <table className='min-w-full bg-white border border-gray-300'>
        <thead>
          <tr>
            <th className='py-3 px-4 bg-gray-600 text-white font-medium text-left'>
              Student ID
            </th>
            <th className='py-3 px-4 bg-gray-600 text-white font-medium text-left'>
              Name
            </th>
            <th className='py-3 px-4 bg-gray-600 text-white font-medium text-left'>
              Attendance
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className='py-3 px-4'>Select All</td>
            <td className='py-3 px-4'></td>
            <td className='py-3 px-4'>
              {/* <div className='flex items-center'>
                <label className='inline-flex items-center'>
                  <input
                    type='radio'
                    name='allAttendance'
                    value='present'
                    checked={modifiedAttendance?.attendance.every(
                      (student) => student.status === 'present',
                    )}
                    onChange={() => handleSelectAll('present')}
                    className='form-radio h-4 w-4 text-green-500'
                  />
                  <span className='ml-2 text-gray-700'>All Present</span>
                </label>
                <label className='inline-flex items-center ml-4'>
                  <input
                    type='radio'
                    name='allAttendance'
                    value='absent'
                    checked={modifiedAttendance?.attendance.every(
                      (student) => student.status === 'absent',
                    )}
                    onChange={() => handleSelectAll('absent')}
                    className='form-radio h-4 w-4 text-red-500'
                  />
                  <span className='ml-2 text-gray-700'>All Absent</span>
                </label>
              </div> */}
            </td>
          </tr>
          {modifiedAttendance &&
            modifiedAttendance.attendance.map((student) => (
              <tr key={student._id} className='border-b border-gray-300'>
                <td className='py-3 px-4'>{student.stdId}</td>
                <td className='py-3 px-4'>{student.fullName}</td>
                <td className='py-3 px-4'>
                  <div className='flex items-center'>
                    <label className='inline-flex items-center'>
                      <input
                        type='radio'
                        value='present'
                        checked={student.status === 'present'}
                        onChange={() =>
                          handleAttendanceStatusChange(student.stdId, 'present')
                        }
                        className='form-radio h-4 w-4 text-green-500'
                      />
                      <span className='ml-2 text-gray-700'>Present</span>
                    </label>
                    <label className='inline-flex items-center ml-4'>
                      <input
                        type='radio'
                        value='absent'
                        checked={student.status === 'absent'}
                        onChange={() =>
                          handleAttendanceStatusChange(student.stdId, 'absent')
                        }
                        className='form-radio h-4 w-4 text-red-500 ml-6'
                      />
                      <span className='ml-2 text-gray-700'>Absent</span>
                    </label>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <button
        onClick={handleSaveAttendance}
        className='mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded'
      >
        Save Attendance
      </button>
    </div>
  );
};

export default OneAttendance;
