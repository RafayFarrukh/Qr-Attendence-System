import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';
import baseURL from '../../services/BaseURL';
import { toast } from 'react-toastify';

const StudentEditPage = () => {
  const { studentId } = useParams();
  const history = useNavigate();
  const [stdId, setStudentID] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const {
    stdId: initialStudentID,
    email: initialEmail,
    fullName: initialFullName,
  } = location.state || {};
  useEffect(() => {
    setStudentID(initialStudentID);
    setEmail(initialEmail);
    setFullName(initialFullName);
    console.log(studentId, 'studentIdstudentIdstudentId');
  }, [initialStudentID, initialEmail, initialFullName]);

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      await axiosInstance.patch(
        `${baseURL}/api/class/student/edit/${studentId}`,
        {
          stdId: stdId,
          email: email,
          fullName: fullName,
        },
      );
      setLoading(false);
      toast.success('Student updated successfully', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      await history('/allStudentsAdmin');
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data.message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  };

  return (
    <div className='container mx-auto mt-10'>
      <h1 className='text-2xl font-bold mb-4'>Edit Student</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <form
          onSubmit={handleSave}
          className='bg-white p-8 rounded-lg shadow-lg'
        >
          <div className='mb-4'>
            <label htmlFor='studentID' className='block font-medium'>
              Student ID
            </label>
            <input
              type='text'
              id='studentID'
              value={stdId}
              onChange={(e) => setStudentID(e.target.value)}
              className='border border-gray-400 p-2 w-full rounded-md'
              required
            />
          </div>
          <div className='mb-4'>
            <label htmlFor='firstName' className='block font-medium'>
              Email
            </label>
            <input
              type='email'
              id='firstName'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='border border-gray-400 p-2 w-full rounded-md'
              required
            />
          </div>
          <div className='mb-4'>
            <label htmlFor='lastName' className='block font-medium'>
              Full Name
            </label>
            <input
              type='text'
              id='lastName'
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className='border border-gray-400 p-2 w-full rounded-md'
              required
            />
          </div>
          <button
            className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600'
            type='submit'
          >
            Save
          </button>
        </form>
      )}
    </div>
  );
};

export default StudentEditPage;
