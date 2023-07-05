import React, { createContext, useEffect, useReducer, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './Authentication/Login';
import Signup from './Authentication/Signup';
import './css/style.css';
import { ToastContainer } from 'react-toastify';
import Header from './pages/Header';
import Landing from './pages/Landing';
import Home from './pages/Home';
import { useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import { reducer, initialState } from './reducers/userReducer';
import AllCourses from './components/Courses/AllCourses';
import OneCourse from './components/Courses/OneCourse';
import TakeAttendance from './components/Attendance/TakeAttendance';
import ShowAttendance from './components/Attendance/ShowAttendance';
import AttendancePicker from './components/Attendance/AttendancePicker';
import TotalAttendance from './components/Attendance/TotalAttendance';
import CreateClass from './components/Class/CreateClass';
import CreateCourse from './components/Courses/CreateCourse';
import TotalClasses from './components/Class/TotalClasses';
import AddStudents from './components/Class/AddStudents';
import AddTeacher from './components/Teacher/AddTeacher';
import AllTeachers from './components/Teacher/AllTeachers';
import CreateStudents from './components/Students/CreateStudent';
import AllStudentsAdmin from './components/Students/AllStudentsAdmin';
import AdminAllCourses from './components/Courses/AdminAllCourses';
import LoginModal from './Authentication/LoginModal';
import Profile from './components/Teacher/Profile';
import EditProfile from './components/Teacher/EditProfile';
import OneAttendance from './components/Attendance/OneAttendance';
import CourseEditPage from './components/Courses/CourseEdit';
export const UserContext = createContext();
function App() {
  const navigate = useNavigate();
  const user = localStorage.getItem('Teacher');
  const [qrText, setQrText] = useState('');
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [currentDate, setCurrentDate] = useState();
  useEffect(() => {
    setCurrentDate(new Date());
    // const user = JSON.parse(localStorage.getItem("Teacher"));
    // const token = localStorage.getItem("Token");
    // if (user) {
    //   dispatch({ type: "USER", payload: user });
    // }
    // if (token) {
    //   dispatch({ type: "FETCH_TOKEN", payload: token });
    // }
  }, []);
  React.useEffect(() => {
    if (!user) {
      navigate('/home');
    } else if (user) {
      console.log(state);
    }
  }, []);
  return (
    <>
      <UserContext.Provider value={{ state, dispatch }}>
        <div className='flex h-screen overflow-hidden'>
          {user ? (
            <Sidebar
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          ) : (
            <></>
          )}
          <div className='relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden'>
            {user ? (
              <Header
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
            ) : (
              <></>
            )}
            <Routes>
              {/* class */}
              <Route path='/createClass' element={<CreateClass />} />
              <Route path='/allClasses' element={<TotalClasses />} />
              <Route
                path='/edit-class/:id'
                element={<AddStudents user={user} />}
              />
              {/* teachher */}
              <Route path='/addTeachers' element={<AddTeacher />} />
              <Route path='/profile' element={<Profile />} />
              <Route path='/edit-profile' element={<EditProfile />} />
              <Route path='/allTeachers' element={<AllTeachers />} />
              <Route path='/addStudents' element={<CreateStudents />} />
              <Route path='/allStudentsAdmin' element={<AllStudentsAdmin />} />

              <Route path='/home' element={<Home />} />
              {/* course */}
              <Route path='/createCourse' element={<CreateCourse />} />
              <Route path='/allcourses' element={<AllCourses />} />
              <Route path='/adminAllCourses' element={<AdminAllCourses />} />
              <Route
                path='/edit-course/:courseId'
                element={<CourseEditPage />}
              />
              <Route path='/onecourse/:id' element={<OneCourse />} />
              <Route
                path='/takeAttendance'
                element={
                  <TakeAttendance
                    setQrText={setQrText}
                    qrText={qrText}
                    currentDate={currentDate}
                    setCurrentDate={setCurrentDate}
                  />
                }
              />
              <Route path='/showAttendance' element={<ShowAttendance />} />
              <Route path='/oneAttendance' element={<OneAttendance />} />
              <Route
                path='/attendancePicker/:id'
                element={<TotalAttendance />}
              />
              <Route exact path='/login' element={<Login />} />
              <Route exact path='/loginModal' element={<LoginModal />} />
              <Route exact path='/signup' element={<Signup />} />
              <Route exact path='/' element={<Landing />} />
            </Routes>
            <ToastContainer
              position='top-right'
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme='colored'
            />
          </div>
        </div>
      </UserContext.Provider>
    </>
  );
}

export default App;
