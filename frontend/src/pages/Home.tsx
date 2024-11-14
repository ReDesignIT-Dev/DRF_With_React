import Footer from "components/Footer";
import Header from "components/Header";
import MainPageContainer from "components/MainPageContainer";
import { Box } from "@mui/material";

export default function Home() {
  return (
    <>
      <Header />
      <Box
        sx={{
          backgroundImage: "url(redesignit_background.jpg)",
          backgroundSize: "cover",
          width: "100vw"
        }}
      >
      <MainPageContainer />
      </Box>
      <Footer />
    </>
  );
}
