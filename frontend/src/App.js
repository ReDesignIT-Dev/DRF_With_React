import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from 'pages/Home';
import About from "pages/About";
import Contact from "pages/Contact";
import Header from "components/Header";
import Footer from "components/Footer";
import NotFound from "pages/NotFound";
import PasswordReset from "pages/PasswordReset.js";
import UserActivation from "pages/UserActivation.js";
import PasswordRecovery from 'pages/PasswordRecovery';
import { FRONTEND_PASSWORD_RESET_URL, FRONTEND_PASSWORD_RECOVERY_URL, FRONTEND_ACTIVATE_USER_URL } from 'config';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route exact path="" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} /> 
        <Route path={FRONTEND_PASSWORD_RECOVERY_URL} element={<PasswordRecovery />} />
        <Route path={FRONTEND_PASSWORD_RESET_URL} element={<PasswordReset />} />
        <Route path={FRONTEND_ACTIVATE_USER_URL} element={<UserActivation />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );

}

export default App;
