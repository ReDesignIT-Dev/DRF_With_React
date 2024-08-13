import React, { useState, useEffect } from "react";
import {
  isPasswordValid,
  isLengthValid,
  isDigitValid,
  isLowercaseValid,
  isSpecialCharValid,
  isUppercaseValid,
} from "utils/validation";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import "./CommonStyles.css";

export default function NewPasswordField({ value, customClasses, onChange, onValidate }) {
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const isValid = isPasswordValid(newPassword);
    onValidate(isValid);
  }, [newPassword]);

  useEffect(() => {
    setNewPassword(value);
  }, [value]);

  const handleChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    onChange(value);
  };

  return (
    <div className={`d-flex flex-column ${customClasses}`}>
      <label className='input-label'>Password</label>
      <input
        type={showPassword ? "text" : "password"}
        id='newPasswordField'
        label='password'
        value={newPassword}
        onChange={handleChange}
        className='text-center w-100'
        placeholder='password'
      />
      <div className='text-center'>
        <div
          className='d-inline-flex justify-content-center align-items-center p-1 mt-1 btn btn-link text-black text-decoration-none'
          onClick={() => setShowPassword(!showPassword)}
        >
          <span>{showPassword ? "Hide password" : "Show password"}</span>
          <span className='mx-2'>{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
        </div>
      </div>
      <div className='password-validation d-flex flex-column align-items-center'>
        <div className={isLengthValid(newPassword) ? "valid" : "invalid"}>
          Minimum length - 8 characters
        </div>
        <div className={isUppercaseValid(newPassword) ? "valid" : "invalid"}>
          At least one uppercase letter
        </div>
        <div className={isLowercaseValid(newPassword) ? "valid" : "invalid"}>
          At least one lowercase letter
        </div>
        <div className={isDigitValid(newPassword) ? "valid" : "invalid"}>
          At least one numeric digit
        </div>
        <div className={isSpecialCharValid(newPassword) ? "valid" : "invalid"}>
          At least one special character
        </div>
      </div>
    </div>
  );
}
