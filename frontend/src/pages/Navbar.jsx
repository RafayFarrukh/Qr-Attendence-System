import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../css/images/logo.png';
import { FiUser } from 'react-icons/fi';
const Navbar = ({ openModal, open }) => {
  return (
    <nav className='bg-white shadow-lg'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16'>
          <div className='flex'>
            <Link to='/home' className='flex-shrink-0 flex items-center'>
              <img className='h-8 w-auto' src={logo} alt='Logo' />
              <span className='ml-2 text-xl font-bold'>QR Code</span>
            </Link>
          </div>
          <div className='flex items-center'>
            <button
              onClick={openModal}
              className='flex items-center text-gray-800 hover:bg-gray-100 focus:ring-4 focus:ring-gray-300 font-lg rounded-lg text-lg px-5 py-2.5 ml-4 hover:text-gray-800 focus:text-gray-800 focus:outline-none transition duration-300'
            >
              <FiUser className='mr-2' size={20} strokeWidth={2} />
              Login
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
