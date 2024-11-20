import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid2,
} from "@mui/material";

const Home: React.FC = () => {
  return (
    <>
      <Box
        sx={{
          height: "25vh",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          flexDirection: "column",
          color: "#fff",
          paddingX: { xs: 4, md: 8, lg: 16 },
          paddingY: { xs: 4, md: 8 },
          width: "100vw",
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to ReDesignIT
        </Typography>
        <Typography variant="h6" sx={{ textAlign: "right" }}>
          A portfolio by Arkadiusz Budkowski – Showcasing innovative web
          solutions
        </Typography>
      </Box>

      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          My Projects
        </Typography>
        <Grid2 container spacing={4} sx={{ display: "flex", flexWrap: "wrap" }}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Grid2
              container
              size={{ xs: 12, sm: 6, md: 4 }}
              key={index}
              sx={{ display: "flex" }}
            >
              <Card sx={{ width: "100%" }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={`https://source.unsplash.com/featured/?project,${index}`}
                  alt={`Project ${index + 1}`}
                />
                <CardContent>
                  <Typography variant="h5" component="div">
                    Project {index + 1}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Description of project {index + 1}, highlighting key
                    features and technologies used.
                  </Typography>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      </Container>
    </>
  );
};
export default Home;
