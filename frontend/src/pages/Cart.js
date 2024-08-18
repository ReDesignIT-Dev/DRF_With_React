import React, { useEffect, useState } from "react";
import { getCart, updateCartItemQuantity, deleteCartItem } from "services/apiRequestsShop";
import Loading from "components/Loading";
import "./Cart.css";

export default function Cart() {
  const [cartData, setCartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        setTotal(1);
        const response = await getCart();
        setCartData(response.data);
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
      const updatedItems = cartData.items.map((item) =>
        item.id === itemId ? { ...item, quantity: response.data.quantity } : item
      );
      setCartData(updatedItems);
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
    const totalAmount = cartData.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    setTotal(totalAmount.toFixed(2));
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>{error}</div>;
  }
  const cartItemList = () => (
    <>
      {cartData.items.map((item) => (
        <div key={item.product.slug} className='basket-item'>
          <img src={item.product.image} alt={item.product.name} />
          <div>
            <h4>{item.product.name}</h4>
            <p>Price: ${item.price}</p>
            <p>
              Quantity:
              <input
                type='number'
                value={item.quantity}
                onChange={(e) =>
                  handleQuantityChange(item.product.slug, parseInt(e.target.value, 10))
                }
                min='1'
              />
            </p>
            <button onClick={() => handleRemoveItem(item.product.slug)}>Remove</button>
          </div>
        </div>
      ))}
    </>
  );

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="cart-container mx-auto">
      <h2>Your Basket</h2>
      {cartData.items.length === 0 ? (
        <p>Your basket is empty.</p>
      ) : (
        <div className='d-flex flex-row'>
          <div className='cart-item-list'>{cartItemList()}</div>
          <div className='cart-summary d-flex flex-column'>
            <div className="cart-payment"><h3>Total: ${total}</h3></div>
            <div><button className='checkout-button'>Proceed to Checkout</button></div>
          </div>
          
        </div>
      )}
    </div>
  );
}
