import { useParams, useSearchParams, useNavigate } from "react-router-dom";
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
import { TextField } from "@mui/material";

export default function Category() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { slug } = useParams() as { slug: string };
  const categoryId = getIdFromSlug(slug);
  const category = useSelector((state: RootState) => (categoryId !== null ? selectFlatCategoryById(state, categoryId) : null));
  const categoryTree = useSelector((state: RootState) => (categoryId !== null ? selectTreeCategoryById(state, categoryId) : null));

  if (category === undefined) {
    return <Loading />;
  }

  if (category === null) {
    return <NotFound />;
  }

  const handleDialogOpen = () => setIsDialogOpen(true);
  const handleDialogClose = () => setIsDialogOpen(false);

  return (
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

        {/* ProductList section */}
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
          <CategoryProducts categoryId={category.id} />
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
  );
}

// ===============================
// Extracted: <CategoryProducts />
// ===============================

function CategoryProducts({ categoryId }: { categoryId: number }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [pageInput, setPageInput] = useState(pageParam);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await getAllProductsInCategory(categoryId, pageParam);
        if (response?.data) {
          // Keep old products until new ones are ready
          setProducts(response.data.products);
          setTotalPages(response.data.totalPages);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId, pageParam]);

  useEffect(() => {
    setPageInput(pageParam); // sync input if page changes externally
  }, [pageParam]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
  
    if (newPage === 1) {
      params.delete("page"); // Remove ?page=1 if going to first page
    } else {
      params.set("page", String(newPage));
    }
  
    const query = params.toString();
    navigate(query ? `?${query}` : "");
  };
  

  const renderPagination = () => (
    <Box display="flex" alignItems="center" justifyContent="flex-end" gap={1} mb={2}>
      <Button variant="outlined" onClick={() => handlePageChange(pageParam - 1)} disabled={pageParam <= 1}>
        ←
      </Button>

      <TextField
        type="number"
        size="small"
        value={pageInput}
        onChange={(e) => setPageInput(Number(e.target.value))}
        onBlur={() => {
          if (pageInput >= 1 && pageInput <= totalPages && pageInput !== pageParam) {
            handlePageChange(pageInput);
          } else {
            setPageInput(pageParam); // reset if invalid
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            (e.target as HTMLInputElement).blur(); // trigger blur logic
          }
        }}
        slotProps={{
          htmlInput: {
            min: 1,
            max: totalPages,
            style: { textAlign: "center" },
          },
        }}
        sx={{
          width: 80,
          "& input[type=number]": {
            MozAppearance: "textfield",
          },
          "& input[type=number]::-webkit-outer-spin-button": {
            WebkitAppearance: "none",
            margin: 0,
          },
          "& input[type=number]::-webkit-inner-spin-button": {
            WebkitAppearance: "none",
            margin: 0,
          },
        }}
      />

      <Box component="span">of {totalPages}</Box>

      <Button variant="outlined" onClick={() => handlePageChange(pageParam + 1)} disabled={pageParam >= totalPages}>
        →
      </Button>
    </Box>
  );

  return (
    <>
      {renderPagination()}
      <Box sx={{ opacity: isLoading ? 0.5 : 1, transition: "opacity 0.3s" }}>
        <ProductList products={products} />
      </Box>
      {renderPagination()}
    </>
  );
}
