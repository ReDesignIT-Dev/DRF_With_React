import { useEffect, useState } from "react";
import { getAllProductsInCategory } from "services/apiRequestsShop";
import "./ProductList.css";
import useQueryParams from "hooks/useQueryParams";
import { useParams } from "react-router-dom";

export default function ProductList() {
  const params = useParams();
  const queryParams = useQueryParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProductsInCategory(params.slug);
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [params, queryParams]);

  const listProducts = () => {
    return (
      <>
        {products.map((product) => (
          <div key={product.slug} className='single-product-on-list d-flex flex-row w-100'>
            <img src={product.image} alt={product.name}></img>
            <div className='product-details d-flex justify-content-between w-100'>
              <h2>{product.name}</h2>
              <p className="product-price">{product.price} PLN</p>
            </div>
          </div>
        ))}
      </>
    );
  };

  return <div className='product-list-container d-flex flex-column gap-3 w-100 p-3'>{listProducts()}</div>;
}
