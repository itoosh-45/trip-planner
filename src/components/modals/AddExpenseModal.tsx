import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { BUDGET_CATEGORY_LABELS, PAYMENT_METHOD_LABELS } from '../../types/index';
import type { Expense, BudgetCategoryId, PaymentMethod } from '../../types/index';
import { usePlanner } from '../../context/PlannerContext';
import { Coins, Tag, Calendar, CreditCard, FileText, Link, Type } from 'lucide-react';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  editExpense?: Expense;
}

export default function AddExpenseModal({ isOpen, onClose, editExpense }: AddExpenseModalProps) {
  const { addExpense, updateExpense, days } = usePlanner();
  
  const [amount, setAmount] = useState<number | ''>('');
  const [categoryId, setCategoryId] = useState<BudgetCategoryId>('accommodation');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [dayId, setDayId] = useState<string>('');
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editExpense) {
      setAmount(editExpense.amount);
      setCategoryId(editExpense.categoryId);
      setDate(editExpense.date);
      setDayId(editExpense.dayId || '');
      setDescription(editExpense.description);
      setPaymentMethod(editExpense.paymentMethod);
      setNotes(editExpense.notes || '');
    } else {
      setAmount('');
      setCategoryId('accommodation');
      setDate(new Date().toISOString().split('T')[0]);
      setDayId('');
      setDescription('');
      setPaymentMethod('credit');
      setNotes('');
    }
  }, [editExpense, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description || !date) return;

    if (editExpense) {
      updateExpense(editExpense.id, {
        amount: Number(amount),
        categoryId,
        date,
        dayId: dayId || undefined,
        description,
        paymentMethod,
        notes
      });
    } else {
      addExpense({
        amount: Number(amount),
        categoryId,
        date,
        dayId: dayId || undefined,
        description,
        paymentMethod,
        notes
      });
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editExpense ? 'עריכת הוצאה' : 'הוספת הוצאה'}>
      <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block space-y-1.5">
            <span className="flex items-center gap-1.5 text-sm text-gray-600">
              <Coins className="w-4 h-4 text-gray-400" strokeWidth={1.75} aria-hidden="true" />
              סכום
            </span>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')}
              className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-base text-gray-900 outline-none focus:border-blue-400 transition-colors"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="flex items-center gap-1.5 text-sm text-gray-600">
              <Type className="w-4 h-4 text-gray-400" strokeWidth={1.75} aria-hidden="true" />
              תיאור
            </span>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-base text-gray-900 outline-none focus:border-blue-400 transition-colors"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block space-y-1.5">
            <span className="flex items-center gap-1.5 text-sm text-gray-600">
              <Tag className="w-4 h-4 text-gray-400" strokeWidth={1.75} aria-hidden="true" />
              קטגוריה
            </span>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value as BudgetCategoryId)}
              className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-base text-gray-900 outline-none focus:border-blue-400 transition-colors"
            >
              {Object.entries(BUDGET_CATEGORY_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </label>
          <label className="block space-y-1.5">
            <span className="flex items-center gap-1.5 text-sm text-gray-600">
              <Calendar className="w-4 h-4 text-gray-400" strokeWidth={1.75} aria-hidden="true" />
              תאריך
            </span>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-base text-gray-900 outline-none focus:border-blue-400 transition-colors"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block space-y-1.5">
            <span className="flex items-center gap-1.5 text-sm text-gray-600">
              <Link className="w-4 h-4 text-gray-400" strokeWidth={1.75} aria-hidden="true" />
              שיוך ליום (אופציונלי)
            </span>
            <select
              value={dayId}
              onChange={(e) => setDayId(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-base text-gray-900 outline-none focus:border-blue-400 transition-colors"
            >
              <option value="">ללא שיוך</option>
              {days.map((day) => (
                <option key={day.id} value={day.id}>יום {day.dayNumber} - {day.title}</option>
              ))}
            </select>
          </label>
          <label className="block space-y-1.5">
            <span className="flex items-center gap-1.5 text-sm text-gray-600">
              <CreditCard className="w-4 h-4 text-gray-400" strokeWidth={1.75} aria-hidden="true" />
              אמצעי תשלום
            </span>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-base text-gray-900 outline-none focus:border-blue-400 transition-colors"
            >
              {Object.entries(PAYMENT_METHOD_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </label>
        </div>

        <label className="block space-y-1.5">
          <span className="flex items-center gap-1.5 text-sm text-gray-600">
            <FileText className="w-4 h-4 text-gray-400" strokeWidth={1.75} aria-hidden="true" />
            הערות
          </span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-base text-gray-900 outline-none focus:border-blue-400 transition-colors resize-none"
          />
        </label>

        <div className="flex gap-3 sticky bottom-0 -mx-5 sm:-mx-6 px-5 sm:px-6 pt-3 pb-4 bg-white border-t border-gray-100">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors"
          >
            {editExpense ? 'שמור שינויים' : 'הוסף הוצאה'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-full hover:bg-gray-50 transition-colors"
          >
            ביטול
          </button>
        </div>
      </form>
    </Modal>
  );
}
