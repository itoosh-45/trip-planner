import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
}: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-gray-900/25"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Panel */}
      <div
        className={`page-in relative w-full ${sizeClasses[size]} bg-white rounded-t-2xl sm:rounded-2xl z-[60] flex flex-col max-h-[92vh] pb-safe border border-gray-200`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 pt-4 pb-3">
          <h2 id="modal-title" className="text-xl">
            {title}
          </h2>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="p-2 -ml-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="סגור חלון"
            >
              <X className="w-5 h-5" strokeWidth={1.75} />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 px-5 sm:px-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
