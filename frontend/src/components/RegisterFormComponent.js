import UsernameField from "./Fields/UsernameField";
import EmailField from "components/Fields/EmailField";
import NewPasswordWithPasswordRepeatField from "./Fields/NewPasswordWithPasswordRepeatField";
import RecaptchaField from "components/Fields/RecaptchaField";
import { useEffect, useState } from "react";
import Loading from "components/Loading";
import { registerUser } from "services/apiRequestsUser";
import "./RegisterFormComponent.css"; // Import the CSS file
import { GeneralApiError, MultipleFieldErrors } from "services/CustomErrors";

const RegisterFormComponent = ({ isLoggedIn, onRegisterSuccess }) => {
  const [isValid, setIsValid] = useState(false);
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [usernameFieldError, setUsernameFieldError] = useState(
    localStorage.getItem("usernameFieldError") || ""
  );
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [emailFieldError, setEmailFieldError] = useState(
    localStorage.getItem("emailFieldError") || ""
  );
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [reCaptchaToken, setReCaptchaToken] = useState("");
  const [isValidReCaptchaToken, setIsValidRecaptchaToken] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isPasswordWithPasswordConfirmValid, setIsPasswordWithPasswordConfirmValid] =
    useState(false);
  const [errorMessage, setErrorMessage] = useState(localStorage.getItem("detailError") || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      clearUsedLocalStorage();
      setEmail("");
      setUsername("");
    }
  });

  useEffect(() => {
    localStorage.removeItem("usernameFieldError");
    localStorage.setItem("username", username);
    validateUsername();
  }, [username]);

  useEffect(() => {
    localStorage.removeItem("emailFieldError");
    localStorage.setItem("email", email);
    validateEmail();
  }, [email]);

  const validateEmail = () => {
    const emailFieldErrorFromPost = localStorage.getItem("emailFieldError");
    if (emailFieldErrorFromPost) {
      setEmailFieldError(emailFieldErrorFromPost);
    } else if (!isEmailValid) {
      setEmailFieldError("Invalid email");
    } else {
      setEmailFieldError("");
    }
  };

  const validateUsername = () => {
    const usernameFieldErrorFromPost = localStorage.getItem("usernameFieldError");
    if (usernameFieldErrorFromPost) {
      setUsernameFieldError(usernameFieldErrorFromPost);
    } else if (!isUsernameValid) {
      setUsernameFieldError("Username must be between 3 and 30 chars");
    } else {
      setUsernameFieldError("");
    }
  };

  useEffect(() => {
    const valid =
      isEmailValid &&
      isValidReCaptchaToken &&
      isPasswordWithPasswordConfirmValid &&
      isUsernameValid;
    setIsValid(valid);
    validateUsername();
    validateEmail();
  }, [isEmailValid, isValidReCaptchaToken, isPasswordWithPasswordConfirmValid, isUsernameValid]);

  const clearUsedLocalStorage = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("usernameFieldError");
    localStorage.removeItem("email");
    localStorage.removeItem("emailFieldError");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isValid) {
      setLoading(true);
      setErrorMessage("");
      try {
        const response = await registerUser(
          username,
          email,
          password,
          passwordConfirm,
          reCaptchaToken
        );
        const returnMessage = response.data.message;
        if (response.status === 200) {
          clearUsedLocalStorage();
          onRegisterSuccess();
          setErrorMessage("");
        } else {
          setErrorMessage(returnMessage);
          console.log(returnMessage);
        }
      } catch (error) {
        if (error instanceof MultipleFieldErrors) {
          error.errors.forEach((err) => {
            if (err.field === "username") {
              setUsernameFieldError(err.message);
              localStorage.setItem("usernameFieldError", err.message);
              console.log(`Username Error: ${err.message}`);
            }
            if (err.field === "email") {
              setEmailFieldError(err.message);
              localStorage.setItem("emailFieldError", err.message);
              console.log(`Email Error: ${err.message}`);
            }
            if (err.field === "detail") {
              setErrorMessage(err.message);
              localStorage.setItem("detailError", err.message);
              console.log(`Detail Error: ${err.message}`);
            }
          });
        } else if (error instanceof GeneralApiError) {
          setErrorMessage(error.message);
          console.log(error.message);
        } else {
          setErrorMessage("An unexpected error occurred.");
          console.log("An unexpected error occurred:", error);
        }
      } finally {
        setLoading(false);
      }
    } else {
      setErrorMessage("FORM IS NOT VALID");
    }
  };

  return (
    <div>
      {isLoggedIn ? (
        <label className='alert alert-success'>
          {"You are logged in, you cannot register. Log Out to register"}
        </label>
      ) : loading ? (
        <Loading />
      ) : (
        <form
          onSubmit={handleSubmit}
          className='register-form-custom d-flex flex-column justify-content-center align-items-center mx-auto'
        >
          <div className='input-group-register'>
            <UsernameField
              value={username}
              customClasses='text-center w-100'
              onChange={setUsername}
              onValidate={setIsUsernameValid}
            />
            {usernameFieldError && <label className='text-danger'>{usernameFieldError}</label>}
          </div>
          <div className='input-group-register'>
            <EmailField
              value={email}
              customClasses='text-center w-100'
              onChange={setEmail}
              onValidate={setIsEmailValid}
            />
            {emailFieldError && <label className='text-danger'>{emailFieldError}</label>}
          </div>
          <div className='input-group-register'>
            <NewPasswordWithPasswordRepeatField
              customClassesForNewPassword={"w-100"}
              passwordValue={password}
              passwordRepeatValue={passwordConfirm}
              onChangePassword={setPassword}
              onChangePasswordConfirm={setPasswordConfirm}
              onValidate={setIsPasswordWithPasswordConfirmValid}
            />
          </div>
          <RecaptchaField
            onValidate={setIsValidRecaptchaToken}
            setReturnToken={setReCaptchaToken}
          />
          <button type='submit' className='btn btn-primary mt-3' disabled={!isValid}>
            Submit
          </button>
          {errorMessage && <label className='alert alert-warning'>{errorMessage}</label>}
        </form>
      )}
    </div>
  );
};

export default RegisterFormComponent;
