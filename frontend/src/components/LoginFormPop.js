import React, { useState } from "react";
import "./LoginForm.scss";
import "react-bootstrap"

const mode = 'login';

const LoginFormPop = ({ isShowLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const onSubmitClick = () => {
    // Set initial error values to empty
    setEmailError("");
    setPasswordError("");

    // Check if the user has entered both fields correctly
    if ("" === email) {
      setEmailError("Please enter your email");
      return;
    }

    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailError("Please enter a valid email");
      return;
    }

    if ("" === password) {
      setPasswordError("Please enter a password");
      return;
    }

    if (password.length < 8) {
      setPasswordError("The password must be 8 characters or longer");
      return;
    }

    console.log('Form submitted with email:', email, 'and password:', password);
  };

  return (
    <div className={`${isShowLogin ? "active" : ""} show`}>
      <div className="login-form">
        <div className="form-box solid">
          <div className={`app app--is-${mode}`}>
            <LoginComponent
              mode={mode}
              onSubmit={() => {
                onSubmitClick();
                console.log('submit');
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

class LoginComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: this.props.mode
    };
  }

  toggleMode() {
    var newMode = this.state.mode === 'login' ? 'signup' : 'login';
    this.setState({ mode: newMode });
  }

  render() {
    return (
      <div className="logPop d-flex justify-content-center">
        <div className={`form-block-wrapper form-block-wrapper--is-${this.state.mode}`} ></div>
        <section className={`form-block form-block--is-${this.state.mode}`}>
          <header className="form-block__header d-flex flex-column">
            <h1>{this.state.mode === 'login' ? 'Welcome back!' : 'Sign up'}</h1>
            <div className="form-block__toggle-block d-flex flex-row">
              <span className="flex-fill text-nowrap">{this.state.mode === 'login' ? 'Don\'t' : 'Already'} have an account? Click here &#8594;</span>
              <input id="form-toggler" type="checkbox" onClick={this.toggleMode.bind(this)} />
              <label className="flex-fill" htmlFor="form-toggler"></label>
            </div>
          </header>
          <LoginFormInPop mode={this.state.mode} onSubmit={this.props.onSubmit} />
        </section>
      </div>
    );
  }
}

class LoginFormInPop extends React.Component {
  state = {
    mode: this.props.mode
  };

  render() {
    return (
      <form onSubmit={(e) => {
        e.preventDefault();
        this.props.onSubmit();
      }}>
        <div className="form-block__input-wrapper">
          <div className="form-group form-group--login">
            <Input type="text" id="email" label="email" disabled={this.props.mode === 'signup'} onChange={(ev) => this.props.setEmail(ev.target.value)} />
            <label className="errorLabel">{this.props.emailError}</label>
            <Input type="password" id="password" label="password" disabled={this.props.mode === 'signup'} />
            <label className="errorLabel">{this.props.passwordError}</label>
          </div>
          <div className="form-group form-group--signup">
            <Input type="text" id="fullname" label="full name" disabled={this.props.mode === 'login'} />
            <Input type="email" id="email" label="email" disabled={this.props.mode === 'login'} />
            <Input type="password" id="createpassword" label="password" disabled={this.props.mode === 'login'} />
            <Input type="password" id="repeatpassword" label="repeat password" disabled={this.props.mode === 'login'} />
          </div>
        </div>
        <button className="button button--primary full-width mt-4" type="submit">{this.props.mode === 'login' ? 'Log In' : 'Sign Up'}</button>
      </form>
    );
  }
}

const Input = ({ id, type, label, disabled }) => (
  <input className="form-group__input" type={type} id={id} placeholder={label} disabled={disabled} />
);

export default LoginFormPop;