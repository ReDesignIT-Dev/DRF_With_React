import { Box, Stack } from "@mui/material";
import CategoryAssociatedTree from "components/CategoryAssociatedTree";
import { getAllSearchProducts } from "services/shopServices/apiRequestsShop";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useQueryParams from "hooks/useQueryParams";
import ProductList from "components/ProductList";
import NotFoundProducts from "./NotFoundProducts";

export default function SearchPage() {
  const { slug } = useParams() as { slug: string };
  const queryParams = useQueryParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [notFound, setNotFound] = useState<boolean>(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllSearchProducts(queryParams.string);
        if (response && response.data && response.data.products) {
          setNotFound(response.data.products.length < 1);
          setProducts(response.data.products);
        } else {
          console.error("No products found in response");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [slug, queryParams]);
  
  if (notFound) {
    return <NotFoundProducts />;
  }

  return (
    <Box maxWidth={1264} mx="auto">
      <Stack direction="row" spacing={3} mt={3} alignItems="flex-start">
        <Box flex={1} maxWidth="25%">
          <CategoryAssociatedTree />
        </Box>
        <Box flex={3} maxWidth="75%">
          <ProductList products={products} />
        </Box>
      </Stack>
    </Box>
  );
}
