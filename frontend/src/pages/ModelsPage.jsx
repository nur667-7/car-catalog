import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { api } from '../api/client';
import ModelModal from '../components/ModelModal';
import ConfirmModal from '../components/ConfirmModal';
import Alert from '../components/Alert';

export default function ModelsPage() {
  const [models, setModels] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModel, setEditingModel] = useState(null);
  const [deletingModel, setDeletingModel] = useState(null);

  // Alert state
  const [alert, setAlert] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [modelsData, brandsData] = await Promise.all([
        api.getModels(),
        api.getManufacturers(),
      ]);
      setModels(modelsData);
      setManufacturers(brandsData);
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Ошибка загрузки моделей' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingModel(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (model) => {
    setEditingModel(model);
    setIsModalOpen(true);
  };

  const handleSaveModel = async (modelData) => {
    if (editingModel) {
      await api.updateModel(editingModel.id, modelData);
      setAlert({ type: 'success', message: 'Модель успешно обновлена.' });
    } else {
      await api.createModel(modelData);
      setAlert({ type: 'success', message: 'Модель успешно добавлена.' });
    }
    loadData();
  };

  const handleConfirmDelete = async () => {
    if (!deletingModel) return;
    try {
      await api.deleteModel(deletingModel.id);
      setAlert({ type: 'success', message: 'Модель успешно удалена.' });
      setDeletingModel(null);
      loadData();
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.message || 'Невозможно удалить модель, так как к ней привязаны автомобили в каталоге.',
      });
      setDeletingModel(null);
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Модели автомобилей
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Управление моделями и типами кузова
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="self-start sm:self-auto px-4 py-2.5 bg-[#0e7a5a] hover:bg-[#0b664b] text-white text-sm font-semibold rounded-xl flex items-center gap-2 shadow-xs hover:shadow transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Добавить модель
        </button>
      </div>

      {/* Models Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="py-3.5 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  НАЗВАНИЕ
                </th>
                <th className="py-3.5 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  БРЕНД
                </th>
                <th className="py-3.5 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  ТИП КУЗОВА
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
                    Загрузка моделей...
                  </td>
                </tr>
              ) : models.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-sm text-gray-400">
                    Модели не найдены
                  </td>
                </tr>
              ) : (
                models.map((model) => (
                  <tr key={model.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-4 px-6 whitespace-nowrap font-medium text-gray-900 text-sm">
                      {model.name}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-600">
                      {model.manufacturerName}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-600">
                      {model.bodyType}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-right text-sm">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(model)}
                          className="px-3.5 py-1.5 rounded-xl bg-[#ebfbf3] text-[#0d7355] hover:bg-[#daf5e7] text-xs font-medium flex items-center gap-1.5 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => setDeletingModel(model)}
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

      {/* Model Modal */}
      <ModelModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveModel}
        manufacturers={manufacturers}
        initialData={editingModel}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingModel)}
        title="Удалить модель?"
        message={`Вы действительно хотите удалить модель ${deletingModel?.name}?`}
        warningText="Если к модели привязаны автомобили, удаление будет заблокировано."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingModel(null)}
      />
    </div>
  );
}
