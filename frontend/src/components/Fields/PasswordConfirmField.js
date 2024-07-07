import React, { useState, useEffect } from "react";
import "./CommonStyles.css";

export default function PasswordRepeatField({ value, customClasses, onChange, newPassword, onValidate }) {
  const [repeatPassword, setRepeatPassword] = useState("");

  useEffect(() => {
    const isValid = validateRepeatPassword(repeatPassword);
    onValidate(isValid);
  }, [newPassword, repeatPassword]);

  useEffect(() => {
    setRepeatPassword(value);
  }, [value]);

  const handleChange = (e) => {
    const value = e.target.value;
    setRepeatPassword(value);
    onChange(value);
  };

  const validateRepeatPassword = (value) => {
    if (value && value === newPassword) {
      return true;
    }
    return false;
  };

  return (
    <div className={`${customClasses}`}>
      <label className='input-label'>Confirm Password</label>
      <input
        type='password'
        id='passwordConfirmField'
        placeholder='repeat password'
        value={repeatPassword}
        onChange={handleChange}
        className='text-center w-100'
      />
    </div>
  );
}
