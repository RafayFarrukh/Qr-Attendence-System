import React, { useState, useRef, useEffect, useContext } from "react";
import { UserContext } from "../../App";

import axios from "axios";
import axiosInstance from "../../services/axiosInstance";
import QRCode from "react-qr-code";
import { useLocation,useParams  } from "react-router-dom";

const TakeAttendance = ({ setQrText, qrText }, props) => {
    const classId  = props;
    const { state } = useContext(UserContext);

  // const [class, setClass] = useState("");
  const [text, setText] = useState("");
  const [className, setClassName] = useState("");
  useEffect(() => {
    console.log(state);
  }, []);
  const submit = async (e) => {
    e.preventDefault();
    // e.target.reset();
    const timestamp = Date.now();
    const teacherId = state?.user?._id;
    const classId = "6429ba11cdf45c96f2841cb1";
    const data1 = { classId, teacherId, timestamp };
    const data = JSON.stringify(data1);
    // setQrText(`Author: ${User.fullName}, Text: ${text}`);
    setQrText(data);

    // --download img
    const svg = document.getElementById("QRCode");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = "QRCode";
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;

    // ---
  };
  return (
    <>
        <div className="mt-9">
          <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-full lg:w-80 p-8 pt-9 m-3 bg-hero-pattern bg-no-repeat bg-cover bg-center">
            <div className="flex ">
              <div className="app">
                <form action="" onSubmit={submit}>
                  <label htmlFor="text">Enter Text</label>
                  <input
                    name="text"
                    type="text"
                    placeholder="input"
                    onChange={(e) => setText(e.target.value)}
                    required
                  />
                  {/* <label htmlFor="Class">Enter Class Name</label>
                  <input
                    name="Class"
                    type="text"
                    placeholder="input"
                    onChange={(e) => setClassName(e.target.value)}
                    required
                  /> */}

                  <button
                    type="submit"
                    onClick={submit}
                    className="
            h-10
			mt-5
            px-5
            text-indigo-100
            bg-sky-600
            rounded-lg
            transition-colors
            duration-150
            focus:shadow-outline
            hover:bg-sky-300
            text-black
          "
                  >
                    Generate
                  </button>
                </form>

                {qrText.length > 0 && (
                  <QRCode id="QRCode" className="mt-10" value={qrText} />
                )}
              </div>
            </div>
          </div>
        </div>
    </>
  );
};

export default TakeAttendance;
