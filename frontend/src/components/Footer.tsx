import "./Footer.css";
import { Box, Typography, Link } from "@mui/material";
import { LinkedIn, GitHub, YouTube } from "@mui/icons-material";

const Footer: React.FC = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#333",
        color: "#fff",
        py: 3,
        px: 2,
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Empty box as a spacer to center the text */}
      <Box sx={{ flex: 1 }} />

      {/* Centered Typography */}
      <Typography variant="body2" sx={{ textAlign: "center", flex: 1 }}>
        © 2024 ReDesignIT. All rights reserved.
      </Typography>

      {/* Icons on the right */}
      <Box sx={{ display: "flex", gap: 2, flex: 1, justifyContent: "flex-end" }}>
        <Link href="https://www.linkedin.com/in/arkadiusz-budkowski/" color="inherit" underline="none">
          <LinkedIn fontSize="large" />
        </Link>
        <Link href="https://github.com/Hamster-Inside" color="inherit" underline="none">
          <GitHub fontSize="large" />
        </Link>
        <Link href="https://www.youtube.com/@ReDesignIT" color="inherit" underline="none">
          <YouTube fontSize="large" />
        </Link>
      </Box>
    </Box>
  );
};

export default Footer;
