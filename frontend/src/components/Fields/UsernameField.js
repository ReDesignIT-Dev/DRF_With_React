import { useState, useEffect } from "react";

export default function UsernameField({ disabled, customClasses, onChange, onValidate }) {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const isValid = isUsernameValid(username);
    onValidate(isValid);
  }, [username]);

  const handleChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    onChange(value);
  };

  const isUsernameValid = (value) => {
    return (value.length > 2 && value.length < 20)
  }

  return (
    <input
      className={customClasses}
      type="text"
      id="usernameField"
      placeholder="username"
      onChange={handleChange}
      disabled={disabled}
    />
  );
}
