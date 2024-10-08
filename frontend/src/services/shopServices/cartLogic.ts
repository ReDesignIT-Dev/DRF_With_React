import { addToCart as apiAddToCart, deleteCartItem as apiDeleteCartItem, updateCartItemQuantity as apiUpdateCartItemQuantity, getCart as apiGetCart } from './cartRequests';
import { addItemToCart as localAddToCart, removeItemFromCart as localRemoveItemFromCart, updateItemQuantity as localUpdateItemQuantity, getCart as localGetCart, clearCart as localClearCart } from './localStorageRequestsShop';


interface CartItem {
  product: Product;
  quantity: number;
}

export const addToCart = async (isLoggedIn: boolean, product: Product, quantity: number) => {
  if (isLoggedIn) {
    try {
      await apiAddToCart(product, quantity);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  } else {
    localAddToCart(product, quantity);
  }
};

export const deleteFromCart = async (isLoggedIn: boolean, product: Product) => {
  if (isLoggedIn) {
    try {
      await apiDeleteCartItem(product);
    } catch (error) {
      console.error('Error deleting from cart:', error);
    }
  } else {
    localRemoveItemFromCart(product);
  }
};

export const updateCart = async (isLoggedIn: boolean, product: Product, quantity: number) => {
  if (isLoggedIn) {
    try {
      await apiUpdateCartItemQuantity(product, quantity);
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
    }
  } else {
    localUpdateItemQuantity(product, quantity);
  }
};

const mergeCarts = (backendCart: CartItem[], localCart: CartItem[]): CartItem[] => {
  const mergedCart = [...backendCart];
  const backendSlugs = new Set(backendCart.map(item => item.product.slug));

  localCart.forEach(localItem => {
    const backendItem = mergedCart.find(item => item.product.slug === localItem.product.slug);
    if (backendItem) {
      backendItem.quantity += localItem.quantity;
    } else {
      mergedCart.push(localItem);
    }
  });

  return mergedCart;
};

export const getCart = async (isLoggedIn: boolean) => {
  if (isLoggedIn) {
    try {
      const backendResponse = await apiGetCart();
      const backendCart: CartItem[] = backendResponse || [];
      const localCart: CartItem[] = localGetCart();

      const mergedCart = mergeCarts(backendCart, localCart);

      // Update backend cart with merged items
      for (const item of mergedCart) {
        const backendItem = backendCart.find(cartItem => cartItem.product.slug === item.product.slug);
        if (backendItem) {
          await apiUpdateCartItemQuantity(item.product, item.quantity);
        } else {
          await apiAddToCart(item.product, item.quantity);
        }
      }

      // Clear local cart after successful merge
      localClearCart();

      return mergedCart;
    } catch (error) {
      console.error('Error fetching cart:', error);
      return [];
    }
  } else {
    return localGetCart();
  }
};