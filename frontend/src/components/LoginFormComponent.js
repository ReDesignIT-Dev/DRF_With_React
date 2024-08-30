import EmailField from "components/Fields/EmailField";
import PasswordField from "components/Fields/PasswordField";
import RecaptchaField from "components/Fields/RecaptchaField";
import { useEffect, useState } from "react";
import Loading from "components/Loading";
import "./LoginFormComponent.css"; 
import { loginUser } from "reduxComponents/reducers/authReducer";
import { useSelector, useDispatch } from "react-redux";

const LoginFormComponent = () => {
  const [isValid, setIsValid] = useState(false);
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [reCaptchaToken, setReCaptchaToken] = useState("");
  const [isValidReCaptchaToken, setIsValidRecaptchaToken] = useState(false);
  const [password, setPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const { isLoggedIn, isLoading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const valid = isEmailValid && isValidReCaptchaToken && isPasswordValid;
    setIsValid(valid);
  }, [isEmailValid, isValidReCaptchaToken, isPasswordValid]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isValid) {
      dispatch(loginUser({ username: email, password, recaptcha: reCaptchaToken }));
    }
  };


  return (
    <div>
      {isLoading  ? (
        <Loading />
      ) : isLoggedIn ? (
        <label className="alert alert-success">{"You are logged in"}</label>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="login-form-custom d-flex flex-column justify-content-center align-items-center mx-auto"
        >
          <div className="input-group-login">
            <EmailField
              value={email}
              customClasses="w-100"
              onChange={setEmail}
              onValidate={setIsEmailValid}
            />
          </div>
          <div className="input-group-login">
            <PasswordField
            customClasses="w-100"
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
          {error && <label className="alert alert-warning">{error}</label>}
        </form>
      )}
    </div>
  );
};

export default LoginFormComponent;
