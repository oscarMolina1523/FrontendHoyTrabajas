import { Product, CartItem, CartResponse } from '@/types/api';

const BASE_URL = 'https://backendhoytrabajas.vercel.app/api';

export const api = {
  // Get all products
  getProducts: async (): Promise<Product[]> => {
    const response = await fetch(`${BASE_URL}/products`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return response.json();
  },

  // Get cart items
  getCart: async (): Promise<CartItem[]> => {
    const response = await fetch(`${BASE_URL}/cart`);
    if (!response.ok) {
      throw new Error('Failed to fetch cart');
    }
    return response.json();
  },

  // Add product to cart
  addToCart: async (productId: string): Promise<CartResponse> => {
    const response = await fetch(`${BASE_URL}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId }),
    });
    if (!response.ok) {
      throw new Error('Failed to add product to cart');
    }
    return response.json();
  },
};