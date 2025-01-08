import { useEffect, useState, MouseEvent } from "react";
import "./ProductList.css";
import useQueryParams from "hooks/useQueryParams";
import { useParams, useNavigate, generatePath } from "react-router-dom";
import { FRONTEND_PRODUCT_URL, FRONTEND_SHOP_URL } from "config";
import { getAllSearchProducts } from "services/shopServices/apiRequestsShop";
import shopDefaultImage from "assets/images/shop_default_image.jpg";

interface ProductListProps {
  className?: string;
}

export default function ProductList({ className }: ProductListProps) {
  const params = useParams();
  const queryParams = useQueryParams();
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllSearchProducts(queryParams.string);
        if (response && response.data && response.data.products) {
          setProducts(response.data.products);
        } else {
          console.error("No products found in response");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [params, queryParams]);

  const handleNavigationClick = (slug: string, event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    const productPath = generatePath(FRONTEND_PRODUCT_URL, { slug });
    navigate(productPath);
  };

  const listProducts = () => {
    if (products.length === 0) {
      return <p>No products found</p>;
    }

    return (
      <>
        {products.map((product) => (
          <div
            key={product.slug}
            className='single-product-on-list d-flex flex-row w-100'
            role='button'
            onClick={(event) => handleNavigationClick(product.slug, event)}
          >
            <img
              src={
                product.images.length > 0 && product.images[0].src
                  ? product.images[0].src
                  : shopDefaultImage
              }
              alt={product.images.length > 0 && product.images[0].altText
                ? product.images[0].altText
                : "Default Image"}
              className="cart-item-image me-3"
            />
            <div className='product-details d-flex justify-content-between w-100'>
              <h2>{product.name}</h2>
              <p className='product-price'>{product.price} PLN</p>
            </div>
          </div>
        ))}
      </>
    );
  };

  return (
    <div className={`product-list-container d-flex flex-column gap-3 w-100 p-3 ${className}`}>
      {listProducts()}
    </div>
  );
}