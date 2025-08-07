import { Product, BudgetOptimizationResult } from '@/types/api';

/**
 * Finds the best combination of products that maximizes value within budget
 * Uses dynamic programming (0/1 Knapsack problem)
 */
export function findBestCombination(products: Product[], budget: number): BudgetOptimizationResult {
  const n = products.length;
  const budgetCents = Math.floor(budget * 100); // Convert to cents to avoid floating point issues
  
  // Convert prices to cents
  const prices = products.map(p => Math.floor(p.price * 100));
  
  // DP table: dp[i][w] = maximum value using first i items with budget w
  const dp: number[][] = Array(n + 1).fill(null).map(() => Array(budgetCents + 1).fill(0));
  
  // Fill the DP table
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= budgetCents; w++) {
      // Don't include current item
      dp[i][w] = dp[i - 1][w];
      
      // Include current item if it fits
      if (prices[i - 1] <= w) {
        const includeValue = dp[i - 1][w - prices[i - 1]] + prices[i - 1];
        dp[i][w] = Math.max(dp[i][w], includeValue);
      }
    }
  }
  
  // Backtrack to find which items were selected
  const selectedProducts: Product[] = [];
  let w = budgetCents;
  let totalValue = 0;
  
  for (let i = n; i > 0 && w > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      selectedProducts.push(products[i - 1]);
      totalValue += products[i - 1].price;
      w -= prices[i - 1];
    }
  }
  
  return {
    products: selectedProducts.reverse(), // Reverse to maintain original order
    totalValue: Math.round(totalValue * 100) / 100, // Round to 2 decimal places
    remainingBudget: Math.round((budget - totalValue) * 100) / 100,
  };
}