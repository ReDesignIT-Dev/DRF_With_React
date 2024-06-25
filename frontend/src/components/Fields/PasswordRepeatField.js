import React, { useState, useEffect } from "react";

export default function PasswordRepeatField({ onChange, newPassword, onValidate }) {
  const [repeatPassword, setRepeatPassword] = useState("");
  const [repeatPasswordError, setRepeatPasswordError] = useState("");

  useEffect(() => {
    const isValid = validateRepeatPassword(repeatPassword);
    onValidate(isValid);
  }, [newPassword, repeatPassword]);

  const handleChange = (e) => {
    const value = e.target.value;
    setRepeatPassword(value);
    onChange(value);
  };

  const validateRepeatPassword = (value) => {
    if (!value) {
      setRepeatPasswordError("Please repeat the password");
    } else if (value !== newPassword) {
      setRepeatPasswordError("Passwords do not match");
    } else {
      setRepeatPasswordError("");
      return true;
    }
    return false;
  };

  return (
    <div className='d-flex flex-column mt-2'>
      <input
        type="password"
        id='repeatpassword'
        placeholder='repeat passsword'
        value={repeatPassword}
        onChange={handleChange}
        className="text-center"
      />
      <div>{repeatPasswordError}</div>
    </div>
  );
}
