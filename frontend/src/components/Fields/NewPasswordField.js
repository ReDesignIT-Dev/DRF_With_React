import React, { useState, useEffect } from "react";
import {
  isLengthValid,
  isUppercaseValid,
  isLowercaseValid,
  isDigitValid,
  isSpecialCharValid,
} from "utils/validation";
import { Icon } from "react-icons-kit";
import { eye, eyeOff } from "react-icons-kit/feather";

export default function NewPasswordField({onChange, onValidate}) {
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const isValid = validatePassword(newPassword);
    onValidate(isValid);
  }, [newPassword]);

  const handleChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    onChange(value);
  };

  const validatePassword = (value) => {
    if (!value) {
      setNewPasswordError("Password is required");
    } else if (!isLengthValid(value)) {
      setNewPasswordError("Password must be at least 8 characters long");
    } else if (!isUppercaseValid(value)) {
      setNewPasswordError("Password must contain at least one uppercase letter");
    } else if (!isLowercaseValid(value)) {
      setNewPasswordError("Password must contain at least one lowercase letter");
    } else if (!isDigitValid(value)) {
      setNewPasswordError("Password must contain at least one numeric digit");
    } else if (!isSpecialCharValid(value)) {
      setNewPasswordError("Password must contain at least one special character");
    } else {
      setNewPasswordError("");
      return true;
    }
    return false;
  };

  return (
    <div className='d-flex flex-column'>
      <input
        type={showPassword ? "text" : "password"}
        id='newpassword'
        label='password'
        value={newPassword}
        onChange={handleChange}
        className="text-center"
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
      <label>{newPasswordError}</label>
    </div>
  );
}
