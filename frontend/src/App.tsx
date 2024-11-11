import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Home from "pages/Home";
import Shop from "pages/Shop";
import Header from "components/Header";
import Footer from "components/Footer";
import NotFound from "pages/NotFound";
import { FRONTEND_SHOP_URL } from "config";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path={`${FRONTEND_SHOP_URL}/*`} element={<Shop />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
