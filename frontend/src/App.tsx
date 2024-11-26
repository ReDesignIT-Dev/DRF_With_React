import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Shop from "pages/Shop";
import NotFound from "pages/NotFound";
import { FRONTEND_SHOP_URL } from "config";
import MainPage from "pages/MainPage";
import { Box } from "@mui/material";

function App() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<MainPage />} />
          <Route path={`${FRONTEND_SHOP_URL}/*`} element={<Shop />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </Box>
  );
}

export default App;
