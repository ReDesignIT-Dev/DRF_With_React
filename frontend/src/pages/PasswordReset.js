import React from 'react';
import { useParams } from 'react-router-dom';
import NewPasswordField from 'components/Fields/NewPasswordField';
// import {
//   isEmpty,
//   isPasswordValid,
//   isTheSamePassword,
//   isLengthValid,
//   isUppercaseValid,
//   isLowercaseValid,
//   isDigitValid,
//   isSpecialCharValid,
// } from "utils/validation";

//TODO FIELD WITH VALIDATION

const PasswordReset = () => {
  const { token } = useParams();


return (
    <div className="container d-flex flex-column align-items-center">
      {token}
      <div className='' style={{ maxWidth: '200px' }}>
     <NewPasswordField />
     </div>
    </div>
  );
};

export default PasswordReset;