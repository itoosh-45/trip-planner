import { usePlanner } from '../../context/PlannerContext';
import type { BudgetCategoryId } from '../../types';
import { formatCurrency } from '../../utils/formatters';

// same pigments as the budget plan and expenses ledger
const PIGMENT: Record<BudgetCategoryId, { planned: string; spent: string }> = {
  accommodation: { planned: 'bg-indigo-200', spent: 'bg-indigo-300' },
  flights: { planned: 'bg-sky-200', spent: 'bg-sky-300' },
  food: { planned: 'bg-orange-200', spent: 'bg-orange-300' },
  attractions: { planned: 'bg-pink-200', spent: 'bg-pink-300' },
  shopping: { planned: 'bg-purple-200', spent: 'bg-purple-300' },
  transport: { planned: 'bg-teal-200', spent: 'bg-teal-300' },
  other: { planned: 'bg-slate-200', spent: 'bg-slate-300' }
};

export default function AnalyticsTab() {
  const { totalBudget, totalSpent, budgetCategories, expenses, days, currency, getCategorySpent } = usePlanner();

  const categoryStats = budgetCategories.map(cat => ({
    category: cat.id, label: cat.name, planned: cat.planned, spent: getCategorySpent(cat.id)
  }));
  const maxCategoryAmount = Math.max(...categoryStats.map(c => Math.max(c.planned, c.spent)), 1);

  const dailySpending = days.map((day, index) => ({
    dayNumber: index + 1,
    spent: expenses.filter(e => e.dayId === day.id).reduce((sum, e) => sum + e.amount, 0)
  }));
  const averageDailySpend = dailySpending.length > 0 ? totalSpent / dailySpending.length : 0;
  const recommendedDaily = days.length > 0 ? totalBudget / days.length : 0;
  const maxDailyAmount = Math.max(...dailySpending.map(d => d.spent), averageDailySpend, 1);

  const highestCategory = [...categoryStats].sort((a, b) => b.spent - a.spent)[0];
  const highestDay = [...dailySpending].sort((a, b) => b.spent - a.spent)[0];
  const overBudgetCategories = categoryStats.filter(c => c.spent > c.planned && c.planned > 0);
  const paceOver = recommendedDaily > 0 && averageDailySpend > recommendedDaily;

  const insights = [
    {
      label: 'הקטגוריה היקרה ביותר',
      value: highestCategory && highestCategory.spent > 0
        ? `${highestCategory.label}, ${formatCurrency(highestCategory.spent, currency)}`
        : 'עוד אין הוצאות'
    },
    {
      label: 'היום היקר ביותר',
      value: highestDay && highestDay.spent > 0
        ? `יום ${highestDay.dayNumber}, ${formatCurrency(highestDay.spent, currency)}`
        : 'עוד אין הוצאות'
    },
    {
      label: 'קטגוריות בחריגה',
      value: overBudgetCategories.length > 0 ? overBudgetCategories.map(c => c.label).join(', ') : 'אין',
      tone: overBudgetCategories.length > 0 ? 'text-red-600' : undefined
    },
    {
      label: 'קצב יומי בפועל מול מומלץ',
      value: `${formatCurrency(averageDailySpend, currency)} מול ${formatCurrency(recommendedDaily, currency)}`,
      tone: paceOver ? 'text-amber-700' : undefined
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl">ניתוח</h2>
        <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 border-t border-gray-200 pt-4">
          {insights.map(item => (
            <div key={item.label}>
              <dt className="text-sm text-gray-500">{item.label}</dt>
              <dd className={`tabular text-lg ${item.tone ?? 'text-gray-900'}`}>{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Planned vs. spent, per category */}
      <section aria-labelledby="planned-vs-spent">
        <div className="flex items-end justify-between gap-4 mb-3">
          <h3 id="planned-vs-spent" className="text-xl">מתוכנן מול בפועל</h3>
          <div className="flex items-center gap-4 text-sm text-gray-500" aria-hidden="true">
            <span className="flex items-center gap-1.5"><span className="wash w-3 h-3 rounded-full bg-gray-200" />מתוכנן (בהיר)</span>
            <span className="flex items-center gap-1.5"><span className="wash w-3 h-3 rounded-full bg-gray-400" />בפועל</span>
          </div>
        </div>
        <ul className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
          {categoryStats.map(stat => {
            const pigment = PIGMENT[stat.category] || PIGMENT.other;
            const isOver = stat.spent > stat.planned && stat.planned > 0;
            const pct = stat.planned > 0 ? Math.round((stat.spent / stat.planned) * 100) : null;
            return (
              <li key={stat.category} className="px-4 sm:px-5 py-3.5">
                <div className="flex items-baseline justify-between gap-3 mb-2">
                  <span className="text-gray-900">{stat.label}</span>
                  <span className={`tabular text-sm ${isOver ? 'text-red-600' : 'text-gray-500'}`}>
                    {formatCurrency(stat.spent, currency)} מתוך {formatCurrency(stat.planned, currency)}
                    {pct !== null && ` · ${pct}%`}
                  </span>
                </div>
                {/* spent glazes over planned: where they overlap the pigment deepens */}
                <div className="relative h-3" aria-hidden="true">
                  {stat.planned > 0 && (
                    <div className={`wash absolute inset-y-0 right-0 rounded-full ${pigment.planned}`} style={{ width: `${(stat.planned / maxCategoryAmount) * 100}%` }} />
                  )}
                  {stat.spent > 0 && (
                    <div className={`wash absolute inset-y-0.5 right-0 rounded-full ${isOver ? 'bg-red-300' : pigment.spent}`} style={{ width: `${(stat.spent / maxCategoryAmount) * 100}%` }} />
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Daily spending */}
      <section aria-labelledby="daily-spending">
        <h3 id="daily-spending" className="text-xl mb-3">הוצאות לפי יום</h3>
        {dailySpending.length > 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 px-4 sm:px-6 pt-8 pb-4 overflow-x-auto">
            <div className="relative flex items-end gap-3 sm:gap-5 h-44 min-w-fit">
              {averageDailySpend > 0 && (
                <div
                  className="absolute inset-x-0 border-t border-dashed border-gray-400 pointer-events-none"
                  style={{ bottom: `${(averageDailySpend / maxDailyAmount) * 100}%` }}
                >
                  <span className="tabular absolute -top-5 left-0 text-xs text-gray-500">
                    ממוצע {formatCurrency(averageDailySpend, currency)}
                  </span>
                </div>
              )}
              {dailySpending.map(day => (
                <div key={day.dayNumber} className="flex flex-col items-center justify-end h-full flex-1 min-w-12">
                  <span className="tabular text-xs text-gray-700 mb-1">{formatCurrency(day.spent, currency)}</span>
                  {day.spent > 0 && (
                    <div
                      className="wash w-8 sm:w-10 rounded-t-lg rounded-b-sm bg-blue-200"
                      style={{ height: `${(day.spent / maxDailyAmount) * 100}%` }}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-3 sm:gap-5 mt-2 border-t border-gray-200 pt-2 min-w-fit">
              {dailySpending.map(day => (
                <span key={day.dayNumber} className="flex-1 min-w-12 text-center text-sm text-gray-500">יום {day.dayNumber}</span>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500">כשיהיו ימים בטיול, ההוצאות של כל יום יופיעו כאן.</p>
        )}
      </section>
    </div>
  );
}
