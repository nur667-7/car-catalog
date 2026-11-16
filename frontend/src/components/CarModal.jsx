import React, { useState, useEffect, useRef } from 'react';
import { X, ImagePlus, Check, Trash2 } from 'lucide-react';
import { api } from '../api/client';

export default function CarModal({
  isOpen,
  onClose,
  onSave,
  manufacturers = [],
  models = [],
  initialData,
}) {
  const [selectedBrandId, setSelectedBrandId] = useState('');
  const [modelId, setModelId] = useState('');
  const [year, setYear] = useState('');
  const [price, setPrice] = useState('');
  const [color, setColor] = useState('');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Filter models by selected brand
  const filteredModels = models.filter(
    (m) => String(m.manufacturerId) === String(selectedBrandId)
  );

  useEffect(() => {
    if (initialData) {
      setSelectedBrandId(initialData.manufacturerId || '');
      setModelId(initialData.modelId || '');
      setYear(initialData.year || '');
      setPrice(initialData.price || '');
      setColor(initialData.color || '');
      setDescription(initialData.description || '');
      setPhotoUrl(initialData.photoUrl || '');
      setPreviewUrl(initialData.photoUrl || '');
      setSelectedFile(null);
    } else {
      const defaultBrandId = manufacturers[0]?.id || '';
      setSelectedBrandId(defaultBrandId);
      const defaultModel = models.find((m) => String(m.manufacturerId) === String(defaultBrandId));
      setModelId(defaultModel ? defaultModel.id : '');
      setYear(new Date().getFullYear());
      setPrice('');
      setColor('');
      setDescription('');
      setPhotoUrl('');
      setPreviewUrl('');
      setSelectedFile(null);
    }
    setError('');
  }, [initialData, isOpen, manufacturers, models]);

  // When brand changes, update model selection if current model is not in that brand
  const handleBrandChange = (brandId) => {
    setSelectedBrandId(brandId);
    const validModels = models.filter((m) => String(m.manufacturerId) === String(brandId));
    if (validModels.length > 0) {
      setModelId(validModels[0].id);
    } else {
      setModelId('');
    }
  };

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Размер фотографии не должен превышать 5 МБ');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!modelId) {
      setError('Выберите модель автомобиля');
      return;
    }
    if (!year || year < 1900 || year > 2100) {
      setError('Укажите корректный год выпуска');
      return;
    }
    if (!price || Number(price) <= 0) {
      setError('Укажите корректную стоимость');
      return;
    }
    if (!color.trim()) {
      setError('Укажите цвет автомобиля');
      return;
    }

    try {
      setLoading(true);
      setError('');
      let finalPhotoUrl = photoUrl;

      if (selectedFile) {
        finalPhotoUrl = await api.uploadFile(selectedFile, 'cars');
      }

      await onSave({
        modelId: Number(modelId),
        year: Number(year),
        price: Number(price),
        color: color.trim(),
        description: description.trim(),
        photoUrl: finalPhotoUrl,
      });

      onClose();
    } catch (err) {
      setError(err.message || 'Ошибка сохранения автомобиля');
    } finally {
      setLoading(false);
    }
  };

  const isEdit = Boolean(initialData?.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-gray-100 my-8">
        <div className="flex items-start justify-between px-6 pt-5 pb-3 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {isEdit ? 'Редактировать автомобиль' : 'Добавить автомобиль'}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Заполните информацию об автомобиле
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-4 max-h-[75vh] overflow-y-auto">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Бренд
                </label>
                <select
                  value={selectedBrandId}
                  onChange={(e) => handleBrandChange(e.target.value)}
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
                  Модель
                </label>
                <select
                  value={modelId}
                  onChange={(e) => setModelId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e7a5a]/20 focus:border-[#0e7a5a] bg-white transition-all"
                  required
                  disabled={filteredModels.length === 0}
                >
                  <option value="" disabled>
                    {filteredModels.length === 0 ? 'Нет доступных моделей' : 'Выберите модель'}
                  </option>
                  {filteredModels.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Год выпуска
                </label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="2025"
                  min="1900"
                  max="2100"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e7a5a]/20 focus:border-[#0e7a5a] transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Цена (₸)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="15000000"
                  min="0"
                  step="1000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e7a5a]/20 focus:border-[#0e7a5a] transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Цвет автомобиля
              </label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="Например, Black"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e7a5a]/20 focus:border-[#0e7a5a] transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Описание
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Например, Kia K5 2025 Sedan"
                rows={2}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e7a5a]/20 focus:border-[#0e7a5a] transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Фотография автомобиля
              </label>
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-5 text-center bg-gray-50/50 hover:bg-gray-50 transition-colors">
                {previewUrl ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-full h-44 rounded-xl border border-gray-200 bg-white overflow-hidden shadow-xs">
                      <img
                        src={previewUrl}
                        alt="Car Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs text-[#0e7a5a] font-medium hover:underline"
                      >
                        Заменить фото
                      </button>
                      <span className="text-gray-300">•</span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewUrl('');
                          setPhotoUrl('');
                        }}
                        className="text-xs text-red-600 font-medium hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Удалить
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#0e7a5a] flex items-center justify-center mb-2">
                      <ImagePlus className="w-6 h-6 stroke-[1.8]" />
                    </div>
                    <p className="text-sm font-medium text-gray-800 mb-0.5">
                      Загрузите фотографию автомобиля
                    </p>
                    <p className="text-xs text-gray-400 mb-3">
                      JPG, PNG или WEBP — до 5 МБ
                    </p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-[#0e7a5a] hover:bg-[#0b664b] text-white text-xs font-medium rounded-xl flex items-center gap-2 transition-all shadow-sm"
                    >
                      <ImagePlus className="w-4 h-4" />
                      Выбрать фото
                    </button>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
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
