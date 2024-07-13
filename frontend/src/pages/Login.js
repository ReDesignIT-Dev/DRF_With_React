import LoginFormComponent from "components/LoginFormComponent";
import { useNavigate } from "react-router-dom";
import { FRONTEND_REGISTER_URL } from "config";

const Login = ({ isLoggedIn, onLoginSuccess }) => {
  const navigate = useNavigate();

  return (
    <div className='d-flex align-items-center justify-content-center flex-column'>
      <button
        type='button'
        className='btn btn-info mt-2'
        onClick={() => {
          navigate(FRONTEND_REGISTER_URL, { replace: true });
        }}
      >{`Don't have an account? Click here to register`}</button>
      <LoginFormComponent isLoggedIn={isLoggedIn} onLoginSuccess={onLoginSuccess} />
    </div>
  );
};

export default Login;
