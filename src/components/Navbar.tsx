import React, { useState, useRef, useEffect } from 'react';
import { 
  Plane, 
  Download, 
  Upload, 
  RotateCcw, 
  FileJson, 
  FileSpreadsheet, 
  Calendar, 
  Target, 
  CreditCard, 
  BarChart3, 
  Database,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';
import type { Currency, TabId } from '../types';
import { exportToJSON, exportExpensesToCSV, importFromJSON } from '../utils/exportUtils';

interface NavbarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange }) => {
  const { tripName, currency, totalBudget, days, budgetCategories, expenses, setTripName, setCurrency, importData, resetAll, loadSampleData } = usePlanner();
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingTripName, setEditingTripName] = useState(false);
  const [tripNameInput, setTripNameInput] = useState(tripName);
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmDemo, setConfirmDemo] = useState(false);
  
  const exportMenuRef = useRef<HTMLDivElement>(null);
  const settingsMenuRef = useRef<HTMLDivElement>(null);

  // Sync input with state
  useEffect(() => {
    setTripNameInput(tripName);
  }, [tripName]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setIsExportMenuOpen(false);
      }
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTripNameSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (tripNameInput.trim()) {
      setTripName(tripNameInput.trim());
    } else {
      setTripNameInput(tripName); // Revert if empty
    }
    setEditingTripName(false);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importFromJSON(file)
        .then(data => {
          importData(data);
          alert('הנתונים יובאו בהצלחה');
        })
        .catch(error => {
          console.error('Error parsing JSON', error);
          alert('שגיאה בטעינת הקובץ. אנא ודא שזהו קובץ JSON תקין.');
        });
    }
    // Reset file input (both desktop and mobile inputs) so the same file can be re-imported
    e.target.value = '';
  };

  const handleReset = () => {
    if (confirmReset) {
      resetAll();
      setConfirmReset(false);
    } else {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 3000);
    }
  };

  const handleDemo = () => {
    if (confirmDemo) {
      loadSampleData();
      setConfirmDemo(false);
    } else {
      setConfirmDemo(true);
      setTimeout(() => setConfirmDemo(false), 3000);
    }
  };

  const currencies: { value: Currency; label: string }[] = [
    { value: '₪', label: '₪ שקל' },
    { value: '$', label: '$ דולר' },
    { value: '€', label: '€ אירו' },
    { value: '£', label: '£ פאונד' },
  ];

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'days', label: 'ימים', icon: <Calendar size={20} strokeWidth={1.75} /> },
    { id: 'budget', label: 'תכנון תקציב', icon: <Target size={20} strokeWidth={1.75} /> },
    { id: 'expenses', label: 'הוצאות', icon: <CreditCard size={20} strokeWidth={1.75} /> },
    { id: 'analytics', label: 'ניתוח', icon: <BarChart3 size={20} strokeWidth={1.75} /> },
  ];

  const exportJSON = () => exportToJSON({ tripName, currency, totalBudget, days, budgetCategories, expenses });
  const exportCSV = () => exportExpensesToCSV(expenses, currency);

  const quiet = 'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors';
  const sheetRow = 'flex items-center gap-3 w-full px-4 py-3.5 text-base text-gray-700 active:bg-gray-100';

  return (
    <header ref={settingsMenuRef} className="sticky top-0 z-40 bg-paper border-b border-gray-200" dir="rtl">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-14 sm:h-16 gap-3">

          {/* Mark and trip name */}
          <div className="flex items-center gap-3 min-w-0">
            <span className="relative grid place-items-center w-9 h-9 shrink-0" aria-hidden="true">
              <span className="wash absolute inset-0.5 rounded-full bg-blue-200" />
              <Plane size={18} strokeWidth={1.75} className="relative text-blue-700 -rotate-45" />
            </span>
            {editingTripName ? (
              <form onSubmit={handleTripNameSubmit} className="min-w-0">
                <input
                  type="text"
                  value={tripNameInput}
                  onChange={(e) => setTripNameInput(e.target.value)}
                  onBlur={() => handleTripNameSubmit()}
                  autoFocus
                  aria-label="שם הטיול"
                  className="font-medium text-lg sm:text-xl text-gray-900 bg-transparent border-b border-blue-300 outline-none w-48 sm:w-80 py-0.5"
                />
              </form>
            ) : (
              <button
                onClick={() => setEditingTripName(true)}
                className="font-medium text-lg sm:text-xl text-gray-900 truncate text-right hover:text-blue-700 transition-colors"
                title="לחצו לעריכת שם הטיול"
              >
                {tripName || 'טיול ללא שם'}
              </button>
            )}
          </div>

          {/* Desktop actions */}
          <div className="hidden lg:flex items-center gap-1 shrink-0">
            <label className="relative">
              <span className="sr-only">מטבע</span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="appearance-none bg-transparent hover:bg-gray-100 text-gray-700 text-sm py-1.5 pl-7 pr-3 rounded-lg border border-gray-200 cursor-pointer transition-colors"
              >
                {currencies.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
            </label>

            <div className="relative" ref={exportMenuRef}>
              <button onClick={() => setIsExportMenuOpen(!isExportMenuOpen)} className={quiet} aria-expanded={isExportMenuOpen}>
                <Download size={16} strokeWidth={1.75} />
                <span>ייצוא</span>
              </button>
              {isExportMenuOpen && (
                <div className="absolute left-0 mt-2 w-52 bg-white rounded-xl border border-gray-200 overflow-hidden z-50 py-1">
                  <button onClick={() => { exportJSON(); setIsExportMenuOpen(false); }} className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                    <FileJson size={16} strokeWidth={1.75} className="text-gray-500" />
                    גיבוי מלא (JSON)
                  </button>
                  <button onClick={() => { exportCSV(); setIsExportMenuOpen(false); }} className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                    <FileSpreadsheet size={16} strokeWidth={1.75} className="text-gray-500" />
                    הוצאות לאקסל (CSV)
                  </button>
                </div>
              )}
            </div>

            <label className={`${quiet} cursor-pointer`}>
              <Upload size={16} strokeWidth={1.75} />
              <span>ייבוא</span>
              <input type="file" accept=".json" className="hidden" onChange={handleImport} />
            </label>

            <span className="w-px h-5 bg-gray-200 mx-1" />

            <button onClick={handleDemo} className={confirmDemo ? `${quiet} !text-amber-700 !bg-amber-50` : quiet}>
              <Database size={16} strokeWidth={1.75} />
              <span>{confirmDemo ? 'להחליף בדוגמה?' : 'טען דוגמה'}</span>
            </button>
            <button onClick={handleReset} className={confirmReset ? `${quiet} !text-red-600 !bg-red-50` : `${quiet} hover:!text-red-600`}>
              <RotateCcw size={16} strokeWidth={1.75} />
              <span>{confirmReset ? 'למחוק הכל?' : 'איפוס'}</span>
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="lg:hidden p-2 -ml-2 rounded-lg text-gray-600 active:bg-gray-100"
            aria-label={isSettingsOpen ? 'סגירת תפריט' : 'תפריט'}
            aria-expanded={isSettingsOpen}
          >
            {isSettingsOpen ? <X size={22} strokeWidth={1.75} /> : <Menu size={22} strokeWidth={1.75} />}
          </button>
        </div>

        {/* Desktop tabs */}
        <nav className="hidden lg:flex gap-1 -mb-px" aria-label="לשוניות">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative flex items-center gap-2 px-4 pt-1 pb-3 text-[0.95rem] transition-colors ${
                  isActive ? 'text-gray-900' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {isActive && <span className="wash absolute bottom-0.5 inset-x-3 h-1.5 rounded-full bg-blue-300" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile sheet */}
      {isSettingsOpen && (
        <div className="lg:hidden absolute top-full inset-x-0 bg-white border-b border-gray-200 divide-y divide-gray-100">
          <label className="flex items-center justify-between px-4 py-3 text-base text-gray-700">
            מטבע
            <select
              value={currency}
              onChange={(e) => { setCurrency(e.target.value as Currency); setIsSettingsOpen(false); }}
              className="bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-3 text-base"
            >
              {currencies.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </label>
          <button onClick={() => { exportJSON(); setIsSettingsOpen(false); }} className={sheetRow}>
            <FileJson size={20} strokeWidth={1.75} className="text-gray-400" /> גיבוי מלא (JSON)
          </button>
          <button onClick={() => { exportCSV(); setIsSettingsOpen(false); }} className={sheetRow}>
            <FileSpreadsheet size={20} strokeWidth={1.75} className="text-gray-400" /> הוצאות לאקסל (CSV)
          </button>
          <label className={`${sheetRow} cursor-pointer`}>
            <Upload size={20} strokeWidth={1.75} className="text-gray-400" /> ייבוא מגיבוי
            <input type="file" accept=".json" className="hidden" onChange={(e) => { handleImport(e); setIsSettingsOpen(false); }} />
          </label>
          <button onClick={handleDemo} className={`${sheetRow} ${confirmDemo ? 'text-amber-700 bg-amber-50' : ''}`}>
            <Database size={20} strokeWidth={1.75} className={confirmDemo ? 'text-amber-600' : 'text-gray-400'} />
            {confirmDemo ? 'להחליף את הנתונים בדוגמה? לחצו שוב' : 'טען טיול לדוגמה'}
          </button>
          <button onClick={handleReset} className={`${sheetRow} ${confirmReset ? 'text-red-600 bg-red-50' : 'text-red-600'}`}>
            <RotateCcw size={20} strokeWidth={1.75} />
            {confirmReset ? 'למחוק את כל הנתונים? לחצו שוב' : 'איפוס נתונים'}
          </button>
        </div>
      )}

      {/* Mobile bottom tabs */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-paper border-t border-gray-200 pb-safe" aria-label="לשוניות">
        <div className="grid grid-cols-4">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex flex-col items-center gap-0.5 pt-2 pb-2.5 text-xs ${isActive ? 'text-blue-700' : 'text-gray-500'}`}
              >
                <span className="relative grid place-items-center w-12 h-7">
                  {isActive && <span className="wash absolute inset-0 rounded-full bg-blue-100" />}
                  <span className="relative">{tab.icon}</span>
                </span>
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
