import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAllProductsInCategory } from "services/apiRequestsShop";
import useQueryParams from "hooks/useQueryParams";

export default function Category() {
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
      <>
        {products.map((product) => (
          <div key={product.slug}>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
          </div>
        ))}
      </>
    );
  };

  return (
    <div>
      <h1>Path Parameters</h1>
      <pre>{JSON.stringify(params, null, 2)}</pre>
      {listProducts()}
      <h1>Query Parameters</h1>
      <pre>{JSON.stringify(queryParams, null, 2)}</pre>
    </div>
  );
}
