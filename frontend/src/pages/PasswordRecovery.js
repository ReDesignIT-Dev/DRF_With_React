import { useState, useEffect } from "react";
import RecaptchaField from "components/Fields/RecaptchaField";
import EmailField from "components/Fields/EmailField";
import { postPasswordRecovery } from "services/apiRequests";
import Loading from "components/Loading";

const PasswordRecovery = () => {
  const [isValid, setIsValid] = useState(false);
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [reCaptchaToken, setReCaptchaToken] = useState("");
  const [isValidReCaptchaToken, setIsValidRecaptchaToken] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const valid = isEmailValid && isValidReCaptchaToken;
    setIsValid(valid);
  }, [email, isEmailValid, isValidReCaptchaToken]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isValid) {
      setLoading(true);
      setErrorMessage("");
      try {
        const response = await postPasswordRecovery(email, reCaptchaToken);
        const returnMessage = response.data.message;
        if (response.status === 200) {
          setPostSuccess(true);
          setSuccessMessage(returnMessage);
          setErrorMessage("");
          console.log(returnMessage);
        } else {
          setErrorMessage(returnMessage);
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
      ) : postSuccess ? (
        <label className="alert alert-success">{ successMessage }</label>
      ) : (
        <form
          onSubmit={handleSubmit}
          className='d-flex flex-column justify-content-center align-items-center'
        >
          <label className='text-black'>
            {
              "Enter your user account's verified email address and we will send you a password reset link."
            }
          </label>
          <EmailField
            customClasses='my-2 text-center'
            onChange={setEmail}
            onValidate={setIsEmailValid}
          />
          <RecaptchaField
            onValidate={setIsValidRecaptchaToken}
            setReturnToken={setReCaptchaToken}
          />
          <button type='submit' className='btn btn-primary mt-3' disabled={!isValid}>
            Submit
          </button>
          {errorMessage && <label className="alert alert-warning">{errorMessage}</label>}
        </form>
      )}
    </div>
  );
};

export default PasswordRecovery;
