/** @format */

import React from "react";
import { Triangle } from "react-loader-spinner";

const Spinner = () => {
  return (
    <Triangle
      visible={true}
      height="80"
      width="80"
      color="blue"
      ariaLabel="triangle-loading"
      wrapperStyle={{}}
      wrapperClass=""
    />
  );
};

export default Spinner;
