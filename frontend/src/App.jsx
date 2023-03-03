import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./Authentication/Login";
import Signup from "./Authentication/Signup";
import "./css/style.css";
import { ToastContainer } from "react-toastify";
import Header from "./pages/Header";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import { useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
function App() {
  const navigate = useNavigate();
  const user = localStorage.getItem("Teacher");
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // React.useEffect(() => {
  //   if (!user) {
  //     navigate("/login");
  //   }
  // }, []);
  return (
    <>
      <div className="flex h-screen overflow-hidden">
        {user ? (
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        ) : (
          <></>
        )}
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          {user ? (
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          ) : (
            <></>
          )}

          <Routes>
            <Route path="/home" element={<Home />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/signup" element={<Signup />} />
            <Route exact path="/" element={<Landing />} />
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </div>
      </div>
    </>
  );
}

export default App;
