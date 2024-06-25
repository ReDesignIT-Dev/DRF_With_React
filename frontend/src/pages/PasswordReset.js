import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PASSWORD_RESET_API_URL } from "config";
import { getDataUsingUserToken, postPasswordReset } from "services/apiRequests";
import Loading from "components/Loading";
import NewPasswordWithPasswordRepeatField from "components/Fields/NewPasswordWithPasswordRepeatField";

const PasswordReset = () => {
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordRepeat, setNewPasswordRepeat] = useState("");
  const { token } = useParams();
  const [isValidToken, setIsValidToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const checkTokenValidity = async () => {
      try {
        const response = await getDataUsingUserToken(`${PASSWORD_RESET_API_URL}${token}/`, token);
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
      const response = await postPasswordReset(`${PASSWORD_RESET_API_URL}${token}/`, newPassword, newPasswordRepeat);

      if (response.status === 200) {
        setSuccessMessage('Password has been reset successfully!');
        setErrorMessage('');
        console.log(successMessage);
      } else {
        const errorData = response.data;
        setErrorMessage(errorData.message || 'Failed to reset password.');
        setSuccessMessage('');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
      setSuccessMessage('');
    }
  } else {
    setErrorMessage('Passwords do not match.');
    setSuccessMessage('');
  }
};

  return (
    <div className='container d-flex flex-column align-items-center'>
      {isValidToken ? (
        <form onSubmit={handleSubmit} className='d-flex flex-column justify-content-center align-items-center'>
          <NewPasswordWithPasswordRepeatField passwordValue={setNewPassword} passwordRepeatValue={setNewPasswordRepeat} onValidate={setIsValid} />
          <button type="submit" className="btn btn-primary mt-3" disabled={!isValid}>Submit</button>
        </form>
      ) : (
        <div>{errorMessage}</div> // Show an error message if the token is invalid
      )}
    </div>
  );
};

export default PasswordReset;
