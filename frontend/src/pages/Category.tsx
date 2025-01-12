import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { validateIfCategoryExists } from "services/shopServices/apiRequestsShop";
import ProductList from "components/ProductList";
import CategoryTree from "components/CategoryTree";
import CategoryTopBar from "components/CategoryTopBar";
import NotFound from "./NotFound";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  IconButton,
  Grid2,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function Category() {
  const params = useParams<Record<string, string>>();
  const [isValidCategory, setIsValidCategory] = useState<boolean>(false);
  const [categoryNotFound, setCategoryNotFound] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const checkCategory = async () => {
      try {
        if (params.slug) {
          const exists = await validateIfCategoryExists(params.slug);
          if (exists) {
            setIsValidCategory(true);
          } else {
            setCategoryNotFound(true);
          }
        } else {
          setCategoryNotFound(true);
        }
      } catch (error) {
        console.error("Error checking category:", error);
        setCategoryNotFound(true);
      }
    };

    checkCategory();
  }, [params.slug]);

  const handleDialogOpen = () => setIsDialogOpen(true);
  const handleDialogClose = () => setIsDialogOpen(false);

  if (categoryNotFound) {
    return <NotFound />;
  }

  return (
    <>
      {isValidCategory && params.slug && (
        <Box
          display="flex"
          flexDirection="column"
          mx="auto"
          gap={3}
          sx={{ maxWidth: 1264,  }}
        >
          <CategoryTopBar
            currentCategory={params.slug}
          />

          <Grid2
            container
            spacing={3}
            sx={{ flexDirection: { xs: "column", md: "row" } }}
          >
            {/* Button for smaller screens */}
            <Grid2
              sx={{
                display: { xs: "block", md: "none" },
                width: "100%",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleDialogOpen}
              >
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
              <CategoryTree />
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
              <ProductList />
            </Grid2>
          </Grid2>

          {/* Dialog for CategoryTree */}
          <Dialog
            fullScreen
            open={isDialogOpen}
            onClose={handleDialogClose}
            PaperProps={{ sx: { backgroundColor: "background.default" } }}
          >
            <DialogTitle
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>Subcategories</span>
              <IconButton onClick={handleDialogClose}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <Box p={3}>
              <CategoryTree />
            </Box>
          </Dialog>
        </Box>
      )}
    </>
  );
}
