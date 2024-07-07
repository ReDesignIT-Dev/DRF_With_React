import React, { useState, useEffect } from "react";
import NewPasswordField from "./NewPasswordField";
import PasswordRepeatField from "./PasswordConfirmField";

export default function NewPasswordWithPasswordRepeatField({customClassesForNewPassword, customClassesForPasswordRepeat, passwordValue, passwordRepeatValue, onChangePassword, onChangePasswordConfirm, onValidate}) {
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordRepeat, setNewPasswordRepeat] = useState("");
  const [newPasswordIsValid, setNewPasswordIsValid] = useState(false);
  const [passwordRepeatIsValid, setPasswordRepeatIsValid] = useState(false);
  const [passwordRepeatError, setPasswordRepeatError] = useState("");
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setNewPassword(passwordValue);
  }, [passwordValue]);

  useEffect(() => {
    setNewPasswordRepeat(passwordRepeatValue);
  }, [passwordRepeatValue]);

  useEffect(() => {
    validateFields();
  }, [newPasswordIsValid, passwordRepeatIsValid]);

  useEffect(() => {
    onValidate(isValid);
  }, [isValid]);

  const handlePasswordChange = (value) => {
    onChangePassword(value);
  };

  const handlePasswordConfirmChange = (value) => {
    onChangePasswordConfirm(value);
  };

  const validateFields = () => {
      setIsValid(newPasswordIsValid && passwordRepeatIsValid);
      setPasswordRepeatError(passwordRepeatIsValid ? "" : "Passwords do not match");
      }
  
  return (
    <div className='d-flex flex-column'>
      <NewPasswordField value={newPassword} customClasses={customClassesForNewPassword} onChange={handlePasswordChange} onValidate={setNewPasswordIsValid} />
      <PasswordRepeatField value={newPasswordRepeat} customClasses={customClassesForPasswordRepeat} onChange={handlePasswordConfirmChange} newPassword={newPassword} onValidate={setPasswordRepeatIsValid}/>
      <label className="text-danger">{passwordRepeatError}</label>
    </div>
  );
}
