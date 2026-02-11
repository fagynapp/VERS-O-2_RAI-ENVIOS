import React, { useState } from 'react';

const AdminConfiguracoes = () => {
  const [vagas, setVagas] = useState(2);
  const [validade, setValidade] = useState(90);

  const handleSave = () => {
    alert("Configurações salvas com sucesso!");
  };

  return (
    <div className="space-y-6">
      {/* Título removido */}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="material-icons-round text-slate-400">tune</span>
            <h3 className="text-lg font-semibold text-slate-900">Parâmetros Globais</h3>
          </div>
          <button 
            onClick={handleSave} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span className="material-icons-round text-lg">save</span>
            Salvar Alterações
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Vagas por Dia</label>
            <input 
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all" 
              type="number" 
              value={vagas}
              onChange={(e) => setVagas(Number(e.target.value))}
            />
            <p className="text-xs text-slate-500">Número máximo de liberações.</p>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Validade Pontos (Dias)</label>
            <input 
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all" 
              type="number" 
              value={validade}
              onChange={(e) => setValidade(Number(e.target.value))}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminConfiguracoes;