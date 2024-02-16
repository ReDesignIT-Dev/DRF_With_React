import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link} from "react-router-dom";
import axios from 'axios';
import './Login.css';

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
    return (
      <div>
        <h1> Login page </h1>
        <nav>
          <Link to="/"> Home </Link>
          <Link to="/contact"> Contact </Link>
          <Link to="/about"> About </Link>
        </nav>
        <p>{message}</p>
      </div>
    );
  }