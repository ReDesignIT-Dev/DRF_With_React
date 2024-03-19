const ErrorLabel = ({ error, groupState, state }) => (
    <label className={`${groupState === state ? "" : "hidden"} errorLabel d-flex justify-content-center text-center px-2`} >{error}</label>
  );

  export default ErrorLabel;