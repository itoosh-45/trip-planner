import { createContext, useContext, useEffect, useReducer, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Currency, DayPlan, BudgetCategoryId, Activity, Expense, PlannerState } from '../types/index';
import { generateId, DEFAULT_BUDGET_CATEGORIES } from '../types/index';
import { getSampleData } from '../utils/sampleData';

type PlannerAction =
  | { type: 'SET_TRIP_NAME'; payload: string }
  | { type: 'SET_CURRENCY'; payload: Currency }
  | { type: 'SET_TOTAL_BUDGET'; payload: number }
  | { type: 'ADD_DAY'; payload: Omit<DayPlan, 'id' | 'activities'> }
  | { type: 'UPDATE_DAY'; payload: { id: string; updates: Partial<DayPlan> } }
  | { type: 'DELETE_DAY'; payload: string }
  | { type: 'ADD_ACTIVITY'; payload: { dayId: string; activity: Omit<Activity, 'id'> } }
  | { type: 'UPDATE_ACTIVITY'; payload: { dayId: string; activityId: string; updates: Partial<Activity> } }
  | { type: 'DELETE_ACTIVITY'; payload: { dayId: string; activityId: string } }
  | { type: 'TOGGLE_ACTIVITY'; payload: { dayId: string; activityId: string } }
  | { type: 'UPDATE_CATEGORY_BUDGET'; payload: { categoryId: BudgetCategoryId; planned: number } }
  | { type: 'ADD_EXPENSE'; payload: Omit<Expense, 'id'> }
  | { type: 'UPDATE_EXPENSE'; payload: { id: string; updates: Partial<Expense> } }
  | { type: 'DELETE_EXPENSE'; payload: string }
  | { type: 'LOAD_SAMPLE_DATA' }
  | { type: 'RESET_ALL' }
  | { type: 'IMPORT_DATA'; payload: PlannerState }
  | { type: 'INIT_STATE'; payload: PlannerState };

interface PlannerContextType extends PlannerState {
  totalSpent: number;
  remainingBudget: number;
  budgetUtilization: number;
  getCategorySpent: (categoryId: BudgetCategoryId) => number;
  getDayExpenses: (dayId: string) => Expense[];
  getDayTotalCost: (dayId: string) => number;

  setTripName: (name: string) => void;
  setCurrency: (currency: Currency) => void;
  setTotalBudget: (budget: number) => void;
  addDay: (day: Omit<DayPlan, 'id' | 'activities'>) => void;
  updateDay: (id: string, updates: Partial<DayPlan>) => void;
  deleteDay: (id: string) => void;
  addActivity: (dayId: string, activity: Omit<Activity, 'id'>) => void;
  updateActivity: (dayId: string, activityId: string, updates: Partial<Activity>) => void;
  deleteActivity: (dayId: string, activityId: string) => void;
  toggleActivity: (dayId: string, activityId: string) => void;
  updateCategoryBudget: (categoryId: BudgetCategoryId, planned: number) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  loadSampleData: () => void;
  resetAll: () => void;
  importData: (data: PlannerState) => void;
}

const STORAGE_KEY = 'day-budget-planner-state';

const emptyState: PlannerState = {
  tripName: 'טיול חדש',
  currency: '₪',
  totalBudget: 0,
  days: [],
  budgetCategories: DEFAULT_BUDGET_CATEGORIES,
  expenses: []
};

function plannerReducer(state: PlannerState, action: PlannerAction): PlannerState {
  switch (action.type) {
    case 'SET_TRIP_NAME':
      return { ...state, tripName: action.payload };
    case 'SET_CURRENCY':
      return { ...state, currency: action.payload };
    case 'SET_TOTAL_BUDGET':
      return { ...state, totalBudget: action.payload };
    case 'ADD_DAY':
      return {
        ...state,
        days: [...state.days, { ...action.payload, id: generateId(), activities: [] }]
      };
    case 'UPDATE_DAY':
      return {
        ...state,
        days: state.days.map(day => (day.id === action.payload.id ? { ...day, ...action.payload.updates } : day))
      };
    case 'DELETE_DAY':
      return {
        ...state,
        days: state.days.filter(day => day.id !== action.payload)
      };
    case 'ADD_ACTIVITY':
      return {
        ...state,
        days: state.days.map(day =>
          day.id === action.payload.dayId
            ? { ...day, activities: [...day.activities, { ...action.payload.activity, id: generateId() }] }
            : day
        )
      };
    case 'UPDATE_ACTIVITY':
      return {
        ...state,
        days: state.days.map(day =>
          day.id === action.payload.dayId
            ? {
                ...day,
                activities: day.activities.map(act =>
                  act.id === action.payload.activityId ? { ...act, ...action.payload.updates } : act
                )
              }
            : day
        )
      };
    case 'DELETE_ACTIVITY':
      return {
        ...state,
        days: state.days.map(day =>
          day.id === action.payload.dayId
            ? { ...day, activities: day.activities.filter(act => act.id !== action.payload.activityId) }
            : day
        )
      };
    case 'TOGGLE_ACTIVITY':
      return {
        ...state,
        days: state.days.map(day =>
          day.id === action.payload.dayId
            ? {
                ...day,
                activities: day.activities.map(act =>
                  act.id === action.payload.activityId ? { ...act, isCompleted: !act.isCompleted } : act
                )
              }
            : day
        )
      };
    case 'UPDATE_CATEGORY_BUDGET':
      return {
        ...state,
        budgetCategories: state.budgetCategories.map(cat =>
          cat.id === action.payload.categoryId ? { ...cat, planned: action.payload.planned } : cat
        )
      };
    case 'ADD_EXPENSE':
      return {
        ...state,
        expenses: [...state.expenses, { ...action.payload, id: generateId() }]
      };
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map(exp =>
          exp.id === action.payload.id ? { ...exp, ...action.payload.updates } : exp
        )
      };
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter(exp => exp.id !== action.payload)
      };
    case 'LOAD_SAMPLE_DATA':
      return getSampleData();
    case 'RESET_ALL':
      return emptyState;
    case 'IMPORT_DATA':
    case 'INIT_STATE':
      return action.payload;
    default:
      return state;
  }
}

