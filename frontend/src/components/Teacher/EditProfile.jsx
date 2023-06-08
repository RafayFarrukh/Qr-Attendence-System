import React, { useState, useEffect } from 'react';
import axiosInstance from '../../services/axiosInstance';
import { useNavigate } from 'react-router-dom';
import * as Loader from 'react-loader-spinner';

const EditProfile = () => {
  const [loading, setLoading] = useState(false);

  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');
  const navigate = useNavigate();
  const _User = localStorage.getItem('Teacher');
  const User = JSON.parse(_User);
  const handleImageUpload = (e) => {
    const file1 = e.target.files[0];
    setFile(file1);
  };

  const handleSaveProfile = (e) => {
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

  useEffect(() => {
    if (url) {
      const newPost = {
        image: url,
      };
      setLoading(true);

      axiosInstance
        .patch('http://localhost:5000/api/teacher/updateProfile', newPost)
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
    <div className='container mx-auto mt-10'>
      <div className='flex flex-col items-center'>
        <div className='bg-white rounded-lg shadow-lg p-8 mb-8'>
          <div className='mb-4'>
            {file ? (
              <img
                className='uploadedImage h-96 w-96 mt-10 mr-10 float-right rounded-lg'
                src={URL.createObjectURL(file)}
                alt=''
              />
            ) : (
              <div className='w-24 h-24 rounded-full bg-gray-300 mx-auto'></div>
            )}
          </div>
          <label
            htmlFor='imageUpload'
            className='text-gray-600 text-sm mb-2 underline cursor-pointer'
          >
            Upload Image
          </label>
          <input
            id='imageUpload'
            type='file'
            accept='image/*'
            onChange={handleImageUpload}
            className='hidden'
          />
          {/* Other profile fields for editing */}
          {/* ... */}
          <button
            onClick={handleSaveProfile}
            // disabled={!url}
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
              'Save Profile'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
