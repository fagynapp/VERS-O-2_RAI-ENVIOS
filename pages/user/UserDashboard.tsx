import React from 'react';
import { usePoliceData } from '../../contexts/PoliceContext';

const StatCard = ({ icon, label, value, sub, color }: any) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
        <span className="material-icons-round text-xl text-white">{icon}</span>
      </div>
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
    </div>
    <div>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
      {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    </div>
  </div>
);

const UserDashboard = () => {
  const { userPoints, userRaiRecords } = usePoliceData();

  // Cálculos de resumo
  const pendingCount = userRaiRecords.filter(r => r.status === 'PENDENTE').length;
  const approvedCount = userRaiRecords.filter(r => r.status === 'APROVADO').length;
  
  // Pegar as 3 atividades mais recentes
  const recentActivities = userRaiRecords.slice(0, 3);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const parts = dateStr.split('-');
    if (parts.length === 3) return `${parts[2]}/${parts[1]}`;
    return dateStr;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-blue-600 rounded-xl p-8 text-white relative overflow-hidden shadow-lg">
        <div className="relative z-10">
          <h1 className="text-2xl font-bold mb-2">Olá, Policial!</h1>
          <div className="flex items-center gap-2 text-blue-100 text-sm">
            <span className="material-icons-round text-lg">schedule</span>
            <span>Acompanhe aqui o resumo da sua produtividade e saldo de pontos.</span>
          </div>
        </div>
        <span className="material-icons-round absolute -right-4 -bottom-8 text-[180px] opacity-10">military_tech</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon="trending_up" 
          label="Pontos Ativos" 
          value={userPoints} 
          sub="pts acumulados" 
          color="bg-green-500" 
        />
        <StatCard 
          icon="event" 
          label="Próxima Dispensa" 
          value="---" 
          color="bg-blue-500" 
        />
        <StatCard 
          icon="priority_high" 
          label="RAIs Pendentes" 
          value={pendingCount} 
          color="bg-orange-500" 
        />
        <StatCard 
          icon="check_circle" 
          label="RAIs Aprovados" 
          value={approvedCount} 
          color="bg-purple-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6 min-h-[300px]">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
            <span className="material-icons-round text-blue-600">bar_chart</span>
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Informativo de Produtividade</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-4">
                <p className="text-xs text-gray-500 leading-relaxed">
                  Os pontos são computados automaticamente após o registro do RAI. Lembre-se que registros com mais de 90 dias precisam de validação administrativa.
                </p>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                   <p className="text-[10px] font-bold text-blue-600 uppercase mb-1">Dica de Pontuação</p>
                   <p className="text-xs text-blue-800">Naturezas como "Apreensão de Arma" e "Prisão em Flagrante" garantem as maiores pontuações do ciclo.</p>
                </div>
             </div>
             <div className="flex items-center justify-center border-l border-gray-50 pl-4">
                <div className="text-center">
                   <div className="w-24 h-24 rounded-full border-8 border-green-500 border-t-transparent flex items-center justify-center mx-auto mb-2 rotate-45">
                      <span className="text-xl font-black text-gray-800 -rotate-45">{Math.min(100, Math.round((userPoints/200)*100))}%</span>
                   </div>
                   <p className="text-[10px] font-bold text-gray-400 uppercase">Meta para Dispensa</p>
                </div>
             </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 min-h-[300px]">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
            <span className="material-icons-round text-orange-500">schedule</span>
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Atividade Recente</h2>
          </div>
          
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((rai) => (
                <div key={rai.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-white flex items-center justify-center border border-gray-200 shadow-sm">
                       <span className="material-icons-round text-blue-600 text-sm">description</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-800 uppercase">RAI {rai.raiNumber}</p>
                      <p className="text-[9px] text-gray-400">{formatDate(rai.dataOcorrencia)} • {rai.natureza}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black text-green-600">+{rai.pontos} PTS</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <span className="material-icons-round text-gray-200 text-4xl mb-2">history</span>
                <p className="text-sm text-gray-400 italic">Nenhuma atividade registrada.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;