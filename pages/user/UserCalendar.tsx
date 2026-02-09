import React from 'react';

const UserCalendar = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">JANEIRO DE 2026</h2>
          <div className="flex gap-2">
            <button onClick={() => alert("Mês Anterior")} className="p-1 hover:bg-gray-100 rounded text-gray-500"><span className="material-icons-round">chevron_left</span></button>
            <button onClick={() => alert("Próximo Mês")} className="p-1 hover:bg-gray-100 rounded text-gray-500"><span className="material-icons-round">chevron_right</span></button>
          </div>
        </div>
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map(day => (
            <div key={day} className="py-2 text-center text-[10px] font-bold text-gray-400 uppercase">{day}</div>
          ))}
        </div>
        <div className="flex-1 grid grid-cols-7 bg-white">
          {/* Mock days */}
          {[...Array(31)].map((_, i) => {
            const day = i + 1;
            const isTarget = day === 2; // Friday 2nd
            return (
              <div key={day} className={`border-b border-r border-gray-100 p-1 relative h-24 lg:h-auto hover:bg-gray-50 transition-colors cursor-pointer ${isTarget ? 'bg-green-50 ring-2 ring-inset ring-blue-500' : ''}`}>
                <span className="text-xs font-semibold text-gray-700 ml-1">{day}</span>
                {isTarget && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[9px] font-bold text-green-700 uppercase text-center bg-green-100 px-1 py-0.5 rounded">Disponível</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-full lg:w-80 shrink-0 flex flex-col gap-4">
        <div className="bg-blue-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <span className="material-icons-round text-xl">loyalty</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wide opacity-80">Investimento</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold">140</span>
              <span className="text-xs uppercase font-medium opacity-80">Pontos</span>
            </div>
          </div>
          <span className="material-icons-round absolute -right-2 -bottom-2 text-[100px] opacity-10">workspace_premium</span>
        </div>

        <button onClick={() => alert("Solicitação de dispensa enviada!")} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors">
          <span className="material-icons-round">send</span>
          Solicitar Dispensa (Prod.)
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex-1">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4 border-b border-gray-100 pb-2">Detalhes da Escala</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-gray-500 uppercase">Equipe</span>
              <span className="text-sm font-bold text-blue-600">ALPHA</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-gray-500 uppercase">Status</span>
              <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">ATIVO</span>
            </div>
            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 italic text-center">Nenhum agendamento para este dia.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCalendar;