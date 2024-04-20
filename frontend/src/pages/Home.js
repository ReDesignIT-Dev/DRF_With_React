import { useState, useEffect } from 'react';
export default function Home() {
  const [message, setMessage] = useState('');

  return (
    <div>
      <h1> Main page </h1>
 
      <p>{message}</p>

      <h1>Welcome to Our Shop</h1>

    </div>
  );
}