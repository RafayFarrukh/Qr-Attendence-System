import React, { useState, useEffect } from 'react';
import axiosInstance from '../../services/axiosInstance';
import { useNavigate } from 'react-router-dom';
import * as Loader from 'react-loader-spinner';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import baseURL from '../../services/BaseURL';
import { Typography } from '@mui/material';
const EditProfile = () => {
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const _User = localStorage.getItem('Teacher');
  const User = JSON.parse(_User);

  const handleImageUpload = (e) => {
    const file1 = e.target.files[0];
    setFile(file1);
  };

  const handleProfilePictureUpdate = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'qrAttendance');
    data.append('cloud_name', 'dwgehqnsz');

    fetch('https://api.cloudinary.com/v1_1/dwgehqnsz/image/upload/', {
      method: 'post',
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setUrl(data.url);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    setLoading1(true);
    if (currentPassword && newPassword.length < 5) {
      setLoading1(false);

      setError('New password must be at least 5 characters long.');
      return;
    }
    const data = {
      currentPassword: currentPassword,
      newPassword: newPassword,
    };

    axiosInstance
      .patch(`${baseURL}/api/teacher/updatePassword`, data)
      .then((res) => {
        setLoading1(false);
        setCurrentPassword('');
        setNewPassword('');
        console.log(res);
        setError('');
        toast.success('Successfully Updated Password', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
        // Handle success or display a success message
      })
      .catch((err) => {
        setError(err.response.data.message);
        console.log(error);
        setLoading1(false);
        console.log(error, 'hhere');
        // Handle error or display an error message
      });
  };

  useEffect(() => {
    if (url) {
      const newPost = {
        image: url,
      };
      setLoading(true);

      axiosInstance
        .patch(`${baseURL}/api/teacher/updateProfile`, newPost)
        .then((data) => {
          console.log(data);
          const updatedTeacher = {
            ...User,
            image: url, // Assuming `url` contains the image URL
          };
          localStorage.setItem('Teacher', JSON.stringify(updatedTeacher));
          setLoading(false);

          navigate('/profile');
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [url]);

  return (
    <div className='flex flex-col h-screen bg-gray-100'>
      <div className='flex-1 p-10 flex justify-center items-center'>
        <div className='w-full max-w-md bg-white rounded-lg shadow-lg p-8'>
          <h2 className='text-2xl font-bold mb-6'>Update Password</h2>
          <form onSubmit={handleUpdatePassword}>
            <div className='mb-4'>
              <label
                htmlFor='currentPassword'
                className='text-gray-600 text-sm mb-2'
              >
                Current Password
              </label>
              <div className='relative'>
                <input
                  id='currentPassword'
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className='border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none'
                />
                <span
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer'
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <AiOutlineEyeInvisible size={18} />
                  ) : (
                    <AiOutlineEye size={18} />
                  )}
                </span>
              </div>
            </div>
            <div className='mb-4'>
              <label
                htmlFor='newPassword'
                className='text-gray-600 text-sm mb-2'
              >
                New Password
              </label>
              <div className='relative'>
                <input
                  id='newPassword'
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className='border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none'
                />
                <span
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer'
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <AiOutlineEyeInvisible size={18} />
                  ) : (
                    <AiOutlineEye size={18} />
                  )}
                </span>
              </div>
            </div>
            {error && (
              <Typography
                variant='body2'
                color='error'
                sx={{
                  mt: 'rem',
                  mb: '1rem',
                  textAlign: 'left',
                  fontSize: '1rem',
                }}
              >
                {error}
              </Typography>
            )}
            <button
              type='submit'
              className='bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline'
            >
              {loading1 ? (
                <Loader.TailSpin
                  type='ThreeDots'
                  color='#fff'
                  height={25}
                  width={30}
                />
              ) : (
                'Update Password'
              )}
            </button>
          </form>
        </div>
      </div>
      <div className='flex-1 p-10 flex justify-center items-center'>
        <div className='w-full max-w-md bg-white rounded-lg shadow-lg p-8'>
          <h2 className='text-2xl font-bold mb-6'>Update Profile Picture</h2>
          <div className='mb-4'>
            {file ? (
              <img
                className='uploadedImage h-96 w-96 mt-10 mx-auto rounded-lg'
                src={URL.createObjectURL(file)}
                alt=''
              />
            ) : (
              <div className='w-48 h-48 rounded-full bg-gray-300 mx-auto'></div>
            )}
          </div>
          <div className='mb-6'>
            <label
              htmlFor='imageUpload'
              className='text-gray-600 text-sm mb-2 underline cursor-pointer'
            >
              Update Profile Picture
            </label>
            <input
              id='imageUpload'
              type='file'
              accept='image/*'
              onChange={handleImageUpload}
              className='hidden'
            />
          </div>
          <button
            onClick={handleProfilePictureUpdate}
            className='bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline'
          >
            {loading ? (
              <Loader.TailSpin
                type='ThreeDots'
                color='#fff'
                height={25}
                width={30}
              />
            ) : (
              'Save Profile Picture'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
