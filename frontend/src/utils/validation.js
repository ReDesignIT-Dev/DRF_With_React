export function isEmailValid(emailToTest) {
  const emailRegex = 
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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
  const validations = [
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

export function isUserLoggedIn(){
  const token = getToken();
  return token ? true : false;
}
