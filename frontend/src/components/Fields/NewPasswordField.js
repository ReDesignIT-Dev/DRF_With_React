import React, { useState, useEffect } from "react";
import {
  isPasswordValid,
  isLengthValid,
  isDigitValid,
  isLowercaseValid,
  isSpecialCharValid,
  isUppercaseValid,
} from "utils/validation";
import { Icon } from "react-icons-kit";
import { eye, eyeOff } from "react-icons-kit/feather";

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
    <div className={`d-flex flex-column mt-2 ${customClasses}`}>
      <input
        type={showPassword ? "text" : "password"}
        id='newPasswordField'
        label='password'
        value={newPassword}
        onChange={handleChange}
        className='text-center'
        placeholder="password"
      />
      <span
        className='d-flex justify-content-center btn btn-link p-0 m-0 text-black text-decoration-none'
        onClick={() => setShowPassword(!showPassword)}
      >
        <span>Show password</span>
        <Icon className='absolute mx-1' icon={showPassword ? eyeOff : eye} size={25} />
      </span>
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
