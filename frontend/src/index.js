import React, { useContext } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App, { UserContext } from "./App";
import { BrowserRouter } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
// const { state, dispatch } = useContext(UserContext);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <UserContext.Provider>
        <App />
      </UserContext.Provider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
