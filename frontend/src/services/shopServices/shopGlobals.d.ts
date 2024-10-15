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

interface Category {
  slug: string;
  name: string;
  children?: Category[];
  parent?: Category;
  product_count: number;
}
