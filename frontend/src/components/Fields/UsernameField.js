import { useState, useEffect } from "react";

export default function UsernameField({ disabled, customClasses, onChange, onValidate }) {
  const [username, setUsername] = useState("");
  const [usernameFieldError, setUsernameFieldError] = useState("");

  useEffect(() => {
    const isValid = isUsernameValid(username);
    if (isValid) {
      setUsernameFieldError("");
    } else {
      setUsernameFieldError("Require 3-30 chars");
    }
    onValidate(isValid);
  }, [username]);

  const handleChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    onChange(value);
  };

  const isUsernameValid = (value) => {
    return value.length >= 3 && value.length <= 30;
  };

  return (
    <div className="d-flex flex-column">
      <input
        className={customClasses}
        type='text'
        id='usernameField'
        placeholder='username'
        onChange={handleChange}
        disabled={disabled}
      />
      <label className='text-danger'>{usernameFieldError}</label>
    </div>
  );
}
