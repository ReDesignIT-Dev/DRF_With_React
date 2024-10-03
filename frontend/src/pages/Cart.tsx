import React, { useEffect, useState, MouseEvent } from "react";
import { getCart, updateCart, deleteFromCart } from "services/shopServices/cartLogic";
import Loading from "components/Loading";
import "./Cart.css";
import { FaRegTrashAlt } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap"; // Import React Bootstrap components
import { useAuth } from "hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { API_PRODUCT_URL } from "config";
import { Typography } from "@mui/material";

interface Product {
  slug: string;
  name: string;
  image: string;
  price: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

export default function Cart() {
  const isLoggedIn = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<string>("0");
  const [showModal, setShowModal] = useState<boolean>(false); // State for controlling the modal visibility
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const responseItems: CartItem[] = await getCart(isLoggedIn);
        setItems(responseItems);
        calculateTotal(responseItems);
      } catch (error) {
        setError("Error fetching products.");
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [isLoggedIn]);

  const handleQuantityChange = async (product: Product, quantity: number) => {
    if (isNaN(quantity) || quantity < 1) {
      setError("Quantity must be a number greater than 0.");
      return;
    }
    setError("");
    try {
      await updateCart(isLoggedIn, product, quantity);
      const updatedItems = items.map((item) =>
        item.product && item.product.slug === product.slug
          ? { ...item, quantity }
          : item
      );
      setItems(updatedItems);
      calculateTotal(updatedItems);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleRemoveItem = async (product: Product) => {
    try {
      await deleteFromCart(isLoggedIn, product);
      const updatedItems = items.filter(
        (item) => item.product && item.product.slug !== product.slug
      );
      setItems(updatedItems);
      calculateTotal(updatedItems);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleNavigationClick = (
    slug: string,
    event: MouseEvent<HTMLDivElement>
  ) => {
    event.stopPropagation();
    navigate(`${API_PRODUCT_URL}/${slug}`);
  };

  const calculateTotal = (updatedItems: CartItem[]) => {
    const totalAmount = updatedItems.reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0
    );
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
      {items.map((item, index) =>
        item.product ? (
          <div
            key={item.product.slug}
            className={`basket-item d-flex align-items-center pb-3 mb-3 ${
              index !== items.length - 1 ? "border-bottom" : ""
            }`}
          >
            <img
              src={item.product.image}
              alt={item.product.name}
              className="me-3"
            />
            <div className="flex-grow-1">
              <Typography
                key={item.product.slug}
                variant="h6"
                component="h4"
                onClick={(event) => handleNavigationClick(item.product.slug, event)}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    color: 'blue', // Change this to your desired hover color
                  },
                }}
              >
                {item.product.name}
              </Typography>
              <p>Price: {item.product.price} PLN</p>
              <div className="d-flex align-items-center">
                <div className="me-2">
                  Quantity:
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(
                        item.product,
                        Math.max(1, parseInt(e.target.value, 10))
                      )
                    }
                    min="1"
                    className="quantity-input form-control d-inline-block w-auto ms-2"
                  />
                </div>
                <button
                  onClick={() => handleRemoveItem(item.product)}
                  className="btn btn-danger d-flex align-items-center"
                >
                  <FaRegTrashAlt />
                </button>
              </div>
            </div>
          </div>
        ) : null
      )}
    </>
  );

  return (
    <div className="cart-container d-flex justify-content-center flex-column gap-2 text-center mx-auto">
      <div className="mb-5 mt-2">
        <h2>Your Basket</h2>
      </div>
      {items.length === 0 ? (
        <p>Your basket is empty.</p>
      ) : (
        <>
          {error && (
            <div
              className="error-message"
              style={{ color: "red", marginBottom: "10px" }}
            >
              {error}
            </div>
          )}
          <div className="d-flex flex-row justify-content-between">
            <div className="cart-item-list">{cartItemList()}</div>
            <div className="cart-summary d-flex flex-column">
              <div className="cart-payment">
                <h3>Total: {total} PLN</h3>
              </div>
              <div>
                <button className="checkout-button" onClick={handleCheckout}>
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
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}