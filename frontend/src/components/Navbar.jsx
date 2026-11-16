import React from 'react';

export default function Navbar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'cars', label: 'Автомобили' },
    { id: 'brands', label: 'Бренды' },
    { id: 'models', label: 'Модели' },
  ];

  return (
    <header className="bg-[#0e7a5a] text-white shadow-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-10">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('cars')}>
          <span className="text-xl font-bold tracking-tight text-white">Car Catalog</span>
        </div>

        <nav className="flex items-center gap-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  isActive
                    ? 'bg-white/20 text-white shadow-sm'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
