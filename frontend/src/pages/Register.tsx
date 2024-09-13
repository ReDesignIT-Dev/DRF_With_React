import React from "react"; // Import React for JSX syntax
import RegisterFormComponent from "components/RegisterFormComponent";
import { FRONTEND_LOGIN_URL } from "config";
import { useNavigate } from "react-router-dom";
import { useAuth } from "hooks/useAuth";

const Register: React.FC = () => {
  const isLoggedIn = useAuth();
  const navigate = useNavigate();

  return (
    <div className='d-flex align-items-center justify-content-center flex-column mt-3'>
      {!isLoggedIn && (
        <>
          <button
            type='button'
            className='btn btn-info mt-2'
            onClick={() => {
              navigate(FRONTEND_LOGIN_URL, { replace: true });
            }}
          >
            Already have an account? Click here to Login
          </button>
        </>
      )}
      <RegisterFormComponent />
    </div>
  );
};

export default Register;