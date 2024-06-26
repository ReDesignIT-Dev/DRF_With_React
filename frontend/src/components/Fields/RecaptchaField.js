import React, { useState, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";

export default function RecaptchaField({ customClasses, setReturnToken, onValidate }) {
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  const devRecaptchaToken = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";

  useEffect(() => {
    const isValid = isReCAPTCHAValid(recaptchaToken);
    onValidate(isValid);
    setReturnToken(recaptchaToken);
  }, [recaptchaToken]);

  const isReCAPTCHAValid = () => {
    if (!recaptchaToken) {
      return false;
    }
    return true;
  };
  return (
    <ReCAPTCHA
      className={`my-1 ${customClasses}`}
      sitekey={devRecaptchaToken}
      onChange={(token) => setRecaptchaToken(token)}
    />
  );
}
