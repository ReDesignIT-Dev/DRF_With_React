import { useEffect, useState, MouseEvent } from "react";
import { getAllProductsInCategory, addToCart } from "services/apiRequestsShop";
import "./ProductList.css";
import useQueryParams from "hooks/useQueryParams";
import { useParams, useNavigate } from "react-router-dom";
import { API_PRODUCT_URL } from "config";
import { useAuth } from "hooks/useAuth";
import { addItemToCart } from "services/localStorageRequestsShop";

interface Product {
  name: string;
  slug: string;
  image: string;
  price: number;
}

interface ProductListProps {
  className?: string;
}

export default function ProductList({ className }: ProductListProps) {
  const params = useParams<{ slug: string }>();
  const queryParams = useQueryParams();
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();
  const [confirmationMessage, setConfirmationMessage] = useState<string>("");
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const isLoggedIn = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      if (!params.slug) {
        console.error("Category slug is undefined");
        return;
      }

      try {
        const response = await getAllProductsInCategory(params.slug);
        if (response && response.data) {
          setProducts(response.data.products);
        } else {
          console.error("Error fetching products: response is undefined or has no data");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [params, queryParams]);

  const handleNavigationClick = (slug: string, event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    navigate(`${API_PRODUCT_URL}/${slug}`);
  };

  const handleAddToCartClick = async (product: Product, event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (isLoggedIn) {
      try {
        await addToCart(product.slug, 1);
        setConfirmationMessage(`${product.name} was added to the cart!`);
        setShowConfirmation(true);
        setTimeout(() => setShowConfirmation(false), 3000); // Hide after 3 seconds
      } catch (error) {
        console.error("Error adding product to cart:", error);
      }
    } else {
      addItemToCart(product.slug, 1);
      setConfirmationMessage(`${product.name} was added to the cart!`);
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 3000); // Hide after 3 seconds
    }
  };

  const listProducts = () => {
    return (
      <>
        {products.map((product) => (
          <div
            key={product.slug}
            className='single-product-on-list d-flex flex-row w-100'
            role='button'
            onClick={(event) => handleNavigationClick(product.slug, event)}
          >
            <img src={product.image} alt={product.name}></img>
            <div className='product-details d-flex justify-content-between w-100'>
              <h2>{product.name}</h2>
              <div className='product-price-and-cart d-flex align-items-center'>
                <p className='product-price'>{product.price} PLN</p>
                <button
                  className='product-add-to-cart-btn'
                  onClick={(event) => handleAddToCartClick(product, event)}
                >
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </>
    );
  };

  return (
    <div className={`product-list-container d-flex flex-column gap-3 w-100 p-3 ${className}`}>
      {showConfirmation && <div className='confirmation-message'>{confirmationMessage}</div>}
      {listProducts()}
    </div>
  );
}