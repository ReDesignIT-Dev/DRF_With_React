interface Image {
  image: string;
}

interface Product {
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
