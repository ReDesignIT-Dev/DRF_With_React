import { useState, useEffect } from "react";
import RecaptchaField from "components/Fields/RecaptchaField";
import EmailField from "components/Fields/EmailField";
import { PASSWORD_RECOVERY_API_URL } from "config";
import { postPasswordRecovery } from "services/apiRequests";

const PasswordRecovery = () => {
  const [isValid, setIsValid] = useState(false);
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [reCaptchaToken, setReCaptchaToken] = useState("");
  const [isValidReCaptchaToken, setIsValidRecaptchaToken] = useState(false);

  useEffect(() => {
    const valid = (isEmailValid && isValidReCaptchaToken);
    console.log(isValid);
    setIsValid(valid);
  }, [email, isEmailValid, isValidReCaptchaToken]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isValid) {
      try {
        const response = await postPasswordRecovery(
          `${PASSWORD_RECOVERY_API_URL}`,
          email,
          reCaptchaToken
        );

        if (response.status === 200) {
          const returnMessage = response.data.message;
          console.log(returnMessage);
        } else {
          const errorData = response.data;
          console.log(errorData);
        }
      } catch (error) {
        console.log(error.message);
      }
    } else {
      console.log("NOT VALID");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='d-flex flex-column justify-content-center align-items-center'
    >
      <EmailField
        customClasses='my-2 text-center'
        onChange={setEmail}
        onValidate={setIsEmailValid}
      />
      <RecaptchaField onValidate={setIsValidRecaptchaToken} setReturnToken={setReCaptchaToken} />
      <button
        type='submit'
        className='btn btn-primary mt-3'
        disabled={!isValid}
      >
        Submit
      </button>
    </form>
  );
};

export default PasswordRecovery;
