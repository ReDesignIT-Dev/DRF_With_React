import { isEmailValid } from "utils/validation";
import { useState, useEffect } from "react";
import "./CommonStyles.css";

export default function EmailField({ value, disabled, customClasses, onChange, onValidate }) {
  const [email, setEmail] = useState("");

  useEffect(() => {
    setEmail(value);
    validate(value);
  }, [value]);

  const handleChange = (e) => {
    const value = e.target.value;
    validate(value);
    onChange(value);
  };

  const validate = (value) => {
    const isValid = isEmailValid(value);
    onValidate(isValid);
  }

  return (
    <div className={`${customClasses}`}>
      <label className='input-label'>Email</label>
      <input
        value={email}
        className='text-center w-100'
        type='email'
        id='emailField'
        placeholder='email'
        autoComplete='email'
        onChange={handleChange}
        disabled={disabled}
      />
    </div>
  );
}
