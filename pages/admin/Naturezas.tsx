import React, { useState } from 'react';

const AdminNatureza = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Registrar Natureza</h2>
      
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase">Total Cadastrado</p>
          <h3 className="text-2xl font-bold mt-1">42</h3>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex justify-between">
        <input 
          className="w-96 bg-slate-50 border-none rounded-lg px-4 py-2 text-sm" 
          placeholder="Pesquisar natureza..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={() => alert("Funcionalidade de Nova Natureza em desenvolvimento.")} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">Nova Natureza</button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase">
            <tr>
              <th className="px-6 py-4">Natureza</th>
              <th className="px-6 py-4 text-center">Pontos</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="px-6 py-4">
                <div className="font-medium text-slate-900">Prisão em flagrante – homicídio</div>
                <div className="text-xs text-slate-400">Crime Hediondo</div>
              </td>
              <td className="px-6 py-4 text-center"><span className="bg-blue-50 text-blue-700 font-bold px-3 py-1 rounded border border-blue-100">50</span></td>
              <td className="px-6 py-4 text-center"><span className="w-10 h-5 bg-green-500 rounded-full inline-block relative"><span className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5"></span></span></td>
              <td className="px-6 py-4 text-right text-slate-400"><button onClick={() => alert("Editar natureza")} className="material-icons-round">edit</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminNatureza;