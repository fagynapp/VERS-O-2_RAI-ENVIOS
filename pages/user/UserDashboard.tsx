import React from 'react';

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
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-blue-600 rounded-xl p-8 text-white relative overflow-hidden shadow-lg">
        <div className="relative z-10">
          <h1 className="text-2xl font-bold mb-2">Olá, SD USUÁRIO 1!</h1>
          <div className="flex items-center gap-2 text-blue-100 text-sm">
            <span className="material-icons-round text-lg">schedule</span>
            <span>Seu próximo serviço está agendado em seu calendário.</span>
          </div>
        </div>
        <span className="material-icons-round absolute -right-4 -bottom-8 text-[180px] opacity-10">military_tech</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon="trending_up" label="Pontos Ativos" value="0" sub="pts" color="bg-green-500" />
        <StatCard icon="event" label="Próxima Dispensa" value="---" color="bg-blue-500" />
        <StatCard icon="priority_high" label="RAIs Pendentes" value="0" color="bg-orange-500" />
        <StatCard icon="check_circle" label="RAIs Aprovados" value="0" color="bg-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6 min-h-[300px]">
          <div className="flex items-center gap-2 mb-6">
            <span className="material-icons-round text-gray-400">bar_chart</span>
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Desempenho Recente</h2>
          </div>
          <div className="flex items-center justify-center h-48 text-gray-300 text-sm italic">
            Gráfico Indisponível
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 min-h-[300px]">
          <div className="flex items-center gap-2 mb-6">
            <span className="material-icons-round text-gray-400">schedule</span>
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Atividade Recente</h2>
          </div>
          <p className="text-sm text-gray-400 italic">Nenhuma atividade registrada.</p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;