import React, { useState, useEffect } from "react";
import { Icon } from "react-icons-kit";
import { eye, eyeOff } from "react-icons-kit/feather";

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
    <div className={`d-flex flex-column mt-2 ${customClasses}`}>
      <input
        type={showPassword ? "text" : "password"}
        id='newPasswordField'
        label='password'
        value={password}
        onChange={handleChange}
        className='text-center'
        placeholder='password'
      />
      <span
        className='d-flex justify-content-center btn btn-link p-0 m-0 text-black text-decoration-none'
        onClick={() => setShowPassword(!showPassword)}
      >
        <span>Show password</span>
        <Icon className='absolute mx-1' icon={showPassword ? eyeOff : eye} size={25} />
      </span>
    </div>
  );
}
