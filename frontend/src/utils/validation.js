export function isEmailValid(emailToTest) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
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
  return {
    isLengthValid: isLengthValid(password),
    isUppercaseValid: isUppercaseValid(password),
    isLowercaseValid: isLowercaseValid(password),
    isDigitValid: isDigitValid(password),
    isSpecialCharValid: isSpecialCharValid(password),
  };
}
