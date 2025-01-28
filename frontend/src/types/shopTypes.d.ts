interface Image {
  id: string;
  src: string;
  altText?: string;
  position?: number;
}

interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  saleStart?: Date | null;
  saleEnd?: Date | null;
  isOnSale: boolean;
  images: Image[];
  slug: string;
}

interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

interface Category {
  id: number;
  slug: string;
  name: string;
  image?: Image;
  children: Category[] | null;
  parent_id: number | null;
  product_count: number;
}

interface CategoryAncestor {
  name: string;
  slug: string;
}