/** @format */

import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { motion } from "framer-motion";

const UserAuthInput = ({
  label,
  placeHolder,
  isPass,
  setStateFunction,
  Icon,
  setGetEmailValidationStatus,
}) => {
  const [value, setValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);

  const handleTextChnage = (e) => {
    setValue(e.target.value);
    setStateFunction(e.target.value);

    if (placeHolder === "Email") {
      const emailRegex = /^[^\s@]+@[^\s@]+.[^\s@]+$/;
      const status = emailRegex.test(value);
      setIsEmailValid(status);
      setGetEmailValidationStatus(status);
    }
  };

  return (
    <div className="flex flex-col items-start justify-start gap-1">
      <label className="text-sm text-gray-300">{label}</label>
      <div
        className={`flex items-center justify-center gap-3 w-full md:w-96 rounded-md px-4 py-1 bg-gray-200 ${
          !isEmailValid &&
          placeHolder === "Email" &&
          value.length > 0 &&
          "border-2 border-red-500"
        }`}
      >
        <Icon className="text-text555 text-2xl" />
        <input
          type={isPass && !showPassword ? "password" : "text"}
          placeholder={placeHolder}
          className="flex-1 w-full h-full py-2 outline-none border-none bg-transparent text-text555 text-lg"
          value={value}
          onChange={handleTextChnage}
        />

        {isPass && (
          <motion.div
            onClick={() => setShowPassword(!showPassword)}
            whileTap={{ scale: 0.9 }}
            className="cursor-pointer"
          >
            {showPassword ? (
              <FaEyeSlash className="text-text555 text-2xl cursor-pointer" />
            ) : (
              <FaEye className="text-text555 text-2xl cursor-pointer" />
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UserAuthInput;
