import React, { useEffect, useState, useContext } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { UserContext } from '../../App';
import axios from 'axios';
import axiosInstance from '../../services/axiosInstance';
import BaseURL from '../../services/BaseURL';

const AttendancePicker = () => {
  const { state } = useContext(UserContext);
  const [attendance, setAttendance]=useState([])
  // const attendance = [];
  // const attendance = [
  //   { id: 1, name: 'John Doe', status: 'Present', date: '04-17-2023' },
  //   { id: 2, name: 'Jane Smith', status: 'Absent', date: '04-17-2023' },
  //   { id: 3, name: 'Bob Brown', status: 'Present', date: '04-18-2023' },
  //   { id: 4, name: 'Alice Green', status: 'Absent', date: '04-18-2023' },
  //   // add more data here
  // ];
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const filteredAttendance = attendance?.filter((item) => {
    // Convert date from string to Date object
    const attendanceDate = new Date(item.date);
    // return attendanceDate;
    return attendanceDate?.toDateString() === selectedDate?.toDateString();
  });
  const date = selectedDate;
  const year = date?.getFullYear();
  const month = date?.getMonth() + 1;
  const day = date?.getDate();
  const formattedDate = `${year}-${month?.toString().padStart(2, '0')}-${day
    ?.toString()
    .padStart(2, '0')}`;

  useEffect(() => {
    console.log(formattedDate);
    axiosInstance
      .post(
        `${BaseURL}/api/class/teacher/attendance/attendance/${state?.classId}`,
        { date: formattedDate },
      )
      .then((res) => {
        setAttendance(res.data.attendance)
        console.log(res.data.attendance);
        // attendance = res.data.attendance;
      }).catch((e)=>{
        console.log(e,"error in catch")
      })
      
  }, [formattedDate]);
  return (
    // <div className='w-full max-w-md'>
    <>
      <div className='w-full max-w-md'>
        <DatePicker
          className='block appearance-none w-full mt-2 bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline'
          selected={selectedDate}
          onChange={handleDateChange}
          placeholderText='Select date'
        />
        <div className='absolute top-0 right-0 mt-2 mr-2'>
          <svg
            className='h-4 w-4 fill-current text-gray-400'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 20 20'
          >
            <path
              fill-rule='evenodd'
              d='M10 12a2 2 0 100-4 2 2 0 000 4zm-7.071 1.929a1 1 0 001.414 1.414L10 11.414l5.657 5.657a1 1 0 001.414-1.414L11.414 10l5.657-5.657a1 1 0 10-1.414-1.414L10 8.586 4.343 2.929a1 1 0 00-1.414 1.414L8.586 10l-5.657 5.657z'
              clip-rule='evenodd'
            />
          </svg>
        </div>
      </div>
      <div>
        <h2 className='text-xl font-bold mt-4'>
          Attendance for {selectedDate && selectedDate.toLocaleDateString()}
        </h2>
        {/* Display attendance of selected date */}
        <div className='w-full overflow-hidden rounded-lg shadow-md'>
          <div className='w-full overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='bg-gray-100 border-b-2 border-gray-300'>
                  <th className='px-6 py-3 text-sm font-bold text-left text-gray-600 uppercase tracking-wider'>
                    Name
                  </th>
                    <th className='px-6 py-3 text-sm font-bold text-left text-gray-600 uppercase tracking-wider'>
                    Student Id
                  </th>
                  <th className='px-6 py-3 text-sm font-bold text-left text-gray-600 uppercase tracking-wider'>
                    Status
                  </th>
                  <th className='px-6 py-3 text-sm font-bold text-left text-gray-600 uppercase tracking-wider'>
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {filteredAttendance ? (
                  filteredAttendance.map((item) => (
                    <tr key={item._id}>
                      <div className='ml-4 mt-4'>
                        <div className='text-sm font-medium text-gray-900'>
                          {item.fullName}
                        </div>
                      </div>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {item.stdId}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span
                          className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                            item.status === 'Present'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {item.date}
                      </td>
                    </tr>
                  ))
                ) : (
                  <div className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    No Attendance available for current date
                  </div>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* </div> */}
    </>
  );
};

export default AttendancePicker;