const PlannerContext = createContext<PlannerContextType | undefined>(undefined);

export function PlannerProvider({ children }: { children: ReactNode }) {
  // Initialize with sample data if localStorage is empty to provide a populated first-visit
  const [state, dispatch] = useReducer(plannerReducer, emptyState, (): PlannerState => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse planner data from localStorage', e);
    }
    return getSampleData();
  });

  // Save to local storage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save planner data to localStorage', e);
    }
  }, [state]);

  const totalSpent = useMemo(() => state.expenses.reduce((sum, exp) => sum + exp.amount, 0), [state.expenses]);
  
  const remainingBudget = useMemo(() => state.totalBudget - totalSpent, [state.totalBudget, totalSpent]);
  
  const budgetUtilization = useMemo(() => {
    if (state.totalBudget === 0) return 0;
    const util = (totalSpent / state.totalBudget) * 100;
    return Math.min(util, 100);
  }, [totalSpent, state.totalBudget]);

  const getCategorySpent = useCallback((categoryId: BudgetCategoryId) => {
    return state.expenses
      .filter(exp => exp.categoryId === categoryId)
      .reduce((sum, exp) => sum + exp.amount, 0);
  }, [state.expenses]);

  const getDayExpenses = useCallback((dayId: string) => {
    return state.expenses.filter(exp => exp.dayId === dayId);
  }, [state.expenses]);

  const getDayTotalCost = useCallback((dayId: string) => {
    return state.expenses
      .filter(exp => exp.dayId === dayId)
      .reduce((sum, exp) => sum + exp.amount, 0);
  }, [state.expenses]);

  const contextValue: PlannerContextType = useMemo(() => ({
    ...state,
    totalSpent,
    remainingBudget,
    budgetUtilization,
    getCategorySpent,
    getDayExpenses,
    getDayTotalCost,

    setTripName: (name) => dispatch({ type: 'SET_TRIP_NAME', payload: name }),
    setCurrency: (currency) => dispatch({ type: 'SET_CURRENCY', payload: currency }),
    setTotalBudget: (budget) => dispatch({ type: 'SET_TOTAL_BUDGET', payload: budget }),
    addDay: (day) => dispatch({ type: 'ADD_DAY', payload: day }),
    updateDay: (id, updates) => dispatch({ type: 'UPDATE_DAY', payload: { id, updates } }),
    deleteDay: (id) => dispatch({ type: 'DELETE_DAY', payload: id }),
    addActivity: (dayId, activity) => dispatch({ type: 'ADD_ACTIVITY', payload: { dayId, activity } }),
    updateActivity: (dayId, activityId, updates) => dispatch({ type: 'UPDATE_ACTIVITY', payload: { dayId, activityId, updates } }),
    deleteActivity: (dayId, activityId) => dispatch({ type: 'DELETE_ACTIVITY', payload: { dayId, activityId } }),
    toggleActivity: (dayId, activityId) => dispatch({ type: 'TOGGLE_ACTIVITY', payload: { dayId, activityId } }),
    updateCategoryBudget: (categoryId, planned) => dispatch({ type: 'UPDATE_CATEGORY_BUDGET', payload: { categoryId, planned } }),
    addExpense: (expense) => dispatch({ type: 'ADD_EXPENSE', payload: expense }),
    updateExpense: (id, updates) => dispatch({ type: 'UPDATE_EXPENSE', payload: { id, updates } }),
    deleteExpense: (id) => dispatch({ type: 'DELETE_EXPENSE', payload: id }),
    loadSampleData: () => dispatch({ type: 'LOAD_SAMPLE_DATA' }),
    resetAll: () => dispatch({ type: 'RESET_ALL' }),
    importData: (data) => dispatch({ type: 'IMPORT_DATA', payload: data }),
  }), [
    state,
    totalSpent,
    remainingBudget,
    budgetUtilization,
    getCategorySpent,
    getDayExpenses,
    getDayTotalCost
  ]);

  return <PlannerContext.Provider value={contextValue}>{children}</PlannerContext.Provider>;
}

export function usePlanner() {
  const context = useContext(PlannerContext);
  if (context === undefined) {
    throw new Error('usePlanner must be used within a PlannerProvider');
  }
  return context;
}
