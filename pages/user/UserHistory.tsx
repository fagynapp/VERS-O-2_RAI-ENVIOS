import React, { useState } from 'react';

const UserHistory = () => {
  const [activeFilter, setActiveFilter] = useState('TODOS');

  return (
    <div className="space-y-8">
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
              <span className="material-icons-round">description</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Meus Registros (RAIs)</h2>
            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded border border-gray-200">Total: 0</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mr-2">Filtros:</span>
          {['TODOS', 'PENDENTES', 'APROVADOS', 'REPROVADOS', 'EXPIRADOS'].map((filter) => (
            <button 
              key={filter} 
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                activeFilter === filter 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col items-center justify-center py-24 px-4 text-center">
          <span className="material-icons-round text-6xl text-gray-200 mb-4">assignment_off</span>
          <p className="text-gray-400 font-medium">Nenhum registro encontrado para "{activeFilter}".</p>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
            <span className="material-icons-round">event_available</span>
          </div>
          <h2 className="text-lg font-semibold text-gray-800">Minhas Dispensas</h2>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col items-center justify-center py-24 px-4 text-center">
          <span className="material-icons-round text-6xl text-gray-200 mb-4">event_busy</span>
          <p className="text-gray-400 font-medium">Você ainda não solicitou dispensas.</p>
        </div>
      </section>
    </div>
  );
};

export default UserHistory;