import { getProduct } from "services/apiRequestsShop";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Product.css";
import CategoryParentTree from "components/CategoryParentTree";

export default function Product() {
  const params = useParams();
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

  return (
    <div className='product-view-container d-flex flex-column mx-auto'>
      <CategoryParentTree />
      <div className='product-top-info d-flex flex-row'>
        <div className='product-images'>
          <img src={product.image} alt={product.name} />
        </div>
        <div className="product-cart-info d-flex flex-column mx-auto">
          <p>{product.name}</p>
          <p>{product.price}</p>
        </div>
      </div>
      <div className='product-description'>{product.description}</div>
    </div>
  );
}
