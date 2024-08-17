import React, { useEffect, useState } from "react";
import { getCart, updateCartItemQuantity, deleteCartItem } from "services/apiRequestsShop";
import Loading from "components/Loading";
import "./Cart.css";

export default function Cart() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        setTotal(1);
        const response = await getCart();
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const handleQuantityChange = async (itemId, quantity) => {
    try {
      const response = await updateCartItemQuantity(itemId, quantity);
      const updatedItems = items.map((item) =>
        item.id === itemId ? { ...item, quantity: response.data.quantity } : item
      );
      setItems(updatedItems);
      calculateTotal();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const response = await deleteCartItem(itemId);
      console.log(response.data);
      calculateTotal();
    } catch (error) {
      setError(error.message);
    }
  };

  const calculateTotal = () => {
    const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    setTotal(totalAmount.toFixed(2));
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Your Basket</h2>
      {items.length === 0 ? (
        <p>Your basket is empty.</p>
      ) : (
        <div>
          {items.map((item) => (
            <div key={item.id} className='basket-item'>
              <img src={item.product.image_url} alt={item.product.name} />
              <div>
                <h4>{item.product.name}</h4>
                <p>Price: ${item.price}</p>
                <p>
                  Quantity:
                  <input
                    type='number'
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.slug, e.target.value)}
                    min='1'
                  />
                </p>
                <button onClick={() => handleRemoveItem(item.slug)}>Remove</button>
              </div>
            </div>
          ))}
          <div className='basket-total'>
            <h3>Total: ${total}</h3>
          </div>
          <button className='checkout-button'>Proceed to Checkout</button>
        </div>
      )}
    </div>
  );
}
