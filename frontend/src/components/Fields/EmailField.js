import { useState, useEffect } from "react";
import { isEmailValid } from "utils/validation";

export default function EmailField({ disabled, customClasses, onChange, onValidate }) {
  const [email, setEmail] = useState("");

  useEffect(() => {
    const isValid = isEmailValid(email);
    onValidate(isValid);
  }, [email]);

  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    onChange(value);
  };

  return (
    <input
      className={customClasses}
      type="email"
      id="emailField"
      placeholder="email"
      onChange={handleChange}
      disabled={disabled}
    />
  );
}
