import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Alert({ type = 'success', message, onClose }) {
  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div
      className={`rounded-xl px-4 py-3 mb-6 flex items-center justify-between text-sm shadow-sm transition-all animate-fadeIn ${
        isSuccess
          ? 'bg-[#ebfbf3] border border-[#a6f0cc] text-[#0d7355]'
          : 'bg-[#fef2f2] border border-[#fecaca] text-[#b91c1c]'
      }`}
    >
      <div className="flex items-center gap-2.5">
        {isSuccess ? (
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-[#0e7a5a]" />
        ) : (
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-[#dc2626]" />
        )}
        <span className="font-normal">{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          title="Закрыть"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
