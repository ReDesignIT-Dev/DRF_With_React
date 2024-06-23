import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PASSWORD_RESET_API_URL } from "config";
import { getDataUsingUserToken } from "services/apiRequests";
import Loading from "components/Loading";
import NewPasswordWithPasswordRepeatField from "components/Fields/NewPasswordWithPasswordRepeatField";

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
  const [isValidToken, setIsValidToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const checkTokenValidity = async () => {
      try {
        const response = await getDataUsingUserToken(`${PASSWORD_RESET_API_URL}${token}`, token);
        if (response.status === 200) {
          setIsValidToken(true);
        }
      } catch (error) {
        if (error.message.includes("Network Error")) {
          setErrorMessage("Network Error: Please check your internet connection.");
        } else if (error.message.includes("API Error")) {
          setErrorMessage("Invalid token.");
        } else {
          setErrorMessage("An unknown error occurred.");
        }
        setIsValidToken(false);
      } finally {
        setLoading(false);
      }
    };
    checkTokenValidity();
  }, [token]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className='container d-flex flex-column align-items-center'>
      {isValidToken ? (
        <div className='' style={{ maxWidth: "200px" }}>
          <NewPasswordWithPasswordRepeatField />
        </div>
      ) : (
        <div>{errorMessage}</div> // Show an error message if the token is invalid
      )}
    </div>
  );
};

export default PasswordReset;
