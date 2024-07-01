import EmailField from "components/Fields/EmailField";
import PasswordField from "components/Fields/PasswordField";
import RecaptchaField from "components/Fields/RecaptchaField";
import { useEffect, useState } from "react";
import Loading from "components/Loading";
import { postLogin } from "services/apiRequests";

const Login = () => {
  const [isValid, setIsValid] = useState(false);
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [reCaptchaToken, setReCaptchaToken] = useState("");
  const [isValidReCaptchaToken, setIsValidRecaptchaToken] = useState(false);
  const [password, setPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
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
        if (response.status === 200) {
          setPostSuccess(true);
          setSuccessMessage("Successful login");
          setErrorMessage("");
        } else {
          setErrorMessage("Something went wrong");
        }
      } catch (error) {
        setErrorMessage("Something went wrong");
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
      ) : postSuccess ? (
        <label className='alert alert-success'>{successMessage}</label>
      ) : (
        <form
          onSubmit={handleSubmit}
          className='d-flex flex-column justify-content-center align-items-center'
        >
          <EmailField
            value={email}
            customClasses='my-2 text-center'
            onChange={setEmail}
            onValidate={setIsEmailValid}
          />
          <PasswordField 
          value={password} 
          onChange={setPassword} 
          onValidate={setIsPasswordValid} />
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

export default Login;
