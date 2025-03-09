import { Box, Stack } from "@mui/material";
import ProductSearchList from "components/ProductSearchList";
import CategoryAssociatedTree from "components/CategoryAssociatedTree";

export default function SearchPage() {
  return (
    <Box maxWidth={1264} mx="auto">
      <Stack direction="row" spacing={3} mt={3} alignItems="flex-start">
        <Box flex={1} maxWidth="25%">
          <CategoryAssociatedTree />
        </Box>
        <Box flex={3} maxWidth="75%">
          <ProductSearchList />
        </Box>
      </Stack>
    </Box>
  );
}
