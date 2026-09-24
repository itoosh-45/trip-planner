import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { ACTIVITY_CATEGORY_LABELS } from '../../types/index';
import type { Activity, ActivityCategory } from '../../types/index';
import { usePlanner } from '../../context/PlannerContext';
import { Clock, MapPin, Tag, Coins, FileText, Type } from 'lucide-react';

interface AddActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayId: string;
  editActivity?: Activity;
}

export default function AddActivityModal({ isOpen, onClose, dayId, editActivity }: AddActivityModalProps) {
  const { addActivity, updateActivity } = usePlanner();
  
  const [time, setTime] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<ActivityCategory>('attraction');
  const [estimatedCost, setEstimatedCost] = useState<number>(0);

  useEffect(() => {
    if (editActivity) {
      setTime(editActivity.time);
      setTitle(editActivity.title);
      setDescription(editActivity.description || '');
      setLocation(editActivity.location || '');
      setCategory(editActivity.category);
      setEstimatedCost(editActivity.estimatedCost || 0);
    } else {
      setTime('');
      setTitle('');
      setDescription('');
      setLocation('');
      setCategory('attraction');
      setEstimatedCost(0);
    }
  }, [editActivity, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!time || !title) return;

    if (editActivity) {
      updateActivity(dayId, editActivity.id, {
        time,
        title,
        description,
        location,
        category,
        estimatedCost
      });
    } else {
      addActivity(dayId, {
        isCompleted: false,
        time,
        title,
        description,
        location,
        category,
        estimatedCost
      });
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editActivity ? 'עריכת פעילות' : 'הוספת פעילות'}>
      <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block space-y-1.5">
            <span className="flex items-center gap-1.5 text-sm text-gray-600">
              <Clock className="w-4 h-4 text-gray-400" strokeWidth={1.75} aria-hidden="true" />
              שעה
            </span>
            <input
              type="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-base text-gray-900 outline-none focus:border-blue-400 transition-colors"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="flex items-center gap-1.5 text-sm text-gray-600">
              <Type className="w-4 h-4 text-gray-400" strokeWidth={1.75} aria-hidden="true" />
              שם הפעילות
            </span>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-base text-gray-900 outline-none focus:border-blue-400 transition-colors"
            />
          </label>
        </div>

        <label className="block space-y-1.5">
          <span className="flex items-center gap-1.5 text-sm text-gray-600">
            <Tag className="w-4 h-4 text-gray-400" strokeWidth={1.75} aria-hidden="true" />
            קטגוריה
          </span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ActivityCategory)}
            className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-base text-gray-900 outline-none focus:border-blue-400 transition-colors"
          >
            {Object.entries(ACTIVITY_CATEGORY_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </label>

        <label className="block space-y-1.5">
          <span className="flex items-center gap-1.5 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-gray-400" strokeWidth={1.75} aria-hidden="true" />
            מיקום
          </span>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-base text-gray-900 outline-none focus:border-blue-400 transition-colors"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="flex items-center gap-1.5 text-sm text-gray-600">
            <Coins className="w-4 h-4 text-gray-400" strokeWidth={1.75} aria-hidden="true" />
            עלות משוערת
          </span>
          <input
            type="number"
            min="0"
            value={estimatedCost}
            onChange={(e) => setEstimatedCost(Number(e.target.value))}
            className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-base text-gray-900 outline-none focus:border-blue-400 transition-colors"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="flex items-center gap-1.5 text-sm text-gray-600">
            <FileText className="w-4 h-4 text-gray-400" strokeWidth={1.75} aria-hidden="true" />
            תיאור
          </span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-base text-gray-900 outline-none focus:border-blue-400 transition-colors resize-none"
          />
        </label>

        <div className="flex gap-3 sticky bottom-0 -mx-5 sm:-mx-6 px-5 sm:px-6 pt-3 pb-4 bg-white border-t border-gray-100">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors"
          >
            {editActivity ? 'שמור שינויים' : 'הוסף פעילות'}
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
