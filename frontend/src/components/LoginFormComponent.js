import EmailField from "components/Fields/EmailField";
import PasswordField from "components/Fields/PasswordField";
import RecaptchaField from "components/Fields/RecaptchaField";
import { useEffect, useState } from "react";
import Loading from "components/Loading";
import { postLogin } from "services/apiRequests";
import "./LoginFormComponent.css"; // Import the CSS file

const LoginFormComponent = ({ isLoggedIn, onLoginSuccess }) => {
  const [isValid, setIsValid] = useState(false);
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [reCaptchaToken, setReCaptchaToken] = useState("");
  const [isValidReCaptchaToken, setIsValidRecaptchaToken] = useState(false);
  const [password, setPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const valid = isEmailValid && isValidReCaptchaToken && isPasswordValid;
    setIsValid(valid);
  }, [isEmailValid, isValidReCaptchaToken, isPasswordValid]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isValid) {
      setLoading(true);
      setErrorMessage("");
      try {
        const response = await postLogin(email, password, reCaptchaToken);
        const returnMessage = response.data.message;
        if (response.status === 200) {
          onLoginSuccess();
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
        <label className="alert alert-success">{"You are logged in"}</label>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="login-form-custom d-flex flex-column justify-content-center align-items-center mx-auto"
        >
          <div className="input-group-login">
            <label className="input-label-login">Email</label>
            <EmailField
              value={email}
              customClasses="text-center mx-auto"
              onChange={setEmail}
              onValidate={setIsEmailValid}
            />
          </div>
          <div className="input-group-login">
            <label className="input-label-login">Password</label>
            <PasswordField
            customClasses="mx-auto"
              value={password}
              onChange={setPassword}
              onValidate={setIsPasswordValid}
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

export default LoginFormComponent;
