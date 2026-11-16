import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

const BODY_TYPES = [
  'Sedan',
  'SUV',
  'Hatchback',
  'Coupe',
  'Wagon',
  'Pickup',
];

export default function ModelModal({
  isOpen,
  onClose,
  onSave,
  manufacturers = [],
  initialData,
}) {
  const [manufacturerId, setManufacturerId] = useState('');
  const [name, setName] = useState('');
  const [bodyType, setBodyType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setManufacturerId(initialData.manufacturerId || '');
      setName(initialData.name || '');
      setBodyType(initialData.bodyType || '');
    } else {
      setManufacturerId(manufacturers[0]?.id || '');
      setName('');
      setBodyType('');
    }
    setError('');
  }, [initialData, isOpen, manufacturers]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!manufacturerId) {
      setError('Выберите бренд');
      return;
    }
    if (!name.trim()) {
      setError('Введите название модели');
      return;
    }
    if (!bodyType) {
      setError('Выберите тип кузова');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await onSave({
        manufacturerId: Number(manufacturerId),
        name: name.trim(),
        bodyType,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Ошибка сохранения модели');
    } finally {
      setLoading(false);
    }
  };

  const isEdit = Boolean(initialData?.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100">
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">
            {isEdit ? 'Редактировать модель' : 'Добавить модель'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Бренд
              </label>
              <select
                value={manufacturerId}
                onChange={(e) => setManufacturerId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e7a5a]/20 focus:border-[#0e7a5a] bg-white transition-all"
                required
              >
                <option value="" disabled>
                  Выберите бренд
                </option>
                {manufacturers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Название модели
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Например, Camry"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e7a5a]/20 focus:border-[#0e7a5a] transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Тип кузова
              </label>
              <select
                value={bodyType}
                onChange={(e) => setBodyType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e7a5a]/20 focus:border-[#0e7a5a] bg-white transition-all"
                required
              >
                <option value="" disabled>
                  Выберите тип кузова
                </option>
                {BODY_TYPES.map((bt) => (
                  <option key={bt} value={bt}>
                    {bt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50/60 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm font-medium text-white bg-[#0e7a5a] hover:bg-[#0b664b] disabled:opacity-50 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              {loading ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
