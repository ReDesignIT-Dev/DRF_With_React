import React from "react";
import LoginFormComponent from "components/LoginFormComponent";
import { useNavigate } from "react-router-dom";
import { FRONTEND_REGISTER_URL } from "config";
import { useAuth } from "hooks/useAuth";

const Login: React.FC = () => {
  const isLoggedIn: boolean = useAuth();
  const navigate = useNavigate();

  return (
    <div className='d-flex align-items-center justify-content-center flex-column mt-3'>
      {!isLoggedIn && (
        <button
          type='button'
          className='btn btn-info mt-2'
          onClick={() => {
            navigate(FRONTEND_REGISTER_URL, { replace: true });
          }}
        >
          Don't have an account? Click here to register
        </button>
      )}
      <LoginFormComponent />
    </div>
  );
};

export default Login;
