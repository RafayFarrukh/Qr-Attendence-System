import React, { useState, useEffect, useRef, useContext } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { TiHome } from 'react-icons/ti';
import { AiFillPlayCircle } from 'react-icons/ai';
import { HiUsers } from 'react-icons/hi';
import SidebarLinkGroup from './SidebarLinkGroup';
import { UserContext } from '../../App';

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const { state } = useContext(UserContext);
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true',
  );
  const User = localStorage.getItem('Teacher');
  const _User = JSON.parse(User);
  useEffect(() => {
    console.log(_User, 'state  rafay sidear');
    // if (state?.user.admin) {
    if (_User?.admin) {
      setIsAdmin(true);
      console.log('admin agya');
    }
  }, [state]);
  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded);
    if (sidebarExpanded) {
      document.querySelector('body').classList.add('sidebar-expanded');
      // document.body.classList.add("sidebar-expanded");
    } else {
      document.querySelector('body').classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  return (
    <div>
      {/* Sidebar backdrop (mobile only) */}
      {/* <div
        className={`fixed inset-0 bg-slate-900 bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      ></div> */}

      {/* Sidebar */}
      <div
        id='sidebar'
        ref={sidebar}
        // className={`flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-screen overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-20 lg:sidebar-expanded:!w-64 2xl:!w-64 shrink-0 bg-slate-800 p-4 transition-all duration-200 ease-in-out ${
        //   sidebarOpen ? "translate-x-0" : "-translate-x-64"
        // }`}
        className={`flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-screen overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-20 lg:sidebar-expanded:!w-64  shrink-0 bg-slate-800 p-4 transition-all duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-64'
        }`}
      >
        {/* Sidebar header */}
        <div className='flex justify-between mb-10 pr-3 sm:px-2'>
          {/* Close button */}
          <button
            ref={trigger}
            className='lg:hidden text-slate-500 hover:text-slate-400'
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls='sidebar'
            aria-expanded={sidebarOpen}
          >
            <span className='sr-only'>Close sidebar</span>
            <svg
              className='w-6 h-6 fill-current'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z' />
            </svg>
          </button>
          {/* Logo */}
        </div>

        {/* Links */}
        <div className='space-y-8'>
          {/* Pages group */}
          <div>
            <h3 className='text-xs uppercase text-slate-500 font-semibold pl-3'>
              <span
                className='hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6'
                aria-hidden='true'
              >
                •••
              </span>
            </h3>
            <ul className='mt-3'>
              {/* Dashboard */}
              {isAdmin && (
                <div>
                  <SidebarLinkGroup
                    activecondition={
                      pathname === '/' || pathname.includes('Class')
                    }
                  >
                    {(handleClick, open) => {
                      return (
                        <React.Fragment>
                          <a
                            href='#0'
                            className={`block text-slate-200 hover:text-white truncate transition duration-150 ${
                              (pathname === '/' ||
                                pathname.includes('dashboard')) &&
                              'hover:text-slate-200'
                            }`}
                            onClick={(e) => {
                              e.preventDefault();
                              sidebarExpanded
                                ? handleClick()
                                : setSidebarExpanded(true);
                            }}
                          >
                            <div className='flex items-center justify-between'>
                              <div className='flex items-center'>
                                <TiHome />
                                <span className='text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200'>
                                  Class
                                </span>
                              </div>

                              <div className='flex shrink-0 ml-2'>
                                <svg
                                  className={`w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 ${
                                    open && 'rotate-180'
                                  }`}
                                  viewBox='0 0 12 12'
                                >
                                  <path d='M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z' />
                                </svg>
                              </div>
                            </div>
                          </a>
                          <div className='lg:hidden lg:sidebar-expanded:block 2xl:block'>
                            <ul className={`pl-9 mt-1 ${!open && 'hidden'}`}>
                              <li className='mb-1 last:mb-0'>
                                <NavLink
                                  end
                                  to='/createClass'
                                  className={({ isActive }) =>
                                    'block text-slate-400 hover:text-slate-200 transition duration-150 truncate ' +
                                    (isActive ? '!text-indigo-500' : '')
                                  }
                                >
                                  <span className='text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200'>
                                    Create Class
                                  </span>
                                </NavLink>
                              </li>
                              <li className='mb-1 last:mb-0'>
                                <NavLink
                                  end
                                  to='/allClasses'
                                  className='block text-slate-400 hover:text-slate-200 transition duration-150 truncate'
                                >
                                  <span className='text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200'>
                                    All Classes
                                  </span>
                                </NavLink>
                              </li>
                            </ul>
                          </div>
                        </React.Fragment>
                      );
                    }}
                  </SidebarLinkGroup>
                  <SidebarLinkGroup
                    activecondition={
                      pathname === '/' || pathname.includes('Teacher')
                    }
                  >
                    {(handleClick, open) => {
                      return (
                        <React.Fragment>
                          <a
                            href='#0'
                            className={`block text-slate-200 hover:text-white truncate transition duration-150 ${
                              (pathname === '/' ||
                                pathname.includes('dashboard')) &&
                              'hover:text-slate-200'
                            }`}
                            onClick={(e) => {
                              e.preventDefault();
                              sidebarExpanded
                                ? handleClick()
                                : setSidebarExpanded(true);
                            }}
                          >
                            <div className='flex items-center justify-between'>
                              <div className='flex items-center'>
                                <TiHome />
                                <span className='text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200'>
                                  Teachers
                                </span>
                              </div>

                              <div className='flex shrink-0 ml-2'>
                                <svg
                                  className={`w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 ${
                                    open && 'rotate-180'
                                  }`}
                                  viewBox='0 0 12 12'
                                >
                                  <path d='M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z' />
                                </svg>
                              </div>
                            </div>
                          </a>
                          <div className='lg:hidden lg:sidebar-expanded:block 2xl:block'>
                            <ul className={`pl-9 mt-1 ${!open && 'hidden'}`}>
                              <li className='mb-1 last:mb-0'>
                                <NavLink
                                  end
                                  to='/addTeachers'
                                  className={({ isActive }) =>
                                    'block text-slate-400 hover:text-slate-200 transition duration-150 truncate ' +
                                    (isActive ? '!text-indigo-500' : '')
                                  }
                                >
                                  <span className='text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200'>
                                    Add Teacher
                                  </span>
                                </NavLink>
                              </li>
                              <li className='mb-1 last:mb-0'>
                                <NavLink
                                  end
                                  to='/allTeachers'
                                  className='block text-slate-400 hover:text-slate-200 transition duration-150 truncate'
                                >
                                  <span className='text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200'>
                                    All Teachers
                                  </span>
                                </NavLink>
                              </li>
                            </ul>
                          </div>
                        </React.Fragment>
                      );
                    }}
                  </SidebarLinkGroup>
                  <SidebarLinkGroup
                    activecondition={
                      pathname === '/' || pathname.includes('Students')
                    }
                  >
                    {(handleClick, open) => {
                      return (
                        <React.Fragment>
                          <a
                            href='#0'
                            className={`block text-slate-200 hover:text-white truncate transition duration-150 ${
                              (pathname === '/' ||
                                pathname.includes('dashboard')) &&
                              'hover:text-slate-200'
                            }`}
                            onClick={(e) => {
                              e.preventDefault();
                              sidebarExpanded
                                ? handleClick()
                                : setSidebarExpanded(true);
                            }}
                          >
                            <div className='flex items-center justify-between'>
                              <div className='flex items-center'>
                                <TiHome />
                                <span className='text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200'>
                                  Students
                                </span>
                              </div>

                              <div className='flex shrink-0 ml-2'>
                                <svg
                                  className={`w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 ${
                                    open && 'rotate-180'
                                  }`}
                                  viewBox='0 0 12 12'
                                >
                                  <path d='M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z' />
                                </svg>
                              </div>
                            </div>
                          </a>
                          <div className='lg:hidden lg:sidebar-expanded:block 2xl:block'>
                            <ul className={`pl-9 mt-1 ${!open && 'hidden'}`}>
                              <li className='mb-1 last:mb-0'>
                                <NavLink
                                  end
                                  to='/addStudents'
                                  className={({ isActive }) =>
                                    'block text-slate-400 hover:text-slate-200 transition duration-150 truncate ' +
                                    (isActive ? '!text-indigo-500' : '')
                                  }
                                >
                                  <span className='text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200'>
                                    Add Students
                                  </span>
                                </NavLink>
                              </li>
                              <li className='mb-1 last:mb-0'>
                                <NavLink
                                  end
                                  to='/allStudentsAdmin'
                                  className='block text-slate-400 hover:text-slate-200 transition duration-150 truncate'
                                >
                                  <span className='text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200'>
                                    All Studentss
                                  </span>
                                </NavLink>
                              </li>
                            </ul>
                          </div>
                        </React.Fragment>
                      );
                    }}
                  </SidebarLinkGroup>
                </div>
              )}
              {/* E-Commerce */}
              <SidebarLinkGroup activecondition={pathname.includes('content')}>
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <a
                        href='#0'
                        className={`block text-slate-200 hover:text-white truncate transition duration-150 ${
                          pathname.includes('content') && 'hover:text-slate-200'
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center'>
                            <AiFillPlayCircle />
                            <span className='text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200'>
                              Courses
                            </span>
                          </div>
                          {/* Icon */}
                          <div className='flex shrink-0 ml-2'>
                            <svg
                              className={`w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 ${
                                open && 'rotate-180'
                              }`}
                              viewBox='0 0 12 12'
                            >
                              <path d='M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z' />
                            </svg>
                          </div>
                        </div>
                      </a>
                      <div className='lg:hidden lg:sidebar-expanded:block 2xl:block'>
                        <ul className={`pl-9 mt-1 ${!open && 'hidden'}`}>
                          {isAdmin && (
                            <>
                              <li className='mb-1 last:mb-0'>
                                <Link
                                  end
                                  to='/createCourse'
                                  className='block text-slate-400 hover:text-slate-200 transition duration-150 truncate'
                                >
                                  <span className='text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200'>
                                    Create Course
                                  </span>
                                </Link>
                              </li>
                              <li className='mb-1 last:mb-0'>
                                <Link
                                  end
                                  to='/adminAllCourses'
                                  className='block text-slate-400 hover:text-slate-200 transition duration-150 truncate'
                                >
                                  <span className='text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200'>
                                    All Courses
                                  </span>
                                </Link>
                              </li>
                            </>
                          )}

                          <li className='mb-1 last:mb-0'>
                            <Link
                              end
                              to='/allcourses'
                              className='block text-slate-400 hover:text-slate-200 transition duration-150 truncate'
                            >
                              <span className='text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200'>
                                Courses
                              </span>
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
              {/* Community */}
            </ul>
          </div>
          {/* More group */}
          <div>
            <h3 className='text-xs uppercase text-slate-500 font-semibold pl-3'>
              <span
                className='hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6'
                aria-hidden='true'
              >
                •••
              </span>
            </h3>
            <ul className='mt-3'>
              {/* Authentication */}
              {/* <SidebarLinkGroup>
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <a
                        href='#0'
                        className={`block text-slate-200 hover:text-white truncate transition duration-150 ${
                          open && 'hover:text-slate-200'
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center'>
                            <svg
                              className='shrink-0 h-6 w-6'
                              viewBox='0 0 24 24'
                            >
                              <path
                                className='fill-current text-slate-600'
                                d='M8.07 16H10V8H8.07a8 8 0 110 8z'
                              />
                              <path
                                className='fill-current text-slate-400'
                                d='M15 12L8 6v5H0v2h8v5z'
                              />
                            </svg>
                            <span className='text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200'>
                              Authentication
                            </span>
                          </div>
                         
                          <div className='flex shrink-0 ml-2'>
                            <svg
                              className={`w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 ${
                                open && 'rotate-180'
                              }`}
                              viewBox='0 0 12 12'
                            >
                              <path d='M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z' />
                            </svg>
                          </div>
                        </div>
                      </a>
                      <div className='lg:hidden lg:sidebar-expanded:block 2xl:block'>
                        <ul className={`pl-9 mt-1 ${!open && 'hidden'}`}>
                          <li className='mb-1 last:mb-0'>
                            <NavLink
                              end
                              to='/'
                              className='block text-slate-400 hover:text-slate-200 transition duration-150 truncate'
                            >
                              <span className='text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200'>
                                Reset Password
                              </span>
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup> */}
            </ul>
          </div>
        </div>

        {/* Expand / collapse button */}

        <div className='px-3 invisible md:visible py-2'>
          <button onClick={() => setSidebarExpanded(!sidebarExpanded)}>
            <span className='sr-only'>Expand / collapse sidebar</span>
            <svg
              className='w-6 h-6 fill-current sidebar-expanded:rotate-180'
              viewBox='0 0 24 24'
            >
              <path
                className='text-slate-400'
                d='M19.586 11l-5-5L16 4.586 23.414 12 16 19.414 14.586 18l5-5H7v-2z'
              />
              <path className='text-slate-600' d='M3 23H1V1h2z' />
            </svg>
          </button>
        </div>
      </div>
    </div>
    // </div>
  );
}

export default Sidebar;
