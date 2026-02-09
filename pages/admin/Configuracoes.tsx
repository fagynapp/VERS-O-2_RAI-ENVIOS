import React, { useState } from 'react';

const AdminConfiguracoes = () => {
  const [vagas, setVagas] = useState(2);
  const [validade, setValidade] = useState(90);

  const handleSave = () => {
    alert("Configurações salvas com sucesso!");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span className="material-icons-round text-blue-600">settings_suggest</span>
            Configurações de Sistema
          </h2>
          <p className="text-sm text-slate-500 mt-1">Gerencie parâmetros globais e segurança.</p>
        </div>
        <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-blue-700">Salvar Alterações</button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
          <span className="material-icons-round text-slate-400">tune</span>
          <h3 className="text-lg font-semibold text-slate-900">Parâmetros Globais</h3>
        </div>
        <div className="grid grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Vagas por Dia</label>
            <input 
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" 
              type="number" 
              value={vagas}
              onChange={(e) => setVagas(Number(e.target.value))}
            />
            <p className="text-xs text-slate-500">Número máximo de liberações.</p>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Validade Pontos (Dias)</label>
            <input 
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" 
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