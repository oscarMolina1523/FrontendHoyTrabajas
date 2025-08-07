export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface CartItem extends Product {}

export interface CartResponse {
  message: string;
  cart: CartItem[];
}

export interface BudgetOptimizationResult {
  products: Product[];
  totalValue: number;
  remainingBudget: number;
}