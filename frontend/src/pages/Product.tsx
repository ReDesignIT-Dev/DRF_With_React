import React, { useEffect, useState, ChangeEvent, MouseEvent } from "react";
import { useParams } from "react-router-dom";
import { getProduct } from "services/shopServices/apiRequestsShop";
import { useCart } from "services/shopServices/cartLogic";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import {
  Box,
  Grid,
  Typography,
  Button,
  TextField,
  Card,
  CardMedia,
} from "@mui/material";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import CategoryTopBar from "components/CategoryTopBar";

interface ProductDetails {
  name: string;
  category: string;
  description: string;
  price: number;
  sale_start: string | null;
  sale_end: string | null;
  is_on_sale: boolean;
  images: Image[];
  slug: string;
}

export default function Product() {
  const params = useParams<Record<string, string>>();
  const [quantity, setQuantity] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string>("");
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const { addToCart } = useCart();
  const [product, setProduct] = useState<ProductDetails>({
    name: "",
    category: "",
    description: "",
    price: 0,
    sale_start: null,
    sale_end: null,
    is_on_sale: false,
    images: [{ image: "" }],
    slug: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (params.slug) {
          const response = await getProduct(params.slug);
          if (response && response.data) {
            setProduct(response.data);
            setSelectedImage(response.data.images[0].image);
          }
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProduct();
  }, [params]);

  const handleQuantityChange = (quantity: number) => {
    if (isNaN(quantity) || quantity < 1) {
      setError("Quantity must be a number greater than 0.");
      return;
    }
    setQuantity(quantity);
    setError(null);
  };

  const handleAddToCartClick = async (
    product: ProductDetails,
    event: MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    try {
      await addToCart(product, quantity);
      setConfirmationMessage(`Product added to the cart!`);
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 3000);
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  return (
    <Box maxWidth="lg" mx="auto" p={3}>
      {showConfirmation && (
        <Box mb={2} p={2} bgcolor="success.main" color="white" borderRadius={1}>
          {confirmationMessage}
        </Box>
      )}
      <CategoryTopBar
        className="bg-secondary mt-3 p-2 mb-2"
        currentCategory={product.category}
      />

      {/* Main product info */}
      <Grid>
      <Grid container spacing={4}>
        {/* Left: Product images */}
        <Grid item xs={12} md={6}>
          <Box mb={2}>
            <Card>
              <CardMedia
                component="img"
                image={selectedImage}
                alt={product.name}
                sx={{ width: "100%", height: "auto" }}
              />
            </Card>
          </Box>

          {/* Thumbnails using Swiper */}
          <Box>
            <Swiper
              modules={[Navigation, Pagination, Scrollbar, A11y]}
              spaceBetween={10}
              slidesPerView={3}
              navigation
              pagination={{ clickable: true }}
              scrollbar={{ draggable: true }}
            >
              {product.images.map((img, index) => (
                <SwiperSlide key={index}>
                  <Card
                    onClick={() => setSelectedImage(img.image)}
                    sx={{ cursor: "pointer" }}
                  >
                    <CardMedia
                      component="img"
                      image={img.image}
                      alt={`Product image ${index + 1}`}
                      sx={{ width: "100%", height: "auto" }}
                    />
                  </Card>
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
        </Grid>

        {/* Right: Product details and cart actions */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
          >
            {product.name}
          </Typography>
          <Typography variant="h6" color="textSecondary">
            {product.price} PLN
          </Typography>

          <Box
            mt={3}
            display="flex"
            sx={{
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Typography variant="body1" sx={{ mr: 2 }}>
              Quantity:
            </Typography>
            <TextField
              type="number"
              value={quantity}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleQuantityChange(Math.max(1, parseInt(e.target.value, 10)))
              }
              inputProps={{ min: 1 }}
              sx={{ width: 80 }}
            />
          </Box>

          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            onClick={(event) => handleAddToCartClick(product, event)}
          >
            Add to Cart
          </Button>

          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          
        </Grid>
        <Box mt={4}>
            <Typography variant="body1">{product.description}</Typography>
          </Box>
          </Grid>
      </Grid>
    </Box>
  );
}
