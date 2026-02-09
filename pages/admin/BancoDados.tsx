import React from 'react';

const AdminBancoDados = () => {
  const handleImport = () => {
    alert("Selecione um arquivo .CSV ou .XLSX para importar");
  };

  const handleMoreOptions = () => {
    alert("Opções do registro: Editar / Excluir");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Banco de Dados</h2>
          <p className="text-sm text-slate-500 mt-1">Gerencie dados de ocorrências e importações.</p>
        </div>
        <button onClick={handleImport} className="bg-blue-800 text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-900">
          <span className="material-icons-round">upload_file</span> Importar Arquivo
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-bold text-slate-500 text-[11px] uppercase tracking-wider">Envio</th>
              <th className="px-6 py-4 font-bold text-slate-500 text-[11px] uppercase tracking-wider">Nº RAI</th>
              <th className="px-6 py-4 font-bold text-slate-500 text-[11px] uppercase tracking-wider">Natureza</th>
              <th className="px-6 py-4 font-bold text-slate-500 text-[11px] uppercase tracking-wider">Policial</th>
              <th className="px-6 py-4 font-bold text-slate-500 text-[11px] uppercase tracking-wider text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="px-6 py-4 font-medium text-slate-900">15/05/2023</td>
              <td className="px-6 py-4 font-bold">10203040</td>
              <td className="px-6 py-4 text-slate-600">Prisão em flagrante</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-[10px]">MS</div>
                  <span className="font-semibold text-slate-800">SGT Marcos Silva</span>
                </div>
              </td>
              <td className="px-6 py-4 text-right text-slate-400"><button onClick={handleMoreOptions} className="material-icons-round cursor-pointer">more_vert</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBancoDados;