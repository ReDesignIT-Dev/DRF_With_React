import { useParams, useSearchParams } from "react-router-dom";
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
import Loading from "components/Loading";

export default function Category() {
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [products, setProducts] = useState<Product[]>([]);
  const { slug } = useParams() as { slug: string };
  const [searchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const categoryId = getIdFromSlug(slug);
  const category = useSelector((state: RootState) => (categoryId !== null ? selectFlatCategoryById(state, categoryId) : null));
  const categoryTree = useSelector((state: RootState) => (categoryId !== null ? selectTreeCategoryById(state, categoryId) : null));
  const isCategoryResolved = category !== null;

  useEffect(() => {
    const fetchProducts = async () => {
      if (categoryId) {
        setIsLoading(true);
        try {
          const response = await getAllProductsInCategory(categoryId, pageParam);
          if (response?.data) {
            setProducts(response.data.results);
            setTotalPages(response.data.totalPages);
          } else {
            console.error("Error fetching products: response is undefined or has no data");
          }
        } catch (error) {
          console.error("Error fetching products:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchProducts();
  }, [categoryId, pageParam]);
  
   const handleDialogOpen = () => setIsDialogOpen(true);
  const handleDialogClose = () => setIsDialogOpen(false);

  if (!isCategoryResolved || isLoading) {
    console.log("loading...");
    return <Loading />;
  }
  
  if (category === null) {
    console.log("not found...");
    return <NotFound />;
  }
  
  
  const renderPagination = () => {
    return (
      <Box display="flex" justifyContent="flex-end" gap={1} mb={1}>
        {Array.from({ length: totalPages }, (_, i) => (
          <Button
            key={i + 1}
            variant={pageParam === i + 1 ? "contained" : "outlined"}
            onClick={() => {
              const params = new URLSearchParams(searchParams);
              params.set("page", String(i + 1));
              window.history.pushState({}, "", `?${params.toString()}`);
              window.location.reload();
            }}
          >
            {i + 1}
          </Button>
        ))}
      </Box>
    );
  };
  
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
              {renderPagination()}
              <ProductList products={products} />
              {renderPagination()}
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
