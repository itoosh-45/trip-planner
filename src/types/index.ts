export type Currency = '₪' | '$' | '€' | '£';

export type ActivityCategory = 'attraction' | 'restaurant' | 'transport' | 'accommodation' | 'free' | 'shopping' | 'other';

export type PaymentMethod = 'cash' | 'credit' | 'debit' | 'transfer' | 'other';

export type BudgetCategoryId = 'accommodation' | 'flights' | 'food' | 'attractions' | 'shopping' | 'transport' | 'other';

export interface Activity {
  id: string;
  time: string; // HH:MM format
  title: string;
  description?: string;
  location?: string;
  category: ActivityCategory;
  estimatedCost: number;
  isCompleted: boolean;
}

export interface DayPlan {
  id: string;
  dayNumber: number;
  date: string; // YYYY-MM-DD
  title: string;
  destination: string;
  notes?: string;
  activities: Activity[];
}

export interface BudgetCategory {
  id: BudgetCategoryId;
  name: string;
  icon: string; // lucide icon name
  color: string; // tailwind color
  planned: number;
}

export interface Expense {
  id: string;
  date: string;
  dayId?: string; // linked to a DayPlan
  categoryId: BudgetCategoryId;
  amount: number;
  description: string;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface PlannerState {
  tripName: string;
  currency: Currency;
  totalBudget: number;
  days: DayPlan[];
  budgetCategories: BudgetCategory[];
  expenses: Expense[];
}

export type TabId = 'days' | 'budget' | 'expenses' | 'analytics';

export const ACTIVITY_CATEGORY_LABELS: Record<ActivityCategory, string> = {
  attraction: 'אטרקציה',
  restaurant: 'מסעדה',
  transport: 'תחבורה',
  accommodation: 'לינה',
  free: 'חופשי',
  shopping: 'קניות',
  other: 'אחר'
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: 'מזומן',
  credit: 'אשראי',
  debit: 'דביט',
  transfer: 'העברה',
  other: 'אחר'
};

export const BUDGET_CATEGORY_LABELS: Record<BudgetCategoryId, string> = {
  accommodation: 'לינה',
  flights: 'טיסות ותחבורה',
  food: 'אוכל והסעדה',
  attractions: 'אטרקציות',
  shopping: 'קניות',
  transport: 'תחבורה מקומית',
  other: 'שונות'
};

export const DEFAULT_BUDGET_CATEGORIES: BudgetCategory[] = [
  { id: 'accommodation', name: BUDGET_CATEGORY_LABELS.accommodation, icon: 'Bed', color: 'bg-blue-500', planned: 0 },
  { id: 'flights', name: BUDGET_CATEGORY_LABELS.flights, icon: 'Plane', color: 'bg-indigo-500', planned: 0 },
  { id: 'food', name: BUDGET_CATEGORY_LABELS.food, icon: 'Utensils', color: 'bg-orange-500', planned: 0 },
  { id: 'attractions', name: BUDGET_CATEGORY_LABELS.attractions, icon: 'Ticket', color: 'bg-pink-500', planned: 0 },
  { id: 'shopping', name: BUDGET_CATEGORY_LABELS.shopping, icon: 'ShoppingBag', color: 'bg-purple-500', planned: 0 },
  { id: 'transport', name: BUDGET_CATEGORY_LABELS.transport, icon: 'Car', color: 'bg-teal-500', planned: 0 },
  { id: 'other', name: BUDGET_CATEGORY_LABELS.other, icon: 'MoreHorizontal', color: 'bg-gray-500', planned: 0 }
];

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};
