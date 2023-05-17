import React, { useContext, useEffect } from 'react';
import { UserContext } from '../App';

import ScanLanding from '../css/images/ScanLanding.jpg';

const Landing = () => {
  const { state } = useContext(UserContext);

  useEffect(() => {
    console.log(state);
  }, []);

  const imgWidth = '1'; // Adjust the width value as needed
  const imgHeight = '198px'; // Adjust the height value as needed

  return (
    <div className='flex flex-col items-center   justify-center'>
      <h1 className='text-3xl font-bold mb-4'>Welcome</h1>
      <img
        src={ScanLanding}
        alt='QR Code'
        className={`w-full h-auto opacity-55`}
      />
    </div>
  );
};

export default Landing;
