import { useState, useEffect } from 'react';
import baseURL from '../../services/BaseURL';
import axiosInstance from '../../services/axiosInstance';
import { useNavigate } from 'react-router-dom';
import * as Loader from 'react-loader-spinner';

function TotalClasses() {
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchClasses() {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `${baseURL}/api/class/teacher/totalclasses`,
        );
        const { classes } = response.data;
        console.log(classes);
        setClasses(classes);
        setLoading(false);
      } catch (error) {
        setLoading(false);

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

  // if (classes.length === 0) {
  //   return (
  //     <div className='overflow-x-auto'>
  //       <CircleSpinnerOverlay
  //         loading={loading}
  //         overlayColor='rgba(0, 0, 0, 0)'
  //         color='black'
  //         size='50'
  //       />
  //     </div>
  //   );
  // }

  return (
    <div className='overflow-x-auto'>
      {loading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '500px',
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
      )}
    </div>
  );
}

export default TotalClasses;
