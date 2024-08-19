import React, { useEffect, useState } from "react";
import { getCart, updateCartItemQuantity, deleteCartItem } from "services/apiRequestsShop";
import Loading from "components/Loading";
import "./Cart.css";
import { FaRegTrashAlt } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap"; // Import React Bootstrap components

export default function Cart() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false); // State for controlling the modal visibility

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

  const handleCheckout = () => {
    setShowModal(true); // Show the modal
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
  };

  if (loading) {
    return <Loading />;
  }

  const cartItemList = () => (
    <>
      {items.map((item, index) => (
        <div
          key={item.product.slug}
          className={`basket-item d-flex align-items-center pb-3 mb-3 ${
            index !== items.length - 1 ? "border-bottom" : ""
          }`}
        >
          <img src={item.product.image} alt={item.product.name} className='me-3' />
          <div className='flex-grow-1'>
            <h4>{item.product.name}</h4>
            <p>Price: {item.price} PLN</p>
            <div className='d-flex align-items-center'>
              <div className='me-2'>
                Quantity:
                <input
                  type='number'
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(
                      item.product.slug,
                      Math.max(1, parseInt(e.target.value, 10))
                    )
                  }
                  min='1'
                  className='quantity-input form-control d-inline-block w-auto ms-2'
                />
              </div>
              <button
                onClick={() => handleRemoveItem(item.product.slug)}
                className='btn btn-danger d-flex align-items-center'
              >
                <FaRegTrashAlt />
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  );

  return (
    <div className='cart-container d-flex justify-content-center flex-column gap-2 text-center mx-auto'>
      <div className="mb-5 mt-2">
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
          <div className='d-flex flex-row justify-content-between'>
            <div className='cart-item-list'>{cartItemList()}</div>
            <div className='cart-summary d-flex flex-column'>
              <div className='cart-payment'>
                <h3>Total: {total} PLN</h3>
              </div>
              <div>
                <button className='checkout-button' onClick={handleCheckout}>
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal for Checkout Confirmation */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Checkout Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>You bought items for {total} PLN.</Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
