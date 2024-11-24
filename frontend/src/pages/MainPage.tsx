import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import NotFound from "pages/NotFound";
import { Box } from "@mui/material";
import Home from "./Home";
import Header from "components/Header";
import Footer from "components/ShopFooter";
import { FRONTEND_ABOUT_URL } from "config";
import About from "./About";

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
        <Routes>
          <Route path="" element={<Home />} />
          <Route path={FRONTEND_ABOUT_URL} element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      <Footer />
    </Box>
  );
}

export default MainPage;
