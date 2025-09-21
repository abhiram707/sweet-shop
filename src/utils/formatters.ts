// Utility functions for data formatting and validation

/**
 * Safely format a price value to a fixed decimal string
 * Handles both string and number inputs from different database types
 */
export const formatPrice = (price: string | number): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
};

/**
 * Convert price to number for calculations
 * Handles both string and number inputs from different database types
 */
export const parsePrice = (price: string | number): number => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return isNaN(numPrice) ? 0 : numPrice;
};

/**
 * Safely parse integer values
 */
export const parseInteger = (value: string | number): number => {
  const numValue = typeof value === 'string' ? parseInt(value, 10) : value;
  return isNaN(numValue) ? 0 : numValue;
};

/**
 * Format currency display
 */
export const formatCurrency = (amount: string | number): string => {
  return `$${formatPrice(amount)}`;
};

/**
 * Validate and sanitize API response data
 */
export const sanitizeSweet = (sweet: any): any => {
  return {
    ...sweet,
    price: parsePrice(sweet.price),
    quantity: parseInteger(sweet.quantity),
  };
};

/**
 * Sanitize array of sweets
 */
export const sanitizeSweets = (sweets: any[]): any[] => {
  return sweets.map(sanitizeSweet);
};
