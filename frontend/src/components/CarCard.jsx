import React from 'react';
import { Calendar, Palette, Car as CarIcon, Edit2, Trash2 } from 'lucide-react';

export default function CarCard({ car, onEdit, onDelete }) {
  const formattedPrice = car.price != null
    ? Number(car.price).toLocaleString('ru-RU')
    : '0';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between">
      <div>
        {/* Image & Brand Badge */}
        <div className="relative w-full h-52 bg-gray-100 overflow-hidden">
          {car.photoUrl ? (
            <img
              src={car.photoUrl}
              alt={`${car.manufacturerName} ${car.modelName}`}
              className="w-full h-full object-cover transform hover:scale-102 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
              <CarIcon className="w-12 h-12 stroke-[1.5]" />
              <span className="text-xs mt-1">Нет фото</span>
            </div>
          )}

          {/* Floating Brand Badge */}
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-gray-800 text-xs font-semibold px-3 py-1 rounded-full shadow-xs border border-gray-100">
            {car.manufacturerName}
          </div>
        </div>

        {/* Card Details */}
        <div className="p-5 space-y-3">
          {/* Header: Title + Year */}
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">
              {car.manufacturerName} {car.modelName}
            </h3>
            <span className="text-xs text-gray-400 font-medium flex items-center gap-1 flex-shrink-0">
              <Calendar className="w-3.5 h-3.5" />
              {car.year}
            </span>
          </div>

          {/* Description */}
          <p className="text-xs text-gray-500 line-clamp-2 min-h-[32px] leading-relaxed">
            {car.description || 'Описание отсутствует'}
          </p>

          {/* Chips: Color & Body Type */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 border border-gray-150 px-2.5 py-1 rounded-lg">
              <Palette className="w-3.5 h-3.5 text-gray-400" />
              Цвет: {car.color}
            </span>

            {car.bodyType && (
              <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 border border-gray-150 px-2.5 py-1 rounded-lg">
                <CarIcon className="w-3.5 h-3.5 text-gray-400" />
                {car.bodyType}
              </span>
            )}
          </div>

          {/* Price Section */}
          <div className="pt-2">
            <span className="block text-[11px] text-gray-400 font-medium">
              Стоимость
            </span>
            <div className="text-xl font-bold text-gray-900 tracking-tight">
              {formattedPrice} ₸
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-5 pb-5 pt-1 border-t border-gray-50 flex items-center justify-between gap-3">
        <button
          onClick={() => onEdit(car)}
          className="flex-1 py-2 px-3 rounded-xl bg-[#ebfbf3] text-[#0d7355] hover:bg-[#daf5e7] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <Edit2 className="w-3.5 h-3.5" />
          Edit
        </button>
        <button
          onClick={() => onDelete(car)}
          className="flex-1 py-2 px-3 rounded-xl bg-[#fef2f2] text-[#dc2626] hover:bg-[#fee2e2] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </button>
      </div>
    </div>
  );
}
