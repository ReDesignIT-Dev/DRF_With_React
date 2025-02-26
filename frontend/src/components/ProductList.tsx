import { useEffect, useState, MouseEvent } from "react";
import { getAllProductsInCategory } from "services/shopServices/apiRequestsShop";
import { useCart } from "services/shopServices/cartLogic";
import "./ProductList.css";
import useQueryParams from "hooks/useQueryParams";
import { useParams, useNavigate, generatePath } from "react-router-dom";
import { FRONTEND_PRODUCT_URL } from "config";
import shopDefaultImage from "assets/images/shop_default_image.jpg";
import { getIdFromSlug } from "utils/utils";

export default function ProductList() {
  const { slug } = useParams() as { slug: string };
  const queryParams = useQueryParams();
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();
  const [confirmationMessage, setConfirmationMessage] = useState<string>("");
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const categoryId = getIdFromSlug(slug);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      if (categoryId) {
        try {
          const response = await getAllProductsInCategory(categoryId);
          if (response && response.data) {
            setProducts(response.data);
          } else {
            console.error("Error fetching products: response is undefined or has no data");
          }
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      }
    };
    fetchProducts();
  }, [slug, queryParams]);

  const handleNavigationClick = (slug: string, event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    const productPath = generatePath(FRONTEND_PRODUCT_URL, { slug });
    navigate(productPath);
  };

  const handleAddToCartClick = async (product: Product, event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    try {
      await addToCart(product, 1);
      setConfirmationMessage(`${product.name} was added to the cart!`);
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 3000);
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  const listProducts = () => {
    return (
      <>
        {products.map((product) => {
          const imageSrc = product.images && product.images.length > 0 ? product.images[0].src : shopDefaultImage;

          const imageAlt = product.images && product.images.length > 0 && product.images[0].altText ? product.images[0].altText : product.name;
          return (
            <div
              key={product.id}
              className="single-product-on-list d-flex flex-row w-100"
              role="button"
              onClick={(event) => handleNavigationClick(product.slug, event)}
            >
              <img src={imageSrc} alt={imageAlt} />
              <div className="product-details d-flex justify-content-between w-100">
                <h2>{product.name}</h2>
                <div className="product-price-and-cart d-flex align-items-center">
                  <p className="product-price">{product.price} PLN</p>
                  <button className="product-add-to-cart-btn" onClick={(event) => handleAddToCartClick(product, event)}>
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </>
    );
  };

  return (
    <div className={`product-list-container d-flex flex-column gap-3 w-100 p-3`}>
      {showConfirmation && <div className="confirmation-message">{confirmationMessage}</div>}
      {listProducts()}
    </div>
  );
}
