class EmailError extends Error {
    constructor(message) {
      super(message);
      this.name = "EmailError";
    }
  }
  
  class UsernameError extends Error {
    constructor(message) {
      super(message);
      this.name = "UsernameError";
    }
  }
  
  class DetailError extends Error {
    constructor(message) {
      super(message);
      this.name = "DetailError";
    }
  }
  
  class GeneralApiError extends Error {
    constructor(message) {
      super(message);
      this.name = "GeneralApiError";
    }
  }
  class MultipleFieldErrors extends Error {
    constructor(errors) {
      super();
      this.name = "MultipleFieldErrors";
      this.errors = errors;
    }
  
    toString() {
      return this.errors.map(error => `${error.field}: ${error.message}`).join("\n");
    }
  }

  export { EmailError, UsernameError, DetailError, GeneralApiError, MultipleFieldErrors };