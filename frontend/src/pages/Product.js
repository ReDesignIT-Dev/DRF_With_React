import { getProduct } from "services/apiRequestsShop";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

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
        slug: ""
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
      <div className='product-view-container'>
        Product:
        {product.name}
        {product.image}
        {product.price}
      </div>
    );
  }