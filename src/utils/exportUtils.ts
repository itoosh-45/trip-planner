import type { PlannerState, Expense, Currency } from '../types';
import { BUDGET_CATEGORY_LABELS, PAYMENT_METHOD_LABELS } from '../types';

export const downloadFile = (content: string, filename: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const exportToJSON = (state: PlannerState): void => {
  const content = JSON.stringify(state, null, 2);
  downloadFile(content, `trip-planner-${new Date().toISOString().slice(0, 10)}.json`, 'application/json');
};

export const importFromJSON = (file: File): Promise<PlannerState> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const state = JSON.parse(content) as PlannerState;
        
        // Basic validation
        if (typeof state !== 'object' || !state.days || !state.expenses || !state.budgetCategories) {
          throw new Error('Invalid planner state structure');
        }
        
        resolve(state);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

export const exportExpensesToCSV = (expenses: Expense[], currency: Currency): void => {
  const BOM = '﻿';
  const headers = ['תאריך', 'קטגוריה', `סכום (${currency})`, 'תיאור', 'אמצעי תשלום', 'הערות'].join(',');
  
  const rows = expenses.map(expense => {
    const categoryName = BUDGET_CATEGORY_LABELS[expense.categoryId] || expense.categoryId;
    const paymentMethodName = PAYMENT_METHOD_LABELS[expense.paymentMethod] || expense.paymentMethod;
    const notesStr = expense.notes ? `"${expense.notes.replace(/"/g, '""')}"` : '';
    const descriptionStr = `"${expense.description.replace(/"/g, '""')}"`;
    
    return `${expense.date},"${categoryName}",${expense.amount},${descriptionStr},"${paymentMethodName}",${notesStr}`;
  }).join('\n');

  const content = BOM + headers + '\n' + rows;
  downloadFile(content, `expenses-${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv;charset=utf-8');
};
