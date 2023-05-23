import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ openModal, open }) => {
  return (
    <div>
      <nav class='bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800'>
        <div class='flex flex-wrap justify-between items-center mx-auto max-w-screen-xl'>
          <Link to='/home' class='flex items-center'>
            {/* <img
              src="https://flowbite.com/docs/images/logo.svg"
              class="mr-3 h-6 sm:h-9"
              alt="Flowbite Logo"
            /> */}
            <span class='self-center text-xl font-semibold whitespace-nowrap dark:text-white'>
              Qr Code
            </span>
          </Link>
          <div class='flex items-center lg:order-2'>
            <Link
              to='/login'
              class='text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800'
            >
              Log in
            </Link>
          </div>
          <div class='flex items-center lg:order-2'>
            <button
              onClick={openModal}
              variant='outlined'
              className='text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800'
            >
              {' '}
              Log in Modal{' '}
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
