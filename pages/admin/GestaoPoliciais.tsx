import React, { useState } from 'react';

const AdminGestaoPoliciais = () => {
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Gestão de Policiais</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600"><span className="material-icons-round">groups</span></div>
          <div><p className="text-xs font-bold text-slate-500 uppercase">Total Efetivo</p><p className="text-2xl font-bold">1.240</p></div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center text-green-600"><span className="material-icons-round">check_circle</span></div>
          <div><p className="text-xs font-bold text-slate-500 uppercase">Ativos</p><p className="text-2xl font-bold">1.150</p></div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex gap-4">
        <input 
          className="flex-1 h-10 border border-slate-200 rounded-lg px-4 text-sm" 
          placeholder="Pesquisar policial..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => alert("Novo registro de policial")} className="bg-blue-600 text-white px-6 h-10 rounded-lg font-bold text-xs uppercase hover:bg-blue-700">Novo Registro</button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-100 text-xs text-slate-500 uppercase">
            <tr>
              <th className="px-6 py-3">Policial</th>
              <th className="px-6 py-3">Equipe</th>
              <th className="px-6 py-3">Graduação</th>
              <th className="px-6 py-3 text-center">Status</th>
              <th className="px-6 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="px-6 py-4 font-bold">1º Sgt S. Junior<br/><span className="text-xs text-slate-400 font-normal">Mat: 37123</span></td>
              <td className="px-6 py-4"><span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold uppercase text-slate-600">Alpha</span></td>
              <td className="px-6 py-4">1º Sargento</td>
              <td className="px-6 py-4 text-center"><span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">Ativo</span></td>
              <td className="px-6 py-4 text-right"><button onClick={() => alert("Editar Policial")} className="text-slate-400 hover:text-blue-600"><span className="material-icons-round">edit</span></button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminGestaoPoliciais;