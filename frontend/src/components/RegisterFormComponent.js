import UsernameField from "./Fields/UsernameField";
import EmailField from "components/Fields/EmailField";
import NewPasswordWithPasswordRepeatField from "./Fields/NewPasswordWithPasswordRepeatField";
import RecaptchaField from "components/Fields/RecaptchaField";
import { useEffect, useState } from "react";
import Loading from "components/Loading";
import { registerUser } from "services/apiRequests";
import "./RegisterFormComponent.css"; // Import the CSS file

const RegisterFormComponent = ({ isLoggedIn, onRegisterSuccess }) => {

  const [isValid, setIsValid] = useState(false);
  const [username, setUsername] = useState("");
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [reCaptchaToken, setReCaptchaToken] = useState("");
  const [isValidReCaptchaToken, setIsValidRecaptchaToken] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isPasswordWithPasswordConfirmValid, setIsPasswordWithPasswordConfirmValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const valid = isEmailValid && isValidReCaptchaToken && isPasswordWithPasswordConfirmValid && isUsernameValid;
    setIsValid(valid);
  }, [isEmailValid, isValidReCaptchaToken, isPasswordWithPasswordConfirmValid, isUsernameValid]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isValid) {
      setLoading(true);
      setErrorMessage("");
      try {
        const response = await registerUser(username, email, password, passwordConfirm, reCaptchaToken);
        const returnMessage = response.data.message;
        if (response.status === 200) {
          onRegisterSuccess();
          setErrorMessage("");
        } else {
          setErrorMessage(returnMessage);
          console.log(returnMessage);
        }
      } catch (error) {
        setErrorMessage(error.message);
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    } else {
      setErrorMessage("FORM IS NOT VALID");
    }
  };

  return (
    <div>
      {loading ? (
        <Loading />
      ) : isLoggedIn ? (
        <label className="alert alert-success">{"You are logged in, you cannot register. Log Out to register"}</label>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="register-form-custom d-flex flex-column justify-content-center align-items-center mx-auto"
        >
            <div className="input-group-register">
            <label className="input-label-register">Username</label>
            <UsernameField
              value={username}
              customClasses="text-center mx-auto"
              onChange={setUsername}
              onValidate={setIsUsernameValid}
            />
          </div>
          <div className="input-group-register">
            <label className="input-label-register">Email</label>
            <EmailField
              value={email}
              customClasses="text-center mx-auto"
              onChange={setEmail}
              onValidate={setIsEmailValid}
            />
          </div>
          <div className="input-group-register">
            <label className="input-label-register">Password</label>
            <NewPasswordWithPasswordRepeatField
            customClasses="mx-auto"
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
          <button type="submit" className="btn btn-primary mt-3" disabled={!isValid}>
            Submit
          </button>
          {errorMessage && <label className="alert alert-warning">{errorMessage}</label>}
        </form>
      )}
    </div>
  );
};

export default RegisterFormComponent;
