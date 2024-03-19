export function isEmailValid(emailToTest) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(emailToTest);
}

export function isEmpty(inputText) {
  return inputText === "";
}
export function isTheSamePassword(inputPassword, repeatPassword) {
  return inputPassword === repeatPassword;
}

export function isPasswordValid(passwordToValidate) {
  const isLengthValid = passwordToValidate.length >= 8;
  const isUppercaseValid = /[A-Z]/.test(passwordToValidate);
  const isLowercaseValid = /[a-z]/.test(passwordToValidate);
  const isDigitValid = /\d/.test(passwordToValidate);
  const isSpecialCharValid = /[@$!%*?&#^()]/.test(passwordToValidate);

  return (
    isLengthValid &&
    isUppercaseValid &&
    isLowercaseValid &&
    isDigitValid &&
    isSpecialCharValid
  );
}
