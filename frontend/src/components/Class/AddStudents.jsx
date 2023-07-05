import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';
import baseURL from '../../services/BaseURL';
import { useLocation } from 'react-router-dom';
import * as Loader from 'react-loader-spinner';
import { toast } from 'react-toastify';
import { BsFillTrashFill } from 'react-icons/bs';

function AddStudentsToClass(user) {
  const location = useLocation();
  const classId = location.pathname.split('/')[2];
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [loadingRemove, setLoadingRemove] = useState(false);

  const handleAddStudents = async (event) => {
    event.preventDefault();
    console.log(classId);
    try {
      setLoading(true);
      await axiosInstance
        .post(`${baseURL}/api/class/teacher/addStudents/${classId}`, {
          username,
        })
        .then((er) => {
          console.log('success fronnted', er);
          setUsername('');
          toast.success('Successfully Added Student', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
          setLoading(false);
        })
        .catch((e) => {
          setLoading(false);
          toast.error(e.response.data.message, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
        });
      // setMessage(response.data.message);
    } catch (error) {
      toast.error(error.message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
      });
      setMessage(error.message);
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading1(true);

      const response = await axiosInstance.get(
        `${baseURL}/api/class/teacher/class/${classId}/students`,
      );
      console.log(students, 'students');
      setStudents(response.data.foundStudents);
      setLoading1(false);
    } catch (error) {
      setLoading1(false);

      console.error(error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []); // Fetch students on component mount
  const handleRemoveStudent = async (studentId) => {
    try {
      setLoadingRemove(true);
      await axiosInstance.delete(
        `${baseURL}/api/class/teacher/class/${classId}/student/${studentId}`,
      );
      toast.success('Student removed from class', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
      });
      fetchStudents(); // Refresh the student list
      setLoadingRemove(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to remove student from class', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
      });
      setLoadingRemove(false);
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
            Student Email
          </label>
          <input
            type='email'
            name='email'
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
          {loading ? (
            <div className='flex items-center justify-center'>
              <Loader.TailSpin
                type='ThreeDots'
                color='#fff'
                height={25}
                width={30}
              />
            </div>
          ) : (
            'Add Students'
          )}
        </button>
      </form>
      <div className='mt-10 ml-5'>
        <h2 className='text-2xl font-bold mb-4'>Students Enrolled in Class</h2>
        <table className='border border-gray-400 w-full'>
          <thead>
            <tr className='bg-gray-200'>
              <th className='border border-gray-400 p-2'>Student Id</th>
              <th className='border border-gray-400 p-2'>Full Name</th>
              <th className='border border-gray-400 p-2'>Email</th>
            </tr>
          </thead>
          <tbody>
            {loading1 ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '400px',
                  left: '300px',
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
              students?.map?.((student) => (
                <tr key={student._id} className='bg-white'>
                  <td className='border border-gray-400 p-2'>
                    {student.stdId}
                  </td>
                  <td className='border border-gray-400 p-2'>
                    {student.fullName}
                  </td>
                  <td className='border border-gray-400 p-2'>
                    {student.email}
                  </td>
                  <td className='border border-gray-400 p-2'>
                    <button
                      className='flex items-center justify-center text-red-500 hover:text-red-700'
                      onClick={() => handleRemoveStudent(student._id)}
                      // disabled={loadingRemove}
                    >
                      {/* {loadingRemove ? (
                        <Loader.TailSpin
                          type='ThreeDots'
                          color='black'
                          height={20}
                          width={20}
                        />
                      ) : ( */}
                      <BsFillTrashFill />
                      {/* )} */}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AddStudentsToClass;
