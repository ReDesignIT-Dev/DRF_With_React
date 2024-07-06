import LoginFormComponent from "components/LoginFormComponent";

const Login = ({ isLoggedIn, onLoginSuccess }) => {
 
  return (
    <div>
      <LoginFormComponent isLoggedIn={isLoggedIn} onLoginSuccess={onLoginSuccess} />
    </div>
  );
};

export default Login;
