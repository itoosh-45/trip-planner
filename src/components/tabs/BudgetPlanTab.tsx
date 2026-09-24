import React, { useState, useEffect } from 'react';
import { usePlanner } from '../../context/PlannerContext';
import type { BudgetCategoryId } from '../../types/index';
import { formatCurrency } from '../../utils/formatters';
import ProgressBar from '../common/ProgressBar';
import {
  Edit3,
  Hotel,
  Plane,
  Utensils,
  Ticket,
  ShoppingBag,
  Bus,
  MoreHorizontal
} from 'lucide-react';

// one pigment per category, shared with the expenses ledger and the day timeline
const CATEGORY_STYLES: Record<BudgetCategoryId, { wash: string; icon: React.ElementType }> = {
  accommodation: { wash: 'bg-indigo-300', icon: Hotel },
  flights: { wash: 'bg-sky-300', icon: Plane },
  food: { wash: 'bg-orange-300', icon: Utensils },
  attractions: { wash: 'bg-pink-300', icon: Ticket },
  shopping: { wash: 'bg-purple-300', icon: ShoppingBag },
  transport: { wash: 'bg-teal-300', icon: Bus },
  other: { wash: 'bg-slate-300', icon: MoreHorizontal }
};

export default function BudgetPlanTab() {
  const {
    totalBudget,
    setTotalBudget,
    currency,
    budgetCategories,
    updateCategoryBudget,
    getCategorySpent,
    days
  } = usePlanner();

  const [isEditingTotal, setIsEditingTotal] = useState(false);
  const [tempTotalBudget, setTempTotalBudget] = useState(totalBudget.toString());

  const [editingCategory, setEditingCategory] = useState<BudgetCategoryId | null>(null);
  const [tempCategoryBudget, setTempCategoryBudget] = useState('');

  // Sync temp state if totalBudget changes externally
  useEffect(() => {
    setTempTotalBudget(totalBudget.toString());
  }, [totalBudget]);

  const handleTotalBudgetSubmit = () => {
    const val = parseFloat(tempTotalBudget);
    if (!isNaN(val) && val >= 0) {
      setTotalBudget(val);
    } else {
      setTempTotalBudget(totalBudget.toString());
    }
    setIsEditingTotal(false);
  };

  const handleCategoryBudgetSubmit = (categoryId: BudgetCategoryId) => {
    const val = parseFloat(tempCategoryBudget);
    if (!isNaN(val) && val >= 0) {
      updateCategoryBudget(categoryId, val);
    }
    setEditingCategory(null);
  };

  const totalAllocated = budgetCategories.reduce((sum, cat) => sum + cat.planned, 0);
  const averageDaily = days.length > 0 ? totalBudget / days.length : 0;
  const unallocated = totalBudget - totalAllocated;
  const stripTotal = Math.max(totalBudget, totalAllocated);

  return (
    <div className="space-y-6">
      {/* Total budget */}
      <div>
        <h2 className="text-2xl">תכנון התקציב</h2>
        <div className="mt-3 flex flex-wrap items-end gap-x-8 gap-y-2">
          {isEditingTotal ? (
            <label className="flex items-center gap-2">
              <span className="sr-only">תקציב כולל</span>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                className="w-44 text-3xl font-light bg-white border-b-2 border-blue-300 px-1 py-0.5 outline-none"
                value={tempTotalBudget}
                onChange={(e) => setTempTotalBudget(e.target.value)}
                onBlur={handleTotalBudgetSubmit}
                onKeyDown={(e) => e.key === 'Enter' && handleTotalBudgetSubmit()}
                autoFocus
              />
              <span className="text-2xl text-gray-500">{currency}</span>
            </label>
          ) : (
            <button
              className="group flex items-center gap-2 text-right"
              onClick={() => setIsEditingTotal(true)}
              title="עריכת התקציב הכולל"
            >
              <span className="tabular text-3xl font-light text-gray-900 border-b border-dashed border-gray-300 group-hover:border-blue-400">
                {formatCurrency(totalBudget, currency)}
              </span>
              <Edit3 className="w-4 h-4 text-gray-400 group-hover:text-blue-600" strokeWidth={1.75} />
            </button>
          )}
          <p className="tabular text-sm text-gray-500 pb-1">
            תקציב כולל · {formatCurrency(averageDaily, currency)} ליום ({days.length} ימים)
          </p>
        </div>
      </div>

      {/* Allocation strip: one band of paint swatches */}
      <div>
        {stripTotal > 0 ? (
          <div className="flex h-5 gap-[3px]" aria-hidden="true">
            {budgetCategories.filter(c => c.planned > 0).map(category => (
              <span
                key={category.id}
                className={`wash rounded-full ${(CATEGORY_STYLES[category.id] || CATEGORY_STYLES.other).wash}`}
                style={{ width: `${(category.planned / stripTotal) * 100}%` }}
                title={category.name}
              />
            ))}
            {unallocated > 0 && (
              <span className="rounded-full border border-dashed border-gray-300" style={{ width: `${(unallocated / stripTotal) * 100}%` }} />
            )}
          </div>
        ) : (
          <div className="h-5 rounded-full border border-dashed border-gray-300" aria-hidden="true" />
        )}
        <p className={`tabular mt-2 text-sm ${unallocated < 0 ? 'text-red-600' : 'text-gray-500'}`}>
          {formatCurrency(totalAllocated, currency)} מוקצים לקטגוריות
          {unallocated > 0 && ` · ${formatCurrency(unallocated, currency)} עוד לא מוקצים`}
          {unallocated < 0 && ` · ${formatCurrency(-unallocated, currency)} מעבר לתקציב הכולל`}
        </p>
      </div>

      {/* Categories: planned vs. spent */}
      <ul className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
        {budgetCategories.map((category) => {
          const spent = getCategorySpent(category.id);
          const style = CATEGORY_STYLES[category.id] || CATEGORY_STYLES.other;
          const Icon = style.icon;
          const isEditing = editingCategory === category.id;
          const isOver = spent > category.planned;
          const share = stripTotal > 0 ? Math.round((category.planned / stripTotal) * 100) : 0;

          return (
            <li key={category.id} className="px-4 sm:px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="relative grid place-items-center w-9 h-9 shrink-0" aria-hidden="true">
                  <span className={`wash absolute inset-0.5 rounded-full opacity-70 ${style.wash}`} />
                  <Icon className="relative w-4 h-4 text-gray-800" strokeWidth={1.75} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900">{category.name}</p>
                  <p className={`tabular text-sm ${isOver && category.planned > 0 ? 'text-red-600' : 'text-gray-500'}`}>
                    הוצאו {formatCurrency(spent, currency)}
                    {share > 0 && <span> · {share}% מהתקציב</span>}
                  </p>
                </div>

                {isEditing ? (
                  <label className="flex items-center gap-1.5">
                    <span className="sr-only">תקציב ל{category.name}</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      min="0"
                      className="w-24 text-left bg-white border border-blue-300 rounded-lg px-2 py-1 outline-none"
                      value={tempCategoryBudget}
                      onChange={(e) => setTempCategoryBudget(e.target.value)}
                      onBlur={() => handleCategoryBudgetSubmit(category.id)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCategoryBudgetSubmit(category.id)}
                      autoFocus
                      dir="ltr"
                    />
                  </label>
                ) : (
                  <button
                    className="group flex items-center gap-1.5 px-1 -ml-1"
                    onClick={() => {
                      setEditingCategory(category.id);
                      setTempCategoryBudget(category.planned.toString());
                    }}
                    title="עריכת התקציב לקטגוריה"
                  >
                    <span className="tabular text-gray-900 border-b border-dashed border-gray-300 group-hover:border-blue-400">
                      {formatCurrency(category.planned, currency)}
                    </span>
                    <Edit3 className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-600" strokeWidth={1.75} />
                  </button>
                )}
              </div>
              {category.planned > 0 && (
                <div className="mt-2.5 mr-12">
                  <ProgressBar current={spent} total={category.planned} size="sm" showPercentage={false} showValues={false} />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
