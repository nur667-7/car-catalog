import React from 'react';
import { Car } from 'lucide-react';

export default function EmptyState({ onReset }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-12 text-center flex flex-col items-center justify-center max-w-xl mx-auto my-8">
      <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#0e7a5a] flex items-center justify-center mb-4">
        <Car className="w-8 h-8 stroke-[1.8]" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1">
        Автомобили не найдены
      </h3>
      <p className="text-sm text-gray-500 mb-6 max-w-sm">
        Для выбранного бренда пока нет автомобилей.
      </p>
      {onReset && (
        <button
          onClick={onReset}
          className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 shadow-2xs transition-all"
        >
          Показать все бренды
        </button>
      )}
    </div>
  );
}
