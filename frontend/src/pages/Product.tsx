import React, { useEffect, useState, ChangeEvent, MouseEvent } from "react";
import { useParams } from "react-router-dom";
import { getProduct } from "services/shopServices/apiRequestsShop";
import { useCart } from "services/shopServices/cartLogic";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import {
  Box,
  Grid2,
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
import Lightbox from "react-18-image-lightbox";
import "react-18-image-lightbox/style.css";
import shopDefaultImage from "assets/images/shop_default_image.jpg";

export default function Product() {
  const params = useParams<Record<string, string>>();
  const [quantity, setQuantity] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string>("");
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product>({
    name: "",
    category: "",
    description: "",
    price: 0,
    saleStart: null,
    saleEnd: null,
    isOnSale: false,
    images: [{ src: shopDefaultImage }],
    slug: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!params.slug) return;
  
        const response = await getProduct(params.slug);
        const productData = response?.data;
  
        if (productData) {
          const images = productData.images;
          const selectedImage = images?.[0]?.src || shopDefaultImage;
          
          setSelectedImage(selectedImage);
          setProduct({
            ...productData,
            images: images.length > 0 ? images : [{ src: shopDefaultImage }],
          });
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };
  
    fetchProduct();
  }, [params.slug]);
  

  const handleQuantityChange = (quantity: number) => {
    if (isNaN(quantity) || quantity < 1) {
      setError("Quantity must be a number greater than 0.");
      return;
    }
    setQuantity(quantity);
    setError(null);
  };

  const handleAddToCartClick = async (
    product: Product,
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

  const openLightbox = (index: number) => {
    if (!isLightboxOpen) {
      const img = new Image();
      img.src = product.images[index].src;
      img.onload = () => {
        setCurrentImageIndex(index);
        setIsLightboxOpen(true);
      };
    }
  };

  const handleLightboxNext = () => {
    setCurrentImageIndex((currentImageIndex + 1) % product.images.length);
  };

  const handleLightboxPrev = () => {
    setCurrentImageIndex(
      (currentImageIndex + product.images.length - 1) % product.images.length
    );
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
      <Grid2>
        <Grid2 container spacing={2}>
          {/* Left: Product images */}
          <Grid2 container direction="column" sx={{xs:12, md:6}}>
            <Box>
              <Card onClick={() => openLightbox(currentImageIndex)}>
                <CardMedia
                  component="img"
                  image={selectedImage}
                  alt={product.name}
                  sx={{
                    width: "400px",
                    height: "400px", 
                    objectFit: "contain",
                    objectPosition: "center",
                    cursor: "pointer",
                  }}
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
                      onClick={() => {
                        setSelectedImage(img.src);
                        setCurrentImageIndex(index);
                      }}
                     
                      sx={{                
                        cursor: "pointer",
                        width: "150px",
                          height: "150px",
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={img.src}
                        alt={`Product image ${index + 1}`}
                        sx={{
                          width: "150px",
                          height: "150px", 
                          objectFit: "contain",
                          objectPosition: "center",}}
                      />
                    </Card>
                  </SwiperSlide>
                ))}
              </Swiper>
            </Box>
          </Grid2>

          {/* Right: Product details and cart actions */}
          <Grid2
            
            sx={{
              xs:12,
            md:6,
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Typography variant="h4" gutterBottom>
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
                  handleQuantityChange(
                    Math.max(1, parseInt(e.target.value, 10))
                  )
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
          </Grid2>
        </Grid2>
      </Grid2>

      <Box mt={4}>
        <Typography variant="body1">{product.description}</Typography>
      </Box>

      {/* Lightbox for fullscreen images */}
      {isLightboxOpen && (
        <Lightbox
          mainSrc={product.images[currentImageIndex].src}
          nextSrc={
            product.images[(currentImageIndex + 1) % product.images.length].src
          }
          prevSrc={
            product.images[
              (currentImageIndex + product.images.length - 1) %
                product.images.length
            ].src
          }
          onCloseRequest={() => setIsLightboxOpen(false)}
          onMovePrevRequest={handleLightboxPrev}
          onMoveNextRequest={handleLightboxNext}
        />
      )}
    </Box>
  );
}
