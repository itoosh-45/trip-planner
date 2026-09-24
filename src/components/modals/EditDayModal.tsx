import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import type { DayPlan } from '../../types/index';
import { usePlanner } from '../../context/PlannerContext';
import { Calendar, MapPin, FileText, Hash, Type } from 'lucide-react';

interface EditDayModalProps {
  isOpen: boolean;
  onClose: () => void;
  editDay?: DayPlan;
}

export default function EditDayModal({ isOpen, onClose, editDay }: EditDayModalProps) {
  const { days, addDay, updateDay, deleteDay } = usePlanner();
  
  const [dayNumber, setDayNumber] = useState(1);
  const [date, setDate] = useState('');
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editDay) {
      setDayNumber(editDay.dayNumber);
      setDate(editDay.date);
      setTitle(editDay.title);
      setDestination(editDay.destination);
      setNotes(editDay.notes || '');
    } else {
      setDayNumber(days.length + 1);
      setDate('');
      setTitle('');
      setDestination('');
      setNotes('');
    }
  }, [editDay, isOpen, days.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !title || !destination) return;

    if (editDay) {
      updateDay(editDay.id, {
        dayNumber,
        date,
        title,
        destination,
        notes
      });
    } else {
      addDay({
        dayNumber,
        date,
        title,
        destination,
        notes
      });
    }
    onClose();
  };

  const handleDelete = () => {
    if (editDay && window.confirm('האם אתה בטוח שברצונך למחוק יום זה?')) {
      deleteDay(editDay.id);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editDay ? 'עריכת יום' : 'הוספת יום חדש'}>
      <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block space-y-1.5">
            <span className="flex items-center gap-1.5 text-sm text-gray-600">
              <Hash className="w-4 h-4 text-gray-400" strokeWidth={1.75} aria-hidden="true" />
              מספר יום
            </span>
            <input
              type="number"
              required
              min="1"
              value={dayNumber}
              onChange={(e) => setDayNumber(Number(e.target.value))}
              className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-base text-gray-900 outline-none focus:border-blue-400 transition-colors"
            />
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
              <Type className="w-4 h-4 text-gray-400" strokeWidth={1.75} aria-hidden="true" />
              כותרת
            </span>
            <input
              type="text"
              required
              placeholder="לדוגמה: הגעה לרומא"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-base text-gray-900 outline-none focus:border-blue-400 transition-colors"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="flex items-center gap-1.5 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-gray-400" strokeWidth={1.75} aria-hidden="true" />
              יעד
            </span>
            <input
              type="text"
              required
              placeholder="לדוגמה: רומא"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-base text-gray-900 outline-none focus:border-blue-400 transition-colors"
            />
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
            rows={3}
            className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-base text-gray-900 outline-none focus:border-blue-400 transition-colors resize-none"
          />
        </label>

        <div className="flex flex-col gap-3 sticky bottom-0 -mx-5 sm:-mx-6 px-5 sm:px-6 pt-3 pb-4 bg-white border-t border-gray-100">
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors"
            >
              {editDay ? 'שמור שינויים' : 'הוסף יום'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-full hover:bg-gray-50 transition-colors"
            >
              ביטול
            </button>
          </div>
          {editDay && (
            <button
              type="button"
              onClick={handleDelete}
              className="w-full text-red-600 py-2.5 rounded-full hover:bg-red-50 transition-colors"
            >
              מחק יום זה
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
}
