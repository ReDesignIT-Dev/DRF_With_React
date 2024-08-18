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
        const response = await getCart();
        const responseItems = response.data;
        setItems(responseItems);
        calculateTotal(responseItems);
      } catch (error) {
        //console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const handleQuantityChange = async (itemSlug, quantity) => {
    if (isNaN(quantity) || quantity < 1) {
      setError("Quantity must be a number greater than 0.");
      return;
    }
    setError("");
    try {
      const response = await updateCartItemQuantity(itemSlug, quantity);
      const updatedItems = items.map((item) =>
        item.product.slug === itemSlug ? { ...item, quantity: response.data.quantity } : item
      );
      setItems(updatedItems);
      calculateTotal(updatedItems);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleRemoveItem = async (itemSlug) => {
    try {
      await deleteCartItem(itemSlug);
      const updatedItems = items.filter((item) => item.product.slug !== itemSlug);
      setItems(updatedItems);
      calculateTotal(updatedItems);
    } catch (error) {
      setError(error.message);
    }
  };

  const calculateTotal = (updatedItems) => {
    const totalAmount = updatedItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
    setTotal(totalAmount.toFixed(2));
  };

  if (loading) {
    return <Loading />;
  }

  const cartItemList = () => (
    <>
      {items.map((item) => (
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
                  handleQuantityChange(item.product.slug, Math.max(1, parseInt(e.target.value, 10)))
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

  return (
    <div className='cart-container d-flex justify-content-center flex-column gap-2 text-center mx-auto'>
      <div>
        <h2>Your Basket</h2>
      </div>
      {items.length === 0 ? (
        <p>Your basket is empty.</p>
      ) : (
        <>
          {error && (
            <div className='error-message' style={{ color: "red", marginBottom: "10px" }}>
              {error}
            </div>
          )}
          <div className='d-flex flex-row justify-content-center gap-3'>
            <div className='cart-item-list'>{cartItemList()}</div>
            <div className='cart-summary d-flex flex-column'>
              <div className='cart-payment'>
                <h3>Total: ${total}</h3>
              </div>
              <div>
                <button className='checkout-button'>Proceed to Checkout</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
