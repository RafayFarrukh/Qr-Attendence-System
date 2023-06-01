import React, { useContext } from 'react';
import { UserContext } from '../../App';
import { FaUser, FaEnvelope } from 'react-icons/fa';

const Profile = () => {
  const { state } = useContext(UserContext);
  const teacher = JSON.parse(localStorage.getItem('Teacher'));
  //   const teacher = state?.user;

  const handleEdit = () => {
    // Handle edit button click
    // Add your logic here to navigate to the edit profile page or show an edit form
  };

  return (
    <div className='container mx-auto mt-10'>
      <div className='flex flex-col items-center'>
        <div className='bg-white rounded-lg shadow-lg p-8 mb-8'>
          <img
            src='http://avatars.dicebear.com/api/croodles/stefan.svg' // Assuming you have the profile image URL in the teacher object
            alt='Profile'
            className='w-24 h-24 rounded-full mx-auto mb-4'
          />
          <h1 className='text-2xl font-bold text-gray-800 mb-2 flex items-center'>
            <FaUser className='mr-2 text-xl' /> {teacher?.fullName}
          </h1>
          <p className='text-gray-600 text-base mb-4 flex items-center'>
            <FaEnvelope className='mr-2 text-lg' /> {teacher?.email}
          </p>
          <button
            onClick={handleEdit}
            className='bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline'
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
