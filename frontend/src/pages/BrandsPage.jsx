import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, ImageOff } from 'lucide-react';
import { api } from '../api/client';
import BrandModal from '../components/BrandModal';
import ConfirmModal from '../components/ConfirmModal';
import Alert from '../components/Alert';

export default function BrandsPage() {
  const [brands, setBrands] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [deletingBrand, setDeletingBrand] = useState(null);

  // Alert state
  const [alert, setAlert] = useState(null);

  const loadBrands = async (searchQuery = search) => {
    try {
      setLoading(true);
      const data = await api.getManufacturers(searchQuery);
      setBrands(data);
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Ошибка загрузки брендов' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadBrands(search);
    }, 200);
    return () => clearTimeout(timer);
  }, [search]);

  const handleOpenAdd = () => {
    setEditingBrand(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (brand) => {
    setEditingBrand(brand);
    setIsModalOpen(true);
  };

  const handleSaveBrand = async (brandData) => {
    if (editingBrand) {
      await api.updateManufacturer(editingBrand.id, brandData);
      setAlert({ type: 'success', message: 'Бренд успешно обновлен.' });
    } else {
      await api.createManufacturer(brandData);
      setAlert({ type: 'success', message: 'Бренд успешно добавлен.' });
    }
    loadBrands(search);
  };

  const handleConfirmDelete = async () => {
    if (!deletingBrand) return;
    try {
      await api.deleteManufacturer(deletingBrand.id);
      setAlert({ type: 'success', message: 'Бренд успешно удален.' });
      setDeletingBrand(null);
      loadBrands(search);
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.message || 'Невозможно удалить бренд, так как к нему привязаны модели автомобилей.',
      });
      setDeletingBrand(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Alert banner */}
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Автомобильные бренды
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Управление производителями автомобилей
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="self-start sm:self-auto px-4 py-2.5 bg-[#0e7a5a] hover:bg-[#0b664b] text-white text-sm font-semibold rounded-xl flex items-center gap-2 shadow-xs hover:shadow transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Добавить бренд
        </button>
      </div>

      {/* Search and stats bar */}
      <div className="mb-4">
        <div className="relative max-w-sm mb-2">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск бренда или страны..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0e7a5a]/20 focus:border-[#0e7a5a] shadow-2xs transition-all"
          />
        </div>
        <p className="text-xs text-gray-400 font-medium">
          Найдено: {brands.length}
        </p>
      </div>

      {/* Brands Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="py-3.5 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  ЛОГОТИП
                </th>
                <th className="py-3.5 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  НАЗВАНИЕ
                </th>
                <th className="py-3.5 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  СТРАНА
                </th>
                <th className="py-3.5 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">
                  ДЕЙСТВИЯ
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-sm text-gray-400">
                    Загрузка брендов...
                  </td>
                </tr>
              ) : brands.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-sm text-gray-400">
                    Бренды не найдены
                  </td>
                </tr>
              ) : (
                brands.map((brand) => (
                  <tr key={brand.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-4 px-6 whitespace-nowrap">
                      {brand.logoUrl ? (
                        <div className="w-12 h-10 flex items-center justify-center p-1 bg-white rounded-lg border border-gray-100 shadow-2xs overflow-hidden">
                          <img
                            src={brand.logoUrl}
                            alt={brand.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-10 flex items-center justify-center bg-gray-50 rounded-lg text-gray-300">
                          <ImageOff className="w-5 h-5 stroke-[1.5]" />
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap font-medium text-gray-900 text-sm">
                      {brand.name}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-600">
                      {brand.country}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-right text-sm">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(brand)}
                          className="px-3.5 py-1.5 rounded-xl bg-[#ebfbf3] text-[#0d7355] hover:bg-[#daf5e7] text-xs font-medium flex items-center gap-1.5 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => setDeletingBrand(brand)}
                          className="px-3.5 py-1.5 rounded-xl bg-[#fef2f2] text-[#dc2626] hover:bg-[#fee2e2] text-xs font-medium flex items-center gap-1.5 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Brand Modal */}
      <BrandModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveBrand}
        initialData={editingBrand}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingBrand)}
        title="Удалить бренд?"
        message={`Вы действительно хотите удалить бренд ${deletingBrand?.name}?`}
        warningText="Если к бренду привязаны модели, PostgreSQL может запретить удаление."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingBrand(null)}
      />
    </div>
  );
}
