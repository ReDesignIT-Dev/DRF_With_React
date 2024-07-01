import { isEmailValid } from "utils/validation";
import "./EmailField.scss";
import { useEffect, useState } from "react";

export default function EmailField({ value, disabled, customClasses, onChange, onValidate }) {
  const [email, setEmail] = useState("");

  useEffect(() => {
    const isValid = isEmailValid(email);
    onValidate(isValid);
  }, [email]);

  useEffect(() => {
    setEmail(value);
  }, [value]);

  const handleChange = (e) => {
    const value = e.target.value;
    onChange(value);
  };

  return (
    <input
      value={email}
      className={customClasses}
      type='email'
      id='emailField'
      placeholder='email'
      autoComplete='email'
      onChange={handleChange}
      disabled={disabled}
    />
  );
}
