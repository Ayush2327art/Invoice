// Calculate subtotal from items array
export const calculateSubtotal = (items) => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

// Calculate tax amount based on subtotal and tax rate percentage
export const calculateTax = (subtotal, taxRate) => {
  return subtotal * (taxRate / 100);
};

// Calculate discount amount based on subtotal and discount rate percentage
export const calculateDiscount = (subtotal, discountRate) => {
  return subtotal * (discountRate / 100);
};

// Calculate total amount after applying tax and discount
export const calculateTotal = (subtotal, tax, discount) => {
  return subtotal + tax - discount;
};

// Format currency with 2 decimal places
export const formatCurrency = (amount) => {
  return parseFloat(amount).toFixed(2);
};

// Format date to local date string
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString();
};