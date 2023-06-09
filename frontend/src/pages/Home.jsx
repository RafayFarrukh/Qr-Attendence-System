import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import LoginModal from '../Authentication/LoginModal';
import scanningImage from '../css/images/scanning.gif';
import aboutImage from '../css/images/image.gif';

const Home = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    // Delayed animation of content blocks
    const timer = setTimeout(() => {
      setContentVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <header>
        <Navbar
          openModal={handleModalOpen}
          open={modalOpen}
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }}
        />
      </header>
      {modalOpen && <LoginModal open={modalOpen} onClose={handleModalClose} />}
      <div className='flex flex-col items-center justify-center mt-10'>
        <motion.img
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='w-96 h-auto'
          src={scanningImage}
          alt='Scanning QR'
        />

        <h1 className='mt-10 text-4xl font-bold text-gray-900'>
          QR-Based Attendance System
        </h1>

        <p className='mt-4 text-lg text-gray-700'>
          Scan the QR code to mark your attendance in real time
        </p>

        <div className='mt-8 text-center'>
          {/* {contentVisible && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className='mb-8'
            >
              <h2 className='text-2xl font-bold text-gray-900'>
                About Our App
              </h2>
              <p className='mt-2 text-gray-700'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
                ullamcorper nulla vitae sapien pulvinar, et rutrum felis
                ullamcorper. Sed feugiat placerat neque, nec gravida eros
                interdum et.
              </p>
            </motion.div>
          )} */}

          {contentVisible && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <h2 className='text-2xl font-bold text-gray-900'>
                Scanning QR Code
              </h2>
              <p className='mt-2 text-gray-700'>
                Scanning the QR code will mark your attendance.
              </p>
              <motion.img
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 1.5 }}
                className='mt-4 w-48 h-auto mx-auto rounded-full shadow-lg'
                src={aboutImage}
                alt='Scanning QR'
              />
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
