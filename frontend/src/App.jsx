import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./Authentication/Login";
import "./css/style.css";
import Header from "./pages/Header";
import Landing from "./pages/Landing";
import { useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
function App() {
  const navigate = useNavigate();
  const user = localStorage.getItem("User");
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  React.useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, []);
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
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/" element={<Landing />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
