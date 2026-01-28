// src/utils/helpers.js

// 1. 💰 Currency Formatter (e.g. ₹50,000)
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

// 2. 📅 Full Date (e.g. 28 Jan 2026)
export const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

// 3. 📊 Percentage Calculator
export const calculatePercentage = (current, total) => {
  if (!total || total === 0) return 0;
  return Math.min(100, Math.max(0, (current / total) * 100));
};