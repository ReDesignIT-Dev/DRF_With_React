import "./Footer.css";
import { Box, Typography, Link } from "@mui/material";
const Footer: React.FC = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#333",
        color: "#fff",
        py: 3,
        textAlign: "center",
      }}
    >
      <Typography variant="body2">
        © 2024 ReDesignIT. All rights reserved.
      </Typography>
      <Link href="#" color="inherit" underline="hover" sx={{ mx: 1 }}>
        LinkedIn
      </Link>
      <Link href="#" color="inherit" underline="hover" sx={{ mx: 1 }}>
        GitHub
      </Link>
      <Link href="#" color="inherit" underline="hover" sx={{ mx: 1 }}>
        YouTube
      </Link>
    </Box>
  );
};

export default Footer;
