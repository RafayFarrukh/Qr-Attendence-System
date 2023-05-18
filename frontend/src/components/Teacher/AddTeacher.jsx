import React, { useState, useRef } from 'react';
import axios from 'axios';
import axiosInstance from '../../services/axiosInstance';
import baseURL from '../../services/BaseURL';
import { toast } from 'react-toastify';

const AddTeacher = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append('file', selectedFile);
    console.log(selectedFile, 'selectedFile'); // Check the value of selectedFile
    console.log(formData, 'formData'); // Check the value of formData
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    axiosInstance
      .post(`${baseURL}/api/auth/teacher/register/excel`, formData, config)
      .then((response) => {
        console.log(response.data, 'response');

        setSelectedFile(null);
        toast.success('Successfully Uploaded', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
        // Handle success response
      })
      .catch((error) => {
        toast.error(error.response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
        console.error(error, 'error');
        // Handle error response
      })
      .finally(() => {
        setSelectedFile(null); // Clear the selected file
        if (fileInputRef.current) {
          fileInputRef.current.value = ''; // Reset the file input value
        }
      });
  };

  return (
    <div className='flex flex-col items-center justify-center mt-10'>
      <input
        type='file'
        className='mb-4'
        onChange={handleFileChange}
        ref={fileInputRef}
      />
      <button
        className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
        onClick={handleUpload}
        // disabled={!selectedFile}
      >
        Upload
      </button>

      <div className='flex justify-center mt-10'>
        <form
          // onSubmit={handleAddStudents}
          className='bg-white p-8 rounded-lg shadow-lg w-96'
        >
          {/* Add students to class form */}
          <h2 className='text-2xl font-bold mb-8'>Add students to class</h2>
          {/* Rest of the form code... */}
        </form>
      </div>
    </div>
  );
};

export default AddTeacher;
