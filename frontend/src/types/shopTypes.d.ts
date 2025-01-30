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

interface BaseCategory {
  readonly id: number;
  readonly slug: string;
  readonly name: string;
  readonly parentId: number | null;
}

interface Category extends BaseCategory {
  readonly image?: Image;
  readonly children: number[] | null;
  readonly productCount: number;
}

interface CategoryNode extends BaseCategory {
  readonly children: CategoryNode[] | null;
}

interface CategoryTreeStore {
  readonly categories: CategoryNode[];
  readonly isLoading: boolean;
  readonly error: boolean;
}

interface CategoryStore {
  readonly categories: Category[];
  readonly isLoading: boolean;
  readonly error: boolean;
}

interface CategoryAncestor {
  name: string;
  slug: string;
}