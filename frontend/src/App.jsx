import React, { useState } from 'react';
import Navbar from './components/Navbar';
import CarsPage from './pages/CarsPage';
import BrandsPage from './pages/BrandsPage';
import ModelsPage from './pages/ModelsPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('cars');

  return (
    <div className="min-h-screen bg-[#f4f5f9] flex flex-col text-gray-900">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 pb-16">
        {activeTab === 'cars' && <CarsPage />}
        {activeTab === 'brands' && <BrandsPage />}
        {activeTab === 'models' && <ModelsPage />}
      </main>
    </div>
  );
}
