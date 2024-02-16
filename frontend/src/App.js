import './App.css';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link, Outlet} from "react-router-dom";
import axios from 'axios';

function Home() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/')
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);
  return (
    <div>
      <h1> Main page </h1>
      <nav>
        <Link to="/"> Home </Link>
        <Link to="/contact"> Contact </Link>
        <Link to="/about"> About </Link>
        <Link to="/login"> Login </Link>
      </nav>
      <p>{message}</p>
    </div>
  );
}

export function About() {
  return (
    <div>
      <h1> About this website </h1>
      <nav>
        <Link to="/"> Home </Link>
        <Link to="/contact"> Contact </Link>
        <Link to="/about"> About </Link>
        <Link to="/login"> Login </Link>
        <Link to="/about/history"> History </Link>
      </nav>
      <Outlet />
    </div>
  );
}

export function Contact() {
  return (
    <div>
      <h1> Contact form for the website </h1>
      <nav>
        <Link to="/"> Home </Link>
        <Link to="/contact"> Contact </Link>
        <Link to="/about"> About </Link>
        <Link to="/login"> Login </Link>
      </nav>
    </div>
  );
}

export function History() {
  return (
    <div>
      <h1> History of this page </h1>
    </div>
  );
}

export function App(){
  return <Home />;
}


export default App;
