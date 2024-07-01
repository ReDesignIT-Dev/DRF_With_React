import { isEmailValid } from "utils/validation";
import "./EmailField.scss";

export default function EmailField({ value, disabled, customClasses, onChange, onValidate }) {
  const validateField = (valueToValidate) => {
    const isValid = isEmailValid(valueToValidate);
    onValidate(isValid);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    onChange(value);
    validateField(value);
  };

  return (
    <input
      value={value}
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
