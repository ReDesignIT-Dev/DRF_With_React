import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getAllProductsInCategory } from "services/apiRequestsShop";

export default function Category() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);

  const queryEntries = {};
  for (let [key, value] of searchParams.entries()) {
    queryEntries[key] = value;
  }

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
  }, [params, searchParams]);

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
      <pre>{JSON.stringify(queryEntries, null, 2)}</pre>
    </div>
  );
}
