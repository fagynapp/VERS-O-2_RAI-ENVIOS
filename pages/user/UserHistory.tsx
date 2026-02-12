import React, { useState } from 'react';
import { usePoliceData, UserRaiRecord } from '../../contexts/PoliceContext';

const UserHistory = () => {
  const [activeFilter, setActiveFilter] = useState('TODOS');
  const { userRaiRecords } = usePoliceData();

  // Lógica de Filtragem
  const filteredRecords = userRaiRecords.filter(record => {
    if (activeFilter === 'TODOS') return true;
    return record.status === activeFilter;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'PENDENTE': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'APROVADO': return 'bg-green-50 text-green-600 border-green-100';
      case 'REPROVADO': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const parts = dateStr.split('-');
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return dateStr;
  };

  const formatDateTime = (isoStr: string) => {
    const date = new Date(isoStr);
    return date.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
              <span className="material-icons-round">description</span>
            </div>
            <div>
               <h2 className="text-lg font-bold text-gray-800">Meus Registros (RAIs)</h2>
               <p className="text-xs text-gray-400">Histórico completo de produtividade enviada</p>
            </div>
            <span className="ml-2 px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded border border-blue-100 uppercase tracking-wider">
               Total: {userRaiRecords.length}
            </span>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">Filtros:</span>
          {['TODOS', 'PENDENTE', 'APROVADO', 'REPROVADO'].map((filter) => (
            <button 
              key={filter} 
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold tracking-wide transition-all border ${
                activeFilter === filter 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100' 
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
              }`}
            >
              {filter === 'PENDENTE' ? 'EM ANÁLISE' : filter}
            </button>
          ))}
        </div>

        {/* Lista de Registros */}
        {filteredRecords.length > 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100 text-[10px] text-gray-400 font-black uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Nº RAI</th>
                            <th className="px-6 py-4">Natureza / Ocorrência</th>
                            <th className="px-6 py-4 text-center">Data Ocorrência</th>
                            <th className="px-6 py-4 text-center">Pontuação</th>
                            <th className="px-6 py-4 text-center">Status</th>
                            <th className="px-6 py-4 text-right">Data Registro</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredRecords.map((record) => (
                            <tr key={record.id} className="hover:bg-blue-50/30 transition-colors group">
                                <td className="px-6 py-4 font-black text-gray-700 font-mono tracking-tighter">
                                    {record.raiNumber}
                                </td>
                                <td className="px-6 py-4">
                                    <p className="font-bold text-gray-800 text-xs uppercase">{record.natureza}</p>
                                    <p className="text-[9px] text-gray-400 font-medium">BPM Terminal / GO</p>
                                </td>
                                <td className="px-6 py-4 text-center text-xs font-semibold text-gray-500">
                                    {formatDate(record.dataOcorrencia)}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="bg-blue-50 text-blue-700 font-black px-2 py-1 rounded text-[11px] border border-blue-100">
                                        +{record.pontos} <span className="text-[9px] opacity-70">PTS</span>
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase border ${getStatusStyle(record.status)}`}>
                                        {record.status === 'PENDENTE' ? 'Análise' : record.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right text-[10px] text-gray-400 font-medium">
                                    {formatDateTime(record.dataRegistro)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Resumo Rodapé */}
            <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-between items-center px-6">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Resumo desta visualização</span>
                <div className="flex gap-4">
                    <div className="text-right">
                        <p className="text-[9px] font-bold text-gray-400 uppercase">Registros</p>
                        <p className="text-sm font-black text-gray-700">{filteredRecords.length}</p>
                    </div>
                    <div className="text-right border-l border-gray-200 pl-4">
                        <p className="text-[9px] font-bold text-gray-400 uppercase">Total Pontos</p>
                        <p className="text-sm font-black text-blue-600">{filteredRecords.reduce((acc, cur) => acc + cur.pontos, 0)}</p>
                    </div>
                </div>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col items-center justify-center py-24 px-4 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
               <span className="material-icons-round text-4xl text-gray-200">assignment_off</span>
            </div>
            <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">Nenhum registro encontrado</p>
            <p className="text-gray-400 text-sm mt-1">
                {activeFilter === 'TODOS' 
                    ? 'Você ainda não enviou nenhum RAI.' 
                    : `Não há registros com status "${activeFilter}".`}
            </p>
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
            <span className="material-icons-round">event_available</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">Minhas Dispensas</h2>
            <p className="text-xs text-gray-400">Solicitações de folga por produtividade</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col items-center justify-center py-24 px-4 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <span className="material-icons-round text-4xl text-gray-200">event_busy</span>
          </div>
          <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">Nenhuma solicitação</p>
          <p className="text-gray-400 text-sm mt-1">Suas solicitações de dispensa aparecerão aqui.</p>
        </div>
      </section>
    </div>
  );
};

export default UserHistory;