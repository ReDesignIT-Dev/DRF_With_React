import { getProduct } from "services/apiRequestsShop";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

export default function Product() {
    const params = useParams();

    useEffect(() => {
        const fetchProduct = async () => {
          try {
            const response = await getProduct(params.slug);
            console.log(response.data);
          } catch (error) {
            console.error("Error fetching products:", error);
          }
        };
        fetchProduct();
      }, [params]);

    return (
      <div className='product-view-container'>
        Product
      </div>
    );
  }