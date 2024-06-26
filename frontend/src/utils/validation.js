export function isEmailValid(emailToTest) {
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(emailToTest);
}

export function isLengthValid(password, minLength = 8) {
  return password.length >= minLength;
}

export function isUppercaseValid(password) {
  return /[A-Z]/.test(password);
}

export function isLowercaseValid(password) {
  return /[a-z]/.test(password);
}

export function isDigitValid(password) {
  return /\d/.test(password);
}

export function isSpecialCharValid(password) {
  return /[@$!%*?&#^()]/.test(password);
}

export function isPasswordValid(password) {
  validations = [
    isLengthValid,
    isUppercaseValid,
    isLowercaseValid,
    isDigitValid,
    isSpecialCharValid,
  ];
  if (!password) {
    return false;
  }
  for (const func of validations) {
    const isValid = func(password);
    if (!isValid) {
      return false;
    }
  }
  return true;
}
