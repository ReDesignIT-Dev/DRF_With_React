import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import NotFound from "pages/NotFound";
import { Box } from "@mui/material";
import Home from "./Home";
import Header from "components/Header";
import Footer from "components/ShopFooter";

function MainPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundImage: "url(redesignit_background.jpg)",
        backgroundSize: "cover",
        width: "100vw",
      }}
    >
      <Header />
      <Box
        sx={{
          flex: 1, // Fills the remaining vertical space
        }}
      >
        <Routes>
          <Route path="" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Box>
      <Footer />
    </Box>
  );
}

export default MainPage;
