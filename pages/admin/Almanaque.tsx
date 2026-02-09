import React, { useState } from 'react';

const AdminAlmanaque = () => {
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Almanaque de Antiguidade</h2>
        <p className="text-sm text-slate-500 mt-1">Lista completa do efetivo em ordem de precedência.</p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
          <div><p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Total Efetivo</p><span className="text-3xl font-bold">1.240</span></div>
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600"><span className="material-icons-round">groups</span></div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
          <div><p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Oficiais</p><span className="text-3xl font-bold">150</span></div>
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600"><span className="material-icons-round">shield</span></div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex gap-4">
          <input 
            className="flex-1 h-10 border border-slate-200 rounded-lg px-4 text-sm" 
            placeholder="Pesquisar policial..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="bg-blue-600 text-white px-6 h-10 rounded-lg font-bold text-xs uppercase">Filtrar</button>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-white border-b border-slate-100">
            <tr>
              <th className="px-6 py-3 text-[11px] font-black uppercase border-r border-slate-100 text-center text-blue-600">Posição Geral</th>
              <th className="px-6 py-3 text-[11px] font-black uppercase border-r border-slate-100 text-center">Pelotão</th>
              <th className="px-6 py-3 text-[11px] font-black uppercase border-r border-slate-100">Policial</th>
              <th className="px-6 py-3 text-[11px] font-black uppercase border-r border-slate-100 text-center">Matrícula</th>
              <th className="px-6 py-3 text-[11px] font-black uppercase text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="px-6 py-3 font-bold text-blue-600 text-center">1º Lugar</td>
              <td className="px-6 py-3 text-center">ALPHA</td>
              <td className="px-6 py-3 font-bold uppercase">Sub Ten Marcelo Ramos</td>
              <td className="px-6 py-3 text-center font-mono text-xs">88234</td>
              <td className="px-6 py-3 text-center"><span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-black uppercase">Ativo</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAlmanaque;