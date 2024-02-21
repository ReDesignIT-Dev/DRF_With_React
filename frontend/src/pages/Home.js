import axios from 'axios';
import { useState, useEffect } from 'react';

export default function Home() {
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

        <p>{message}</p>
      </div>
    );
  }