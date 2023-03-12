import React, { useContext, useEffect } from "react";
import { UserContext } from "../App";

const Landing = () => {
  const { state } = useContext(UserContext);
  useEffect(() => {
    console.log(state);
  }, []);
  return <div>Landing</div>;
};

export default Landing;
