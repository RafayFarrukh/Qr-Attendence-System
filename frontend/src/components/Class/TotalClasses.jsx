import { useState, useEffect } from 'react';
import baseURL from '../../services/BaseURL';
import axiosInstance from '../../services/axiosInstance';
import { useNavigate } from 'react-router-dom';
function TotalClasses() {
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchClasses() {
      try {
        const response = await axiosInstance.get(
          `${baseURL}/api/class/teacher/totalclasses`,
        );
        const { classes } = response.data;
        console.log(classes);
        setClasses(classes);
      } catch (error) {
        setError('An error occurred while fetching classes');
      }
    }
    fetchClasses();
  }, []);
  const handleEdit = (classId) => {
    navigate(`/edit-class/${classId}`);
  };

  if (error) {
    return <div className='text-red-500'>{error}</div>;
  }

  if (classes.length === 0) {
    return <div className='text-gray-500'>No classes found</div>;
  }

  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full table-auto border-collapse border border-gray-200'>
        <thead>
          <tr className='bg-gray-200 text-gray-700 uppercase text-sm leading-normal'>
            <th className='py-3 px-6 text-left'>Course Code</th>
            <th className='py-3 px-6 text-left'>Course Name</th>
            <th className='py-3 px-6 text-left'>Teacher Email</th>
            <th className='py-3 px-6 text-left'>Total Students</th>
            <th className='py-3 px-6 text-left'>Edit</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((class_) => (
            <tr
              key={class_._id}
              className='border-b border-gray-200 hover:bg-gray-100'
            >
              <td className='py-3 px-6 text-left whitespace-nowrap'>
                {class_.courseDetails.courseCode}
              </td>
              <td className='py-3 px-6 text-left whitespace-nowrap'>
                {class_.courseDetails.courseName}
              </td>
              <td className='py-3 px-6 text-left whitespace-nowrap'>
                {class_.teacher.email}
              </td>
              <td className='py-3 px-6 text-left whitespace-nowrap'>
                Total Students: {class_.students.length}
              </td>

              <td className='py-3 px-6 text-left whitespace-nowrap'>
                <button
                  className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                  onClick={() => handleEdit(class_._id)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TotalClasses;
