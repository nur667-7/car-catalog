import React, { useState, useEffect, useRef } from 'react';
import { X, UploadCloud, ImagePlus, Check, Trash2 } from 'lucide-react';
import { api } from '../api/client';

export default function BrandModal({ isOpen, onClose, onSave, initialData }) {
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setCountry(initialData.country || '');
      setLogoUrl(initialData.logoUrl || '');
      setPreviewUrl(initialData.logoUrl || '');
      setSelectedFile(null);
    } else {
      setName('');
      setCountry('');
      setLogoUrl('');
      setPreviewUrl('');
      setSelectedFile(null);
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Размер файла не должен превышать 5 МБ');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Введите название бренда');
      return;
    }
    if (!country.trim()) {
      setError('Введите страну производителя');
      return;
    }

    try {
      setLoading(true);
      setError('');
      let finalLogoUrl = logoUrl;

      if (selectedFile) {
        finalLogoUrl = await api.uploadFile(selectedFile, 'logos');
      }

      await onSave({
        name: name.trim(),
        country: country.trim(),
        logoUrl: finalLogoUrl,
      });

      onClose();
    } catch (err) {
      setError(err.message || 'Ошибка сохранения бренда');
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
            {isEdit ? 'Редактировать бренд' : 'Добавить бренд'}
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
                Название бренда
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Например, Toyota"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e7a5a]/20 focus:border-[#0e7a5a] transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Страна
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Например, Japan"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e7a5a]/20 focus:border-[#0e7a5a] transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Логотип бренда
              </label>
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center bg-gray-50/50 hover:bg-gray-50 transition-colors">
                {previewUrl ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-24 h-24 rounded-xl border border-gray-200 bg-white p-2 flex items-center justify-center overflow-hidden shadow-xs">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs text-[#0e7a5a] font-medium hover:underline"
                      >
                        Заменить изображение
                      </button>
                      <span className="text-gray-300">•</span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewUrl('');
                          setLogoUrl('');
                        }}
                        className="text-xs text-red-600 font-medium hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Удалить
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#0e7a5a] flex items-center justify-center mb-3">
                      <UploadCloud className="w-6 h-6 stroke-[1.8]" />
                    </div>
                    <p className="text-sm font-medium text-gray-800 mb-1">
                      Выберите изображение логотипа
                    </p>
                    <p className="text-xs text-gray-400 mb-4">
                      PNG, JPG или WEBP — до 5 МБ
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
