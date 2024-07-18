import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { validatePasswordResetToken, postPasswordReset } from "services/apiRequestsUser";
import Loading from "components/Loading";
import NewPasswordWithPasswordRepeatField from "components/Fields/NewPasswordWithPasswordRepeatField";
import RecaptchaField from "components/Fields/RecaptchaField";

const PasswordReset = () => {
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordRepeat, setNewPasswordRepeat] = useState("");
  const [reCaptchaToken, setReCaptchaToken] = useState("");
  const [isValidReCaptchaToken, setIsValidRecaptchaToken] = useState(false);
  const { token } = useParams();
  const [isValidToken, setIsValidToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [passwordChangePostSuccess, setPasswordChangePostSuccess] = useState(false);

  useEffect(() => {
    setIsValid(isValidReCaptchaToken && isValidToken);
  }, [isValidReCaptchaToken]);


  useEffect(() => {
    const checkTokenValidity = async () => {
      try {
        const response = await validatePasswordResetToken(token);
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isValid) {
      try {
        const response = await postPasswordReset(
          token,
          newPassword,
          newPasswordRepeat,
          reCaptchaToken
        );

        if (response.status === 200) {
          const returnMessage = response.data.message;
          setSuccessMessage(returnMessage);
          setPasswordChangePostSuccess(true);
          setErrorMessage("");
          console.log(returnMessage);
        } else {
          const errorData = response.data;
          setErrorMessage(errorData.message || "Failed to reset password.");
          setSuccessMessage("");
        }
      } catch (error) {
        setErrorMessage("An error occurred. Please try again.");
        setSuccessMessage("");
      }
    } else {
      setErrorMessage("Passwords do not match.");
      setSuccessMessage("");
    }
  };

  return (
    <div className='container d-flex flex-column align-items-center'>
      {passwordChangePostSuccess ? (
        <div className="alert alert-success mt-3">{successMessage}</div>
      ) : isValidToken ? (
        <form
          onSubmit={handleSubmit}
          className='d-flex flex-column justify-content-center align-items-center'
        >
          <NewPasswordWithPasswordRepeatField
            passwordValue={setNewPassword}
            passwordRepeatValue={setNewPasswordRepeat}
            onValidate={setIsValid}
          />
          <RecaptchaField onValidate={setIsValidRecaptchaToken} setReturnToken={setReCaptchaToken}/>
          <button type='submit' className='btn btn-primary mt-3' disabled={!isValid}>
            Submit
          </button>
        </form>
      ) : (
        <div className="alert alert-danger mt-3">{errorMessage}</div> // Show an error message if the token is invalid
      )}
    </div>
  );
};

export default PasswordReset;
