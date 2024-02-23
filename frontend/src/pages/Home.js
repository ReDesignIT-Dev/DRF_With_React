import axios from 'axios';
import { useState, useEffect } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products or data from an API
    // For now, let's mock some data
    const mockProducts = [
      { id: 1, name: 'Product 1', price: 19.99 },
      { id: 2, name: 'Product 2', price: 29.99 },
      { id: 3, name: 'Product 3', price: 39.99 },
    ];

    setProducts(mockProducts);
  }, []);
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



      <h1>Welcome to Our Shop</h1>
      <p>Discover our amazing products:</p>

      <ul>
        {products.map(product => (
          <li key={product.id}>
            <h3>{product.name}</h3>
            <p>Price: ${product.price}</p>
            {/* Add more product details or buttons as needed */}
          </li>
        ))}
      </ul>
    </div>
  );
}