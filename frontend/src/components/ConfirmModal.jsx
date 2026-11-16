import React from 'react';
import { Trash2, X } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  title,
  message,
  warningText,
  onConfirm,
  onCancel,
  confirmButtonText = 'Удалить',
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transition-all transform scale-100 border border-gray-100">
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-3">
          <p className="text-sm text-gray-700 leading-relaxed">{message}</p>
          {warningText && (
            <p className="text-xs text-gray-500 leading-normal bg-gray-50 p-2.5 rounded-lg border border-gray-100">
              {warningText}
            </p>
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50/60 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
          >
            Отмена
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2 text-sm font-medium text-white bg-[#dc2626] hover:bg-[#b91c1c] rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Trash2 className="w-4 h-4" />
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}
