import React from 'react';

const AdminAuditoria = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Auditoria de Produtividade</h2>
        <p className="text-slate-500 mt-1 font-medium">Análise e validação institucional de registros.</p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">RAIs Pendentes</p><p className="text-2xl font-extrabold text-slate-900">24</p></div>
          <div className="bg-orange-50 p-2.5 rounded-lg border border-orange-100 text-orange-500"><span className="material-icons-round">pending_actions</span></div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 flex justify-between items-center border-b border-slate-100">
          <input className="w-96 border border-slate-200 rounded-lg pl-4 pr-4 py-2 text-sm" placeholder="Buscar..." />
          <div className="flex bg-slate-50 rounded-lg p-1">
            <button className="px-5 py-1.5 text-xs font-bold rounded-md bg-slate-900 text-white shadow-sm">Pendentes</button>
            <button className="px-5 py-1.5 text-xs font-bold rounded-md text-slate-500">Aprovados</button>
          </div>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-white border-b border-slate-100 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
            <tr>
              <th className="py-3 pl-6">Data Envio</th>
              <th className="py-3 px-2">Nº RAI</th>
              <th className="py-3 px-2">Natureza</th>
              <th className="py-3 px-2">Policial</th>
              <th className="py-3 pr-6 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            <tr>
              <td className="py-2.5 pl-6 text-slate-600 font-medium">Hoje, 09:45</td>
              <td className="py-2.5 px-2 font-bold text-slate-900">2024.0122.45</td>
              <td className="py-2.5 px-2"><div className="flex flex-col"><span className="font-semibold text-slate-800 text-[11px]">Tráfico</span><span className="text-[9px] text-slate-400 font-bold uppercase">TÁTICO</span></div></td>
              <td className="py-2.5 px-2">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded bg-slate-50 flex items-center justify-center font-bold text-slate-500 text-[9px] border border-slate-100">RL</div>
                  <div className="leading-tight"><p className="text-[11px] font-bold text-slate-800">CB RICARDO</p></div>
                </div>
              </td>
              <td className="py-2.5 pr-6 text-right">
                <div className="flex items-center justify-end gap-1">
                  <button className="w-6 h-6 rounded-full flex items-center justify-center text-green-500 hover:bg-green-50"><span className="material-icons-round text-lg">check_circle</span></button>
                  <button className="w-6 h-6 rounded-full flex items-center justify-center text-red-500 hover:bg-red-50"><span className="material-icons-round text-lg">cancel</span></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAuditoria;