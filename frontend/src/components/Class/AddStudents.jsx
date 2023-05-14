import { useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';
import baseURL from '../../services/BaseURL';
import { useLocation } from 'react-router-dom';
function AddStudentsToClass() {
  const location = useLocation();
  const classId = location.pathname.split('/')[2];
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');

  const handleAddStudents = async (event) => {
    event.preventDefault();
    console.log(classId);
    try {
      const response = await axiosInstance.post(
        `${baseURL}/api/class/teacher/addStudents/${classId}`,
        { username },
      );
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className='flex justify-center mt-10'>
      <form
        onSubmit={handleAddStudents}
        className='bg-white p-8 rounded-lg shadow-lg w-96'
      >
        <h2 className='text-2xl font-bold mb-8'>Add students to class</h2>
        {message && (
          <div className='text-red-500 mb-8 text-center'>{message}</div>
        )}
        <div className='mb-8'>
          <label
            htmlFor='username'
            className='block text-gray-700 font-bold mb-5'
          >
            Student Id
          </label>
          <input
            type='text'
            name='username'
            id='username'
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className='border border-gray-400 p-2 w-full rounded-lg'
            required
          />
        </div>
        <button
          type='submit'
          className='bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 w-full'
        >
          Add Students
        </button>
      </form>
    </div>
  );
}

export default AddStudentsToClass;
