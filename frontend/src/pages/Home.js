import { getData } from 'services/apiRequests';
import { useState, useEffect } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');

  useEffect(() => {

    async function fetchData() {
      try {
        const response = await getData('');
        setMessage(response.message);
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, []);
  return (
    <div>
      <h1> Main page </h1>

      <p>{message}</p>

      <h1>Welcome to Our Shop</h1>

    </div>
  );
}