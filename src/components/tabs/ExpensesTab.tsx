import { useState, useMemo } from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { BUDGET_CATEGORY_LABELS, PAYMENT_METHOD_LABELS } from '../../types/index';
import type { Expense, BudgetCategoryId, PaymentMethod } from '../../types/index';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Filter, 
  CreditCard, 
  Banknote, 
  ArrowUpDown, 
  Receipt,
  Wallet,
  Landmark,
  X,
  Check
} from 'lucide-react';

interface ExpensesTabProps {
  onOpenAddExpense: (expense?: Expense) => void;
}

export default function ExpensesTab({ onOpenAddExpense }: ExpensesTabProps) {
  const { expenses, days, currency, deleteExpense } = usePlanner();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<BudgetCategoryId | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      const matchesSearch = expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (expense.notes && expense.notes.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = categoryFilter === 'all' || expense.categoryId === categoryFilter;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        return sortDirection === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      }
    });
  }, [expenses, searchQuery, categoryFilter, sortBy, sortDirection]);

  const totalAmount = useMemo(() => expenses.reduce((sum, exp) => sum + exp.amount, 0), [expenses]);
  const avgAmount = expenses.length > 0 ? totalAmount / expenses.length : 0;
  const largestExpense = expenses.length > 0 ? Math.max(...expenses.map(e => e.amount)) : 0;

  const toggleSort = () => {
    if (sortBy === 'date') {
      setSortBy('amount');
      setSortDirection('desc');
    } else if (sortBy === 'amount' && sortDirection === 'desc') {
      setSortDirection('asc');
    } else {
      setSortBy('date');
      setSortDirection('desc');
    }
  };

  const getSortLabel = () => {
    if (sortBy === 'date') return 'תאריך';
    return sortDirection === 'desc' ? 'סכום (גבוה לנמוך)' : 'סכום (נמוך לגבוה)';
  };

  const handleDelete = (id: string) => {
    deleteExpense(id);
    setDeleteConfirmId(null);
  };

  const getPaymentIcon = (method: PaymentMethod) => {
    switch (method) {
      case 'credit': return <CreditCard className="w-3.5 h-3.5" strokeWidth={1.75} />;
      case 'cash': return <Banknote className="w-3.5 h-3.5" strokeWidth={1.75} />;
      case 'transfer': return <Landmark className="w-3.5 h-3.5" strokeWidth={1.75} />;
      default: return <Wallet className="w-3.5 h-3.5" strokeWidth={1.75} />;
    }
  };

  const getCategoryColor = (categoryId: BudgetCategoryId) => {
    const colors: Record<BudgetCategoryId, string> = {
      flights: 'bg-sky-300',
      accommodation: 'bg-indigo-300',
      transport: 'bg-teal-300',
      food: 'bg-orange-300',
      attractions: 'bg-pink-300',
      shopping: 'bg-purple-300',
      other: 'bg-slate-300'
    };
    return colors[categoryId] || 'bg-slate-300';
  };

  const categories = Object.entries(BUDGET_CATEGORY_LABELS).map(([key, label]) => ({
    id: key as BudgetCategoryId,
    label
  }));

  const field = 'bg-white border border-gray-200 rounded-full text-sm text-gray-700 outline-none focus:border-blue-400 transition-colors';

  return (
    <div className="space-y-5" dir="rtl">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl">הוצאות</h2>
          <p className="tabular text-sm text-gray-500 mt-0.5">
            {expenses.length} הוצאות · סך הכל {formatCurrency(totalAmount, currency)}
            <span className="hidden sm:inline"> · ממוצע {formatCurrency(avgAmount, currency)} · הגדולה {formatCurrency(largestExpense, currency)}</span>
          </p>
        </div>
        <button
          onClick={() => onOpenAddExpense()}
          className="hidden lg:flex items-center gap-1.5 bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-full text-sm font-semibold transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          הוצאה
        </button>
      </div>

      {/* Search, filter, sort */}
      <div className="flex flex-wrap gap-2">
        <label className="relative flex-1 min-w-[12rem]">
          <span className="sr-only">חיפוש</span>
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={1.75} />
          <input
            type="search"
            placeholder="חיפוש בהוצאות"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`${field} w-full pl-4 pr-10 py-2`}
          />
        </label>
        <label className="relative">
          <span className="sr-only">קטגוריה</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as BudgetCategoryId | 'all')}
            className={`${field} appearance-none pl-8 pr-4 py-2 cursor-pointer`}
          >
            <option value="all">כל הקטגוריות</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.label}</option>
            ))}
          </select>
          <Filter className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" strokeWidth={1.75} />
        </label>
        <button onClick={toggleSort} className={`${field} flex items-center gap-1.5 px-4 py-2 hover:bg-gray-50`} title="שינוי מיון">
          <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" strokeWidth={1.75} />
          {getSortLabel()}
        </button>
      </div>

      {/* Ledger */}
      {filteredExpenses.length > 0 ? (
        <ul className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
          {filteredExpenses.map((expense) => {
            const isDeleting = deleteConfirmId === expense.id;
            const categoryLabel = BUDGET_CATEGORY_LABELS[expense.categoryId] || expense.categoryId;
            const paymentLabel = PAYMENT_METHOD_LABELS[expense.paymentMethod] || expense.paymentMethod;
            const dayIndex = expense.dayId ? days.findIndex(d => d.id === expense.dayId) + 1 : 0;

            if (isDeleting) {
              return (
                <li key={expense.id} className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 py-3.5 bg-red-50">
                  <p className="text-red-700">למחוק את "{expense.description}"?</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="flex items-center gap-1.5 px-4 py-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors text-sm font-semibold"
                    >
                      <Check className="w-4 h-4" /> מחיקה
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="flex items-center gap-1.5 px-4 py-1.5 bg-white text-gray-700 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors text-sm"
                    >
                      <X className="w-4 h-4" /> ביטול
                    </button>
                  </div>
                </li>
              );
            }

            return (
              <li key={expense.id} className="group flex items-start gap-3 px-4 sm:px-5 py-3.5">
                <span className={`wash mt-1.5 w-3.5 h-3.5 rounded-full shrink-0 ${getCategoryColor(expense.categoryId)}`} aria-hidden="true" />
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900">{expense.description}</p>
                  <p className="tabular flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-sm text-gray-500">
                    <span>{categoryLabel}</span>
                    <span>{formatDate(expense.date)}</span>
                    {dayIndex > 0 && <span>יום {dayIndex}</span>}
                    <span className="flex items-center gap-1" title={paymentLabel}>
                      {getPaymentIcon(expense.paymentMethod)}
                      <span className="hidden sm:inline">{paymentLabel}</span>
                    </span>
                  </p>
                  {expense.notes && <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{expense.notes}</p>}
                </div>
                <div className="flex flex-col items-end gap-0.5 shrink-0">
                  <span className="tabular text-gray-900">{formatCurrency(expense.amount, currency)}</span>
                  <div className="flex -ml-2 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100 transition-opacity">
                    <button
                      onClick={() => onOpenAddExpense(expense)}
                      className="p-1.5 text-gray-500 hover:text-gray-800 rounded-full"
                      title="עריכה"
                      aria-label={`עריכת ${expense.description}`}
                    >
                      <Edit3 className="w-4 h-4" strokeWidth={1.75} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(expense.id)}
                      className="p-1.5 text-gray-500 hover:text-red-600 rounded-full"
                      title="מחיקה"
                      aria-label={`מחיקת ${expense.description}`}
                    >
                      <Trash2 className="w-4 h-4" strokeWidth={1.75} />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="flex flex-col items-center py-14 text-center">
          <span className="relative grid place-items-center w-20 h-20 mb-4" aria-hidden="true">
            <span className="wash absolute inset-2 rounded-full bg-orange-100" />
            <Receipt className="relative w-8 h-8 text-orange-700" strokeWidth={1.5} />
          </span>
          <h3 className="text-xl mb-1.5">{searchQuery || categoryFilter !== 'all' ? 'לא נמצאו הוצאות' : 'עוד אין הוצאות'}</h3>
          <p className="text-gray-500 max-w-sm mb-5">
            {searchQuery || categoryFilter !== 'all'
              ? 'נסו חיפוש אחר, או הציגו את כל הקטגוריות.'
              : 'רשמו הוצאה ושייכו אותה ליום בטיול, והתקציב יתעדכן מעצמו.'}
          </p>
          <button
            onClick={() => onOpenAddExpense()}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors font-semibold"
          >
            <Plus className="w-5 h-5" />
            הוספת הוצאה
          </button>
        </div>
      )}
    </div>
  );
}
