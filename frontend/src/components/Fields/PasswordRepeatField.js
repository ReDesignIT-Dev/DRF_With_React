import React, { useState, useEffect } from "react";

export default function PasswordRepeatField({ customClasses, onChange, newPassword, onValidate }) {
  const [repeatPassword, setRepeatPassword] = useState("");

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
    if (value && value === newPassword) {
      return true;
    }
    return false;
  };

  return (
    <div className={`d-flex flex-column mt-2 ${customClasses}`}>
      <input
        type='password'
        id='passwordConfirm'
        placeholder='repeat passsword'
        value={repeatPassword}
        onChange={handleChange}
        className='text-center'
      />
    </div>
  );
}
