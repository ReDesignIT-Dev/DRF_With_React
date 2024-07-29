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
        setProducts(response.data.products); // Assuming products are in response.data.products
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [params, queryParams]);

  const listProducts = () => {
    return (
      <div>
        <div>
          {products.map((product) => (
            <div key={product.slug}>
              <h2>{product.name}</h2>
              <p>{product.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className='product-list-container'>
      <h1>Path Parameters</h1>
      <pre>{JSON.stringify(params, null, 2)}</pre>
      {listProducts()}
      <h1>Query Parameters</h1>
      <pre>{JSON.stringify(queryParams, null, 2)}</pre>
    </div>
  );
}
