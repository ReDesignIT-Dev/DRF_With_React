import RegisterFormComponent from "components/RegisterFormComponent";

const Register = ({isLoggedIn}) => {

    
return (
    <div>
        <RegisterFormComponent isLoggedIn={isLoggedIn}/>
    </div>
)
}

export default Register;