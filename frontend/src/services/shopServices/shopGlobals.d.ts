interface Image {
  image: string;
}

interface Product {
  name: string;
  slug: string;
  images: Image[];  
  price: number; 
}
  
  interface CartItem {
    product: Product;
    quantity: number;
  }