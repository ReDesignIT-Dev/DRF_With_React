import React, { useState, useEffect } from "react";
import NewPasswordField from "./NewPasswordField";
import PasswordRepeatField from "./PasswordConfirmField";

export default function NewPasswordWithPasswordRepeatField({customClassesForNewPassword, customClassesForPasswordRepeat, passwordValue, passwordRepeatValue, onValidate}) {
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordRepeat, setNewPasswordRepeat] = useState("");
  const [newPasswordIsValid, setNewPasswordIsValid] = useState(false);
  const [passwordRepeatIsValid, setPasswordRepeatIsValid] = useState(false);
  const [passwordRepeatError, setPasswordRepeatError] = useState("");
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    validateFields();
  }, [newPasswordIsValid, passwordRepeatIsValid]);

  useEffect(() => {
    onValidate(isValid);
    passwordValue(newPassword);
    passwordRepeatValue(newPasswordRepeat);
  }, [isValid]);

  const validateFields = () => {
      setIsValid(newPasswordIsValid && passwordRepeatIsValid);
      setPasswordRepeatError(passwordRepeatIsValid ? "" : "Passwords do not match");
      }
  
  return (
    <div className='d-flex flex-column'>
      <NewPasswordField customClasses={customClassesForNewPassword} onChange={setNewPassword} onValidate={setNewPasswordIsValid} />
      <PasswordRepeatField customClasses={customClassesForPasswordRepeat} onChange={setNewPasswordRepeat} newPassword={newPassword} onValidate={setPasswordRepeatIsValid}/>
      <label className="text-danger">{passwordRepeatError}</label>
    </div>
  );
}
