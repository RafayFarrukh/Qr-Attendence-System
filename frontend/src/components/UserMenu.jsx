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
            <li className='flex items-center'>
              <HiUserCircle className='text-indigo-500 mr-2' />
              <Link
                className='flex font-medium text-sm text-indigo-500 hover:text-indigo-600'
                to='/profile'
              >
                Profile
              </Link>
            </li>
          </MenuItem>
          <MenuItem id='basic-menu' onClick={handleClose}>
            <li className='flex items-center'>
              <HiLogout className='text-indigo-500 mr-2' />
              <Link
                to='/home'
                onClick={() => {
                  dispatch({ type: 'CLEAR' });
                  localStorage.removeItem('Teacher');
                  localStorage.removeItem('Token');
                  window.location.reload();
                }}
                className='flex font-medium text-sm text-indigo-500 hover:text-indigo-600'
              >
                Logout
              </Link>
            </li>
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default UserMenu;
