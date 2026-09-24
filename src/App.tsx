import { useState } from 'react';
import { PlannerProvider } from './context/PlannerContext';
import Navbar from './components/Navbar';
import DaysTab from './components/tabs/DaysTab';
import BudgetPlanTab from './components/tabs/BudgetPlanTab';
import ExpensesTab from './components/tabs/ExpensesTab';
import AnalyticsTab from './components/tabs/AnalyticsTab';
import AddActivityModal from './components/modals/AddActivityModal';
import AddExpenseModal from './components/modals/AddExpenseModal';
import EditDayModal from './components/modals/EditDayModal';
import { usePlanner } from './context/PlannerContext';
import { formatCurrency } from './utils/formatters';
import type { TabId, DayPlan, Activity, Expense } from './types/index';
import { Plus } from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabId>('days');
  const { totalBudget, totalSpent, remainingBudget, budgetUtilization, currency } = usePlanner();

  // Modal state
  const [addActivityModal, setAddActivityModal] = useState<{ open: boolean; dayId: string; activity?: Activity }>({
    open: false,
    dayId: '',
  });
  const [addExpenseModal, setAddExpenseModal] = useState<{ open: boolean; expense?: Expense }>({
    open: false,
  });
  const [editDayModal, setEditDayModal] = useState<{ open: boolean; day?: DayPlan }>({
    open: false,
  });

  const isOver = remainingBudget < 0;
  const status = isOver
    ? { label: 'חריגה מהתקציב', text: 'text-red-600', wash: 'bg-red-300' }
    : budgetUtilization >= 85
    ? { label: 'קרוב לגבול', text: 'text-amber-700', wash: 'bg-amber-300' }
    : { label: 'במסלול התקציב', text: 'text-green-700', wash: 'bg-green-300' };

  return (
    <div className="min-h-screen pb-24 lg:pb-12">
      {/* shared watercolor edge: blurred, displaced by paper-like noise */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <filter id="wash" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
          {/* wobbly paper-soaked edge */}
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="7" result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="7" result="shape" />
          <feGaussianBlur in="shape" stdDeviation="0.6" result="soft" />
          {/* granulation: pigment settles unevenly into the paper tooth */}
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="1" seed="3" result="noise" />
          <feColorMatrix in="noise" type="matrix" values="1 0 0 0 0  1 0 0 0 0  1 0 0 0 0  0 0 0 0 1" result="grain" />
          <feComposite in="soft" in2="grain" operator="arithmetic" k1="0.16" k2="0.92" result="grained" />
          {/* pooled edge: a darker rim where the water dried */}
          <feMorphology in="soft" operator="erode" radius="1.2" result="inner" />
          <feComposite in="soft" in2="inner" operator="out" result="rim" />
          <feComponentTransfer in="rim" result="darkRim">
            <feFuncR type="linear" slope="0.8" />
            <feFuncG type="linear" slope="0.8" />
            <feFuncB type="linear" slope="0.8" />
            <feFuncA type="linear" slope="0.55" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode in="grained" />
            <feMergeNode in="darkRim" />
          </feMerge>
        </filter>
      </svg>

      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Budget ledger line */}
        <section aria-label="מצב התקציב" className="pt-5 pb-7 sm:pt-9 sm:pb-10">
          <p className="tabular flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className={`text-3xl sm:text-4xl font-light tracking-tight ${isOver ? 'text-red-600' : 'text-gray-900'}`}>
              {formatCurrency(Math.abs(remainingBudget), currency)}
            </span>
            <span className="text-gray-500">
              {isOver ? 'חריגה' : 'נותרו'} · הוצאו {formatCurrency(totalSpent, currency)} מתוך {formatCurrency(totalBudget, currency)}
            </span>
          </p>
          <div className="mt-3 flex items-center gap-3">
            <div className="relative h-2.5 flex-1 rounded-full bg-gray-100" role="progressbar" aria-valuenow={Math.round(budgetUtilization)} aria-valuemin={0} aria-valuemax={100} aria-label="ניצול התקציב">
              <div
                className={`wash absolute inset-y-0 right-0 rounded-full opacity-90 transition-[width] duration-700 ${status.wash}`}
                style={{ width: `${Math.max(budgetUtilization, 2)}%` }}
              />
            </div>
            <span className={`tabular text-sm whitespace-nowrap ${status.text}`}>
              {Math.round(budgetUtilization)}% · {status.label}
            </span>
          </div>
        </section>

        {/* Tab Content */}
        <div key={activeTab} className="page-in">
          {activeTab === 'days' && (
            <DaysTab
              onOpenAddActivity={(dayId: string, activity?: Activity) =>
                setAddActivityModal({ open: true, dayId, activity })
              }
              onOpenEditDay={(day?: DayPlan) => setEditDayModal({ open: true, day })}
            />
          )}
          {activeTab === 'budget' && <BudgetPlanTab />}
          {activeTab === 'expenses' && (
            <ExpensesTab
              onOpenAddExpense={(expense?: Expense) =>
                setAddExpenseModal({ open: true, expense })
              }
            />
          )}
          {activeTab === 'analytics' && <AnalyticsTab />}
        </div>
      </main>

      {/* The most frequent action mid-trip, one thumb away */}
      <button
        onClick={() => setAddExpenseModal({ open: true })}
        className="lg:hidden fixed z-30 left-4 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] isolate flex items-center gap-1.5 rounded-full text-blue-900 pl-5 pr-4 py-3 text-base font-semibold active:bg-blue-50"
      >
        <span className="wash absolute inset-0 -z-10 rounded-full bg-blue-200 [mix-blend-mode:normal]" aria-hidden="true" />
        <Plus className="w-5 h-5" aria-hidden="true" />
        הוצאה
      </button>

      {/* Modals */}
      <AddActivityModal
        isOpen={addActivityModal.open}
        onClose={() => setAddActivityModal({ open: false, dayId: '' })}
        dayId={addActivityModal.dayId}
        editActivity={addActivityModal.activity}
      />
      <AddExpenseModal
        isOpen={addExpenseModal.open}
        onClose={() => setAddExpenseModal({ open: false })}
        editExpense={addExpenseModal.expense}
      />
      <EditDayModal
        isOpen={editDayModal.open}
        onClose={() => setEditDayModal({ open: false })}
        editDay={editDayModal.day}
      />
    </div>
  );
}

export default function App() {
  return (
    <PlannerProvider>
      <AppContent />
    </PlannerProvider>
  );
}
