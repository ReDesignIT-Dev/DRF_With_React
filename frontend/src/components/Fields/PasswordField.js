import React, { useState, useEffect } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import "./CommonStyles.css";

export default function PasswordField({ value, customClasses, onChange, onValidate }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const isValid = password !== "";
    onValidate(isValid);
  }, [password]);

  useEffect(() => {
    setPassword(value);
  }, [value]);

  const handleChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    onChange(value);
  };

  return (
    <div className={`${customClasses}`}>
      <label className='input-label'>Password</label>
      <input
        type={showPassword ? "text" : "password"}
        id='newPasswordField'
        label='password'
        value={password}
        onChange={handleChange}
        className='text-center w-100'
        placeholder='password'
      />
      <div className='text-center'>
        <div
          className='d-inline-flex justify-content-center align-items-center p-1 mt-1 btn btn-link text-black text-decoration-none'
          onClick={() => setShowPassword(!showPassword)}
        >
          <span>Show password</span>
          <span className='mx-2'>{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
        </div>
      </div>
    </div>
  );
}
