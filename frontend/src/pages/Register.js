import RegisterFormComponent from "components/RegisterFormComponent";
import { FRONTEND_LOGIN_URL } from "config";
import { useNavigate } from "react-router-dom";

const Register = ({ isLoggedIn }) => {
    const navigate = useNavigate();

  return (
    <div className='d-flex align-items-center justify-content-center flex-column'>
      <button
        type='button'
        className='btn btn-info mt-2'
        onClick={() => {
          navigate(FRONTEND_LOGIN_URL, { replace: true });
        }}
      >{`Already have an account? Click here to Login`}</button>

      <RegisterFormComponent isLoggedIn={isLoggedIn} />
    </div>
  );
};

export default Register;
