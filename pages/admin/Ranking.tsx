import React from 'react';

const AdminRanking = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Ranking de Resultados</h2>
      
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Líder Geral</span>
            <span className="material-icons-round text-blue-600">star</span>
          </div>
          <p className="text-lg font-extrabold text-slate-900">Sgt. Silva</p>
          <p className="text-[11px] font-bold text-green-600 mt-1">+12% no período</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Posição</th>
              <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Policial</th>
              <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Equipe</th>
              <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest text-center">RAIs Validados</th>
              <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest text-right">Pontuação Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="px-6 py-4"><div className="w-9 h-9 bg-yellow-100 rounded-lg flex items-center justify-center border border-yellow-200 text-yellow-600"><span className="material-icons-round">emoji_events</span></div></td>
              <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                Sgt. Silva
              </td>
              <td className="px-6 py-4"><span className="px-2 py-0.5 rounded-full bg-slate-100 text-[9px] font-bold uppercase border border-slate-200">Bravo 02</span></td>
              <td className="px-6 py-4 text-center font-bold">214</td>
              <td className="px-6 py-4 text-right font-black text-blue-600">2,540 pts</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminRanking;