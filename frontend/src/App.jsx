import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./Authentication/Login";
function App() {
  return (
    <>
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Routes>
          <Route exact path="/login" element={<Login />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
