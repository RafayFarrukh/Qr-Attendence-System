import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { UserContext } from '../App';
import { HiUserCircle, HiLogout } from 'react-icons/hi';

const UserMenu = () => {
  const _User = localStorage.getItem('Teacher');
  const User = JSON.parse(_User);
  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const { dispatch } = useContext(UserContext);

  return (
    <div className='relative inline-flex'>
      <div>
        <Button
          id='basic-button'
          onClick={handleClick}
          className='inline-flex justify-center items-center group'
        >
          <div className='flex items-center truncate'>
            {User.image ? (
              <img
                src={User.image}
                alt='Profile'
                className='w-8 h-8 rounded-full mr-2'
              />
            ) : (
              <HiUserCircle className='w-8 h-8 rounded-full mr-2 text-indigo-500' />
            )}
            <span className='truncate ml-2 text-sm font-medium group-hover:text-slate-800'>
              {User.email}
            </span>
            <svg
              className='w-3 h-3 shrink-0 ml-1 fill-current text-slate-400'
              viewBox='0 0 12 12'
            >
              <path d='M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z' />
            </svg>
          </div>
        </Button>

        <Menu
          anchorEl={anchorEl}
          open={isOpen}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
            marginRight: '1rem',
          }}
        >
          <MenuItem id='basic-menu'>
            <Link
              className='flex items-center hover:text-indigo-600'
              to='/profile'
            >
              <HiUserCircle className=' mr-2' />
              <div className='flex font-medium text-sm ' to='/profile'>
                Profile
              </div>
            </Link>
          </MenuItem>
          <MenuItem id='basic-menu' onClick={handleClose}>
            <Link
              className='flex items-center hover:text-indigo-600'
              to='/home'
              onClick={() => {
                dispatch({ type: 'CLEAR' });
                localStorage.removeItem('Teacher');
                localStorage.removeItem('Token');
                window.location.reload();
              }}
            >
              <HiLogout className='mr-2' />
              <div
                // to='/home'
                // onClick={() => {
                //   dispatch({ type: 'CLEAR' });
                //   localStorage.removeItem('Teacher');
                //   localStorage.removeItem('Token');
                //   window.location.reload();
                // }}
                className='flex font-medium text-sm '
              >
                Logout
              </div>
            </Link>
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default UserMenu;
