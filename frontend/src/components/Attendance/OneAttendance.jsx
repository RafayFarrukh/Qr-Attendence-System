import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const OneAttendance = () => {
  const location = useLocation();
  const attendanceItem = location.state?.attendanceItem;

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
          {attendanceItem &&
            attendanceItem.attendance.map((student) => (
              <tr key={student.id} className='border-b border-gray-300'>
                <td className='py-3 px-4'>{student.stdId}</td>
                <td className='py-3 px-4'>{student.fullName}</td>
                <td className='py-3 px-4'>
                  <span
                    className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                      student.status === 'present'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {student.status}
                  </span>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default OneAttendance;
