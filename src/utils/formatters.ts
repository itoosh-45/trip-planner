import type { Currency, ActivityCategory, BudgetCategoryId } from '../types';

export const formatCurrency = (amount: number, currency: Currency): string => {
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: currency === '₪' ? 'ILS' : currency === '$' ? 'USD' : currency === '€' ? 'EUR' : 'GBP',
    maximumFractionDigits: 0,
  }).format(amount).replace('ILS', '₪').replace('USD', '$').replace('EUR', '€').replace('GBP', '£');
};

export const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('he-IL', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
  }).format(date);
};

export const formatDateShort = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('he-IL', {
    day: '2-digit',
    month: '2-digit',
  }).format(date);
};

export const formatPercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

export const getCategoryColor = (categoryId: BudgetCategoryId): string => {
  const colors: Record<BudgetCategoryId, string> = {
    accommodation: 'bg-blue-500',
    flights: 'bg-indigo-500',
    food: 'bg-orange-500',
    attractions: 'bg-pink-500',
    shopping: 'bg-purple-500',
    transport: 'bg-teal-500',
    other: 'bg-gray-500',
  };
  return colors[categoryId] || 'bg-gray-500';
};

export const getActivityIcon = (category: ActivityCategory): string => {
  const icons: Record<ActivityCategory, string> = {
    attraction: 'Ticket',
    restaurant: 'Utensils',
    transport: 'Car',
    accommodation: 'Bed',
    free: 'Smile',
    shopping: 'ShoppingBag',
    other: 'MoreHorizontal',
  };
  return icons[category] || 'MoreHorizontal';
};

export const getStatusColor = (percentage: number): 'green' | 'yellow' | 'red' => {
  if (percentage < 70) return 'green';
  if (percentage <= 90) return 'yellow';
  return 'red';
};
