import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import './Login.css';
import './Login.scss';

export function Login() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        axios.get('http://localhost:8000/login')
            .then(response => {
                setMessage(response.data.message);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const onButtonClick = () => {
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
    }

    return (
        <div>
            <h1>Login page</h1>
            <nav>
                <Link to="/">Home</Link>
                <Link to="/contact">Contact</Link>
                <Link to="/about">About</Link>
            </nav>
            <p>{message}</p>
            <div className={"mainContainer d-flex flex-column justify-content-center align-items-center text-align-middle"}>
                <div className={"titleContainer"}>
                    <div>Login</div>
                </div>
                <br />
                <div className={"inputContainer py-3"}>
                    <input
                        value={email}
                        placeholder="Enter your email here"
                        onChange={ev => setEmail(ev.target.value)}
                        className={"inputBox"}
                    />
                    <label className="errorLabel">{emailError}</label>
                </div>
                <br />
                <div className={"inputContainer py-3"}>
                    <input
                        type="password"
                        value={password}
                        placeholder="Enter your password here"
                        onChange={ev => setPassword(ev.target.value)}
                        className={"inputBox"}
                    />
                    <label className="errorLabel">{passwordError}</label>
                </div>
                <br />
                <div className={"inputContainer d-flex justify-content-center"}>
                    <input
                        className={"inputButton mx-auto"}
                        type="button"
                        onClick={onButtonClick}
                        value={"Log in"}
                    />
                </div>
            </div>
        </div>
    );
}
