import React, { useState, useEffect } from "react";
import NewPasswordField from "./NewPasswordField";
import PasswordRepeatField from "./PasswordRepeatField";

export default function NewPasswordWithPasswordRepeatField() {
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordIsValid, setNewPasswordIsValid] = useState(false);
  const [passwordRepeatIsValid, setPasswordRepeatIsValid] = useState(false);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    validateFields();
  }, [newPasswordIsValid, passwordRepeatIsValid]);

  useEffect(() => {
    console.log('form valid:', isValid);
  }, [isValid]);

  const handleNewPasswordChange = (value) => {
    setNewPassword(value);
  }

  const validateFields = () => {
      setIsValid(newPasswordIsValid && passwordRepeatIsValid);
    }
  

  return (
    <div className='d-flex flex-column'>
      {isValid}
      <NewPasswordField onChange={handleNewPasswordChange} onValidate={setNewPasswordIsValid} />
      <PasswordRepeatField newPassword={newPassword} onValidate={setPasswordRepeatIsValid}/>
    </div>
  );
}
