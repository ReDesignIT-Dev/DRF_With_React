import React from "react";
const mode = 'login';
const LoginFormPop = () => {
  return (
    <div className={`app app--is-${mode}`}>
      <LoginComponent
        mode={mode}
        onSubmit={
          function () {
            console.log('submit');
          }
        }
      />
    </div>
  )
};
class LoginComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: this.props.mode
    }
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
          <LoginForm mode={this.state.mode} onSubmit={this.props.onSubmit} />
        </section>
        </div>
    )
  }
}

class LoginForm extends React.Component {
  state = {
    mode: this.props.mode
  };
  render() {
    return (
      <form onSubmit={this.props.onSubmit}>
        <div className="form-block__input-wrapper">
          <div className="form-group form-group--login">
            <Input type="text" id="username" label="user name" disabled={this.props.mode === 'signup'} />
            <Input type="password" id="password" label="password" disabled={this.props.mode === 'signup'} />
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
    )
  }
}

const Input = ({ id, type, label, disabled }) => (
  <input className="form-group__input" type={type} id={id} placeholder={label} disabled={disabled} />
);

export default LoginFormPop;
