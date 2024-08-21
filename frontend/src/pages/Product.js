import { getProduct } from "services/apiRequestsShop";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Product.css";
import CategoryParentTree from "components/CategoryParentTree";
import { addToCart } from "services/apiRequestsShop";
export default function Product() {
  const params = useParams();
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [product, setProduct] = useState({
    name: "",
    category: null,
    description: "",
    price: "",
    sale_start: null,
    sale_end: null,
    is_on_sale: false,
    image: "",
    slug: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProduct(params.slug);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProduct();
  }, [params]);

  const handleQuantityChange = async (quantity) => {
    if (isNaN(quantity) || quantity < 1) {
      setError("Quantity must be a number greater than 0.");
      return;
    }
    setQuantity(quantity);
    setError("");
  };

  const handleAddToCartClick = async (product, event) => {
    event.stopPropagation();
    try {
      await addToCart(product.slug, quantity);
      setConfirmationMessage(`Product added to the cart!`);
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 3000); // Hide after 3 seconds
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  return (
    <div className='product-view-container d-flex flex-column mx-auto'>
      {showConfirmation && <div className='confirmation-message'>{confirmationMessage}</div>}
      <CategoryParentTree />
      <div className='product-top-info d-flex flex-row'>
        <div className='product-images'>
          <img src={product.image} alt={product.name} />
        </div>
        <div className='product-cart-info d-flex flex-column mx-auto'>
          <p>{product.name}</p>
          <p>{product.price} PLN</p>
          <div className=' d-flex flex-row me-2 justify-content-center align-items-center'>
            Quantity:
            <input
              type='number'
              value={quantity}
              onChange={(e) =>
                handleQuantityChange(Math.max(1, parseInt(e.target.value, 10)))
              }
              min='1'
              className='quantity-input form-control d-inline-block w-auto mx-2'
            />
            
            <button
              className='product-add-to-cart-btn'
              onClick={(event) => handleAddToCartClick(product, event)}
            >
              Add to cart
            </button>
          </div>
          {error && (
              <div className='error-message' style={{ color: "red", marginBottom: "10px" }}>
                {error}
              </div>
            )}
        </div>
      </div>
      <div className='product-description'>{product.description}</div>
    </div>
  );
}
