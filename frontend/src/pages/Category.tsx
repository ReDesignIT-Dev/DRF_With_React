import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductList from "components/ProductList";
import CategoryTree from "components/CategoryTree";
import CategoryTopBar from "components/CategoryTopBar";
import NotFound from "./NotFound";
import { Box, Button, Dialog, DialogTitle, IconButton, Grid2 } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { getIdFromSlug } from "utils/utils";
import { useSelector } from "react-redux";
import { RootState } from "reduxComponents/store";
import { selectFlatCategoryById, selectTreeCategoryById } from "reduxComponents/reduxShop/Categories/selectors";
import { getAllProductsInCategory } from "services/shopServices/apiRequestsShop";

export default function Category() {
  const [categoryNotFound, setCategoryNotFound] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const { slug } = useParams() as { slug: string };
  const categoryId = getIdFromSlug(slug);
  const category = useSelector((state: RootState) => (categoryId !== null ? selectFlatCategoryById(state, categoryId) : null));
  const categoryTree = useSelector((state: RootState) => (categoryId !== null ? selectTreeCategoryById(state, categoryId) : null));

  useEffect(() => {
    setCategoryNotFound(!category);
  }, [category, categoryTree]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (categoryId) {
        try {
          const response = await getAllProductsInCategory(categoryId);
          if (response?.data) {
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
  }, [categoryId]);

  const handleDialogOpen = () => setIsDialogOpen(true);
  const handleDialogClose = () => setIsDialogOpen(false);

  if (categoryNotFound) {
    return <NotFound />;
  }

  return (
    <>
      {slug && category && (
        <Box display="flex" flexDirection="column" mx="auto" gap={3} sx={{ maxWidth: 1264 }}>
          <CategoryTopBar category={category} />

          <Grid2 container spacing={3} sx={{ flexDirection: { xs: "column", md: "row" } }}>
            {/* Button for smaller screens */}
            <Grid2 sx={{ display: { xs: "block", md: "none" }, width: "100%" }}>
              <Button variant="contained" color="primary" fullWidth onClick={handleDialogOpen}>
                Subcategories
              </Button>
            </Grid2>

            {/* CategoryTree for larger screens */}
            <Grid2
              sx={{
                display: { xs: "none", md: "block" },
                backgroundColor: "lightGray",
                padding: 2,
                borderRadius: 1,
                flexBasis: "25%",
                flexShrink: 0,
                boxSizing: "border-box",
              }}
            >
              <CategoryTree categoryTree={categoryTree} />
            </Grid2>

            {/* ProductList */}
            <Grid2
              sx={{
                backgroundColor: "lightGray",
                padding: 2,
                borderRadius: 1,
                flexGrow: 1,
                flexBasis: { md: "70%" },
                boxSizing: "border-box",
              }}
            >
              <ProductList products={products} />
            </Grid2>
          </Grid2>

          {/* Dialog for CategoryTree */}
          <Dialog fullScreen open={isDialogOpen} onClose={handleDialogClose} PaperProps={{ sx: { backgroundColor: "background.default" } }}>
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>Subcategories</span>
              <IconButton onClick={handleDialogClose}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <Box p={3}>
              <CategoryTree categoryTree={categoryTree} />
            </Box>
          </Dialog>
        </Box>
      )}
    </>
  );
}
