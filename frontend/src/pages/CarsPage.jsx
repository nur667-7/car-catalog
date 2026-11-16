import React, { useState, useEffect } from 'react';
import { Plus, Filter } from 'lucide-react';
import { api } from '../api/client';
import CarCard from '../components/CarCard';
import CarModal from '../components/CarModal';
import ConfirmModal from '../components/ConfirmModal';
import EmptyState from '../components/EmptyState';
import Alert from '../components/Alert';

export default function CarsPage() {
  const [cars, setCars] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrandId, setSelectedBrandId] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [deletingCar, setDeletingCar] = useState(null);

  // Alert state
  const [alert, setAlert] = useState(null);

  const loadData = async (brandId = selectedBrandId) => {
    try {
      setLoading(true);
      const [carsData, brandsData, modelsData] = await Promise.all([
        api.getCars(brandId),
        api.getManufacturers(),
        api.getModels(),
      ]);
      setCars(carsData);
      setManufacturers(brandsData);
      setModels(modelsData);
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Ошибка загрузки данных' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(selectedBrandId);
  }, [selectedBrandId]);

  const handleOpenAdd = () => {
    setEditingCar(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (car) => {
    setEditingCar(car);
    setIsModalOpen(true);
  };

  const handleSaveCar = async (carData) => {
    if (editingCar) {
      await api.updateCar(editingCar.id, carData);
      setAlert({ type: 'success', message: 'Автомобиль успешно обновлен.' });
    } else {
      await api.createCar(carData);
      setAlert({ type: 'success', message: 'Автомобиль успешно добавлен.' });
    }
    loadData(selectedBrandId);
  };

  const handleConfirmDelete = async () => {
    if (!deletingCar) return;
    try {
      await api.deleteCar(deletingCar.id);
      setAlert({ type: 'success', message: 'Автомобиль успешно удален.' });
      setDeletingCar(null);
      loadData(selectedBrandId);
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Ошибка при удалении автомобиля' });
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
            Каталог автомобилей
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Просматривайте и управляйте автомобилями
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="self-start sm:self-auto px-4 py-2.5 bg-[#0e7a5a] hover:bg-[#0b664b] text-white text-sm font-semibold rounded-xl flex items-center gap-2 shadow-xs hover:shadow transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Добавить автомобиль
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex justify-end mb-8">
        <div className="relative inline-block w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Filter className="w-4 h-4" />
          </div>
          <select
            value={selectedBrandId}
            onChange={(e) => setSelectedBrandId(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 shadow-2xs hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0e7a5a]/20 focus:border-[#0e7a5a] transition-all cursor-pointer appearance-none"
          >
            <option value="">Все бренды</option>
            {manufacturers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Cars Grid or Empty state */}
      {loading ? (
        <div className="py-20 text-center text-gray-400 text-sm">
          Загрузка автомобилей...
        </div>
      ) : cars.length === 0 ? (
        <EmptyState onReset={() => setSelectedBrandId('')} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <CarCard
              key={car.id}
              car={car}
              onEdit={handleOpenEdit}
              onDelete={setDeletingCar}
            />
          ))}
        </div>
      )}

      {/* Car Modal */}
      <CarModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCar}
        manufacturers={manufacturers}
        models={models}
        initialData={editingCar}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingCar)}
        title="Удалить автомобиль?"
        message={`Вы действительно хотите удалить автомобиль ${deletingCar?.manufacturerName} ${deletingCar?.modelName}?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingCar(null)}
      />
    </div>
  );
}
