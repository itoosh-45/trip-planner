import React, { useState, useMemo, useEffect } from 'react';
import { usePlanner } from '../../context/PlannerContext';
import type { DayPlan } from '../../types';
import { 
  Plus, MapPin, Check, Trash2, Edit3,
  ChevronDown, Calendar, Utensils,
  Camera, Car, Hotel, ShoppingBag, Coffee, MoreHorizontal 
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface DaysTabProps {
  onOpenAddActivity: (dayId: string) => void;
  onOpenEditDay: (day?: DayPlan) => void;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  attraction: Camera,
  restaurant: Utensils,
  transport: Car,
  accommodation: Hotel,
  shopping: ShoppingBag,
  free: Coffee,
  other: MoreHorizontal
};

// activity pigments match the budget categories they cost against
const CATEGORY_COLORS: Record<string, string> = {
  attraction: 'bg-pink-300',
  restaurant: 'bg-orange-300',
  transport: 'bg-teal-300',
  accommodation: 'bg-indigo-300',
  shopping: 'bg-purple-300',
  free: 'bg-green-300',
  other: 'bg-slate-300'
};

export default function DaysTab({ onOpenAddActivity, onOpenEditDay }: DaysTabProps) {
  const { days, currency, toggleActivity, deleteActivity: removeActivity, deleteDay: removeDay } = usePlanner();
  const [expandedDayId, setExpandedDayId] = useState<string | null>(null);

  useEffect(() => {
    if (days.length > 0 && expandedDayId === null) {
      setExpandedDayId(days[0].id);
    }
  }, [days, expandedDayId]);

  const totalCost = useMemo(() => {
    return days.reduce((sum, day) => 
      sum + day.activities.reduce((actSum, act) => actSum + (act.estimatedCost || 0), 0)
    , 0);
  }, [days]);

  const deleteActivity = (dayId: string, activityId: string) => {
    if (window.confirm('האם למחוק פעילות זו?')) {
      removeActivity(dayId, activityId);
    }
  };

  const deleteDay = (dayId: string) => {
    if (window.confirm('האם למחוק יום זה על כל הפעילויות שבו?')) {
      removeDay(dayId);
      if (expandedDayId === dayId) {
        setExpandedDayId(null);
      }
    }
  };

  if (!days || days.length === 0) {
    return (
      <div className="flex flex-col items-center py-16 text-center">
        <span className="relative grid place-items-center w-24 h-24 mb-5" aria-hidden="true">
          <span className="wash absolute inset-2 rounded-full bg-sky-100" />
          <Calendar className="relative w-9 h-9 text-sky-700" strokeWidth={1.5} />
        </span>
        <h2 className="text-2xl mb-2">הדף עוד ריק</h2>
        <p className="text-gray-500 mb-6 max-w-sm">
          הוסיפו את היום הראשון של הטיול, ואחר כך את הפעילויות שלו.
        </p>
        <button
          onClick={() => onOpenEditDay()}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-full font-semibold hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          הוספת יום
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl">ימי הטיול</h2>
          <p className="tabular text-sm text-gray-500 mt-0.5">
            {days.length} ימים · עלות משוערת {formatCurrency(totalCost, currency)}
          </p>
        </div>
        <button
          onClick={() => onOpenEditDay()}
          className="flex items-center gap-1.5 text-blue-700 border border-blue-200 hover:bg-blue-50 px-3.5 py-2 rounded-full text-sm font-semibold transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          יום
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-200">
        {days.map((day, index) => {
          const isExpanded = expandedDayId === day.id;
          const dayTotalCost = day.activities.reduce((sum, act) => sum + (act.estimatedCost || 0), 0);
          const completedActivities = day.activities.filter(act => act.isCompleted).length;
          const allDone = day.activities.length > 0 && completedActivities === day.activities.length;

          return (
            <section key={day.id} aria-labelledby={`day-${day.id}`}>
              {/* Day header */}
              <div className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4">
                <button
                  onClick={() => setExpandedDayId(isExpanded ? null : day.id)}
                  aria-expanded={isExpanded}
                  className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0 text-right"
                >
                  <span className="relative grid place-items-center w-11 h-11 shrink-0" aria-hidden="true">
                    <span className={`wash absolute inset-0.5 rounded-full ${allDone ? 'bg-green-200' : 'bg-blue-100'}`} />
                    <span className="relative tabular text-base text-gray-900">{index + 1}</span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span id={`day-${day.id}`} className="block font-medium text-lg sm:text-xl text-gray-900 truncate">
                      {day.title || `יום ${index + 1}`}
                    </span>
                    <span className="tabular flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm text-gray-500">
                      <span>{new Date(day.date).toLocaleDateString('he-IL')}</span>
                      {day.destination && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" strokeWidth={1.75} />
                          {day.destination}
                        </span>
                      )}
                      {day.activities.length > 0 && (
                        <span>{completedActivities}/{day.activities.length} בוצעו</span>
                      )}
                    </span>
                  </span>
                  <span className="tabular text-gray-800 shrink-0">{formatCurrency(dayTotalCost, currency)}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                    strokeWidth={1.75}
                  />
                </button>
              </div>

              {/* Day page */}
              {isExpanded && (
                <div className="px-4 sm:px-6 pb-5">
                  {day.activities.length === 0 ? (
                    <p className="text-sm text-gray-500 py-4 text-center">עוד אין פעילויות ביום הזה.</p>
                  ) : (
                    <ol className="relative mr-[4.25rem] sm:mr-20 max-w-2xl border-r border-dashed border-gray-300">
                      {[...day.activities].sort((a, b) => (a.time || '').localeCompare(b.time || '')).map((activity) => {
                        const Icon = CATEGORY_ICONS[activity.category || 'other'] || MoreHorizontal;
                        const pigment = CATEGORY_COLORS[activity.category || 'other'] || 'bg-slate-300';

                        return (
                          <li key={activity.id} className="group relative flex items-start gap-3 pr-5 py-2.5">
                            <span className="tabular absolute -right-[4.25rem] sm:-right-20 top-3 w-12 sm:w-14 text-sm text-gray-500 text-left">
                              {activity.time}
                            </span>
                            <span className={`wash absolute -right-[7px] top-4 w-3.5 h-3.5 rounded-full ${pigment} ${activity.isCompleted ? 'opacity-40' : ''}`} aria-hidden="true" />

                            <div className="flex-1 min-w-0">
                              <p className={`flex items-start gap-1.5 ${activity.isCompleted ? 'text-gray-500 line-through decoration-gray-400' : 'text-gray-900'}`}>
                                <Icon className="w-4 h-4 mt-1 shrink-0 text-gray-400" strokeWidth={1.75} aria-hidden="true" />
                                <span>{activity.title}</span>
                              </p>
                              <p className="tabular flex flex-wrap gap-x-3 text-sm text-gray-500">
                                {activity.location && <span>{activity.location}</span>}
                                {activity.estimatedCost > 0 && <span>{formatCurrency(activity.estimatedCost, currency)}</span>}
                              </p>
                            </div>

                            <button
                              onClick={() => deleteActivity(day.id, activity.id)}
                              className="p-2 -my-1 text-gray-500 hover:text-red-600 rounded-full transition-colors sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100"
                              title="מחיקת פעילות"
                              aria-label={`מחיקת ${activity.title}`}
                            >
                              <Trash2 className="w-4 h-4" strokeWidth={1.75} />
                            </button>
                            <button
                              onClick={() => toggleActivity(day.id, activity.id)}
                              className="relative grid place-items-center w-9 h-9 -my-1 shrink-0"
                              title={activity.isCompleted ? 'סמן כלא בוצע' : 'סמן כבוצע'}
                              aria-pressed={activity.isCompleted}
                            >
                              {activity.isCompleted
                                ? <span className="wash absolute inset-1.5 rounded-full bg-green-300" aria-hidden="true" />
                                : <span className="absolute inset-2 rounded-full border-[1.5px] border-gray-300 hover:border-green-500" aria-hidden="true" />}
                              {activity.isCompleted && <Check className="relative w-4 h-4 text-green-800" strokeWidth={2.25} />}
                            </button>
                          </li>
                        );
                      })}
                    </ol>
                  )}

                  <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => onOpenAddActivity(day.id)}
                      className="flex items-center gap-1.5 text-blue-700 hover:bg-blue-50 px-3 py-2 -mr-3 rounded-full text-sm font-semibold transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      פעילות
                    </button>
                    <div className="flex items-center">
                      <button
                        onClick={() => onOpenEditDay(day)}
                        className="p-2 text-gray-500 hover:text-gray-800 rounded-full transition-colors"
                        title="עריכת יום"
                        aria-label="עריכת יום"
                      >
                        <Edit3 className="w-4.5 h-4.5" strokeWidth={1.75} />
                      </button>
                      <button
                        onClick={() => deleteDay(day.id)}
                        className="p-2 text-gray-500 hover:text-red-600 rounded-full transition-colors"
                        title="מחיקת יום"
                        aria-label="מחיקת יום"
                      >
                        <Trash2 className="w-4.5 h-4.5" strokeWidth={1.75} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
