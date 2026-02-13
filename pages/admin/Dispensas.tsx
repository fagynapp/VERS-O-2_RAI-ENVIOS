import React, { useState } from 'react';
import { usePoliceData } from '../../contexts/PoliceContext';

// --- Interfaces Mock ---
interface DispensaRegistro {
  id: number;
  policial: string;
  matricula: string;
  natureza: string;
  status: 'Processado' | 'Liberado' | 'Bloqueado' | 'Aguardando';
  data: string;
}

const MOCK_REGISTROS: DispensaRegistro[] = [
  { id: 1, policial: 'Sub-Ten. Marcelo Rocha', matricula: '33000', natureza: 'CPC', status: 'Processado', data: '2024-01-24' },
  { id: 2, policial: '1º Sgt. Oliveira Santos', matricula: '35137', natureza: 'PROD', status: 'Liberado', data: '2024-01-24' },
  { id: 3, policial: 'Cb. Silva', matricula: '37123', natureza: 'CPC', status: 'Aguardando', data: '2024-01-25' },
  { id: 4, policial: 'Sd. Ferreira', matricula: '39900', natureza: 'Banco de Horas', status: 'Bloqueado', data: '2024-01-25' },
];

const AdminDispensas = () => {
  const { setCpcQueue } = usePoliceData(); // Usando o Contexto
  const [activeTab, setActiveTab] = useState<'GERAL' | 'FILA' | 'CONFIG'>('GERAL');
  const [search, setSearch] = useState('');

  // Estados da Fila CPC
  const [equipeFila, setEquipeFila] = useState('ALPHA');
  const [criterioFila, setCriterioFila] = useState('ALMANAQUE');
  const [prazoFila, setPrazoFila] = useState(24); // Novo estado para o Prazo em horas

  // Estados de Configuração
  const [limiteCPC, setLimiteCPC] = useState(1);
  const [limiteProd, setLimiteProd] = useState(1);
  const [excecaoForm, setExcecaoForm] = useState({ busca: '', mes: '', limite: '' });

  // Estatísticas (Mock)
  const stats = {
    cpcFila: 14,
    prodAgendadas: 42,
    bloqueios: 1,
    totalProcessado: 156
  };

  // Filtragem (Apenas visual para o exemplo)
  const filteredList = MOCK_REGISTROS.filter(item => 
    item.policial.toLowerCase().includes(search.toLowerCase()) || 
    item.matricula.includes(search)
  );

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Processado': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'Liberado': return 'text-green-600 bg-green-50 border-green-100';
      case 'Bloqueado': return 'text-red-600 bg-red-50 border-red-100';
      default: return 'text-slate-500 bg-slate-100 border-slate-200';
    }
  };

  const handleIniciarFila = () => {
      const confirmMessage = `CONFIRMAR ABERTURA DE FILA?\n\nEquipe: ${equipeFila}\nCritério: ${criterioFila}\nPrazo para Escolha: ${prazoFila} Horas\n\nO próximo policial da fila será notificado no Dashboard e terá até ${prazoFila}h para selecionar a data.`;
      
      if(window.confirm(confirmMessage)) {
          // Simula a criação de uma fila com 3 pessoas, incluindo o usuário mockado (SD Lucas Miguel) para teste
          const novaFila = [
              { posicao: 1, nome: 'SUB-TEN MARCELO ROCHA', matricula: '33000', status: 'VEZ DE ESCOLHER', expiraEm: `${prazoFila}h` },
              { posicao: 2, nome: 'SD LUCAS MIGUEL', matricula: '39874', status: 'AGUARDANDO' }, // Usuário do Dashboard
              { posicao: 3, nome: 'CB PASSOS', matricula: '38183', status: 'AGUARDANDO' }
          ];
          
          // Atualiza o contexto global
          // @ts-ignore
          setCpcQueue(novaFila);
          
          alert(`Fila iniciada! 3 Policiais notificados no painel.`);
      }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. DASHBOARD DE RESUMO */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <span className="material-icons-round">groups</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">CPC em Fila</p>
            <p className="text-2xl font-black text-slate-800">{stats.cpcFila}</p>
            <p className="text-[10px] text-blue-500 font-bold mt-0.5">Aguardando</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
            <span className="material-icons-round">event_available</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Prod. Agendadas</p>
            <p className="text-2xl font-black text-slate-800">{stats.prodAgendadas}</p>
            <p className="text-[10px] text-green-500 font-bold mt-0.5">+12% este mês</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
            <span className="material-icons-round">lock</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Bloqueios</p>
            <p className="text-2xl font-black text-slate-800">{stats.bloqueios}</p>
            <p className="text-[10px] text-red-500 font-bold mt-0.5">Regime Especial</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
            <span className="material-icons-round">done_all</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Total Processado</p>
            <p className="text-2xl font-black text-slate-800">{stats.totalProcessado}</p>
            <p className="text-[10px] text-indigo-500 font-bold mt-0.5">Ciclo Atual</p>
          </div>
        </div>
      </div>

      {/* 2. BARRA DE FERRAMENTAS E ABAS */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col md:flex-row gap-4 items-center justify-between z-20 relative">
        {/* Busca */}
        <div className="relative w-full md:w-80">
          <span className="material-icons-round absolute left-3 top-2.5 text-slate-400">search</span>
          <input 
            className="w-full h-10 bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-10 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder-slate-400" 
            placeholder="Buscar Policial ou Matrícula..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button 
              onClick={() => setSearch('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <span className="material-icons-round text-lg">close</span>
            </button>
          )}
        </div>

        {/* Seletor de Abas */}
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('GERAL')}
            className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase transition-all flex items-center gap-2 ${activeTab === 'GERAL' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-blue-600'}`}
          >
            <span className="material-icons-round text-sm">dashboard</span>
            Visão Geral
          </button>
          <button 
            onClick={() => setActiveTab('FILA')}
            className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase transition-all flex items-center gap-2 ${activeTab === 'FILA' ? 'bg-orange-600 text-white shadow-sm' : 'text-slate-500 hover:text-orange-600'}`}
          >
            <span className="material-icons-round text-sm">queue_music</span>
            Fila CPC
          </button>
          <button 
            onClick={() => setActiveTab('CONFIG')}
            className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase transition-all flex items-center gap-2 ${activeTab === 'CONFIG' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <span className="material-icons-round text-sm">settings</span>
            Configurações
          </button>
        </div>
      </div>

      {/* 3. CONTEÚDO */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
        
        {/* ABA: VISÃO GERAL */}
        {activeTab === 'GERAL' && (
           <div className="p-0">
             <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider">Últimos Registros e Solicitações</h3>
             </div>
             {filteredList.length > 0 ? (
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 border-b border-slate-100 text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                    <tr>
                      <th className="px-6 py-3">Policial</th>
                      <th className="px-6 py-3 text-center">Matrícula</th>
                      <th className="px-6 py-3 text-center">Natureza</th>
                      <th className="px-6 py-3 text-center">Data</th>
                      <th className="px-6 py-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredList.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-800 uppercase">{item.policial}</td>
                        <td className="px-6 py-4 text-center font-mono text-slate-500 text-xs">{item.matricula}</td>
                        <td className="px-6 py-4 text-center">
                            <span className="bg-slate-100 text-slate-600 font-bold px-2 py-1 rounded text-[10px] border border-slate-200">{item.natureza}</span>
                        </td>
                        <td className="px-6 py-4 text-center text-slate-500 text-xs">{item.data}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             ) : (
                <div className="p-12 flex flex-col items-center justify-center text-center">
                   <span className="material-icons-round text-slate-300 text-5xl mb-3">search_off</span>
                   <p className="text-slate-500 font-medium">Nenhum registro encontrado.</p>
                </div>
             )}
           </div>
        )}

        {/* ABA: FILA CPC */}
        {activeTab === 'FILA' && (
            <div className="p-6 space-y-6">
                {/* Controles da Fila (LAYOUT ATUALIZADO: EQUIPE | CRITÉRIO | PRAZO | BOTÃO) */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-wrap items-end gap-4">
                    
                    {/* 1. Equipe */}
                    <div className="flex flex-col gap-1 w-full md:w-auto">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Equipe</label>
                        <select 
                            className="text-sm font-bold text-slate-700 border border-slate-200 rounded-lg bg-white h-[38px] pl-3 pr-8 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={equipeFila}
                            onChange={(e) => setEquipeFila(e.target.value)}
                        >
                            <option value="TODAS">TODAS AS EQUIPES</option>
                            <option value="ALPHA">EQUIPE: ALPHA</option>
                            <option value="BRAVO">EQUIPE: BRAVO</option>
                            <option value="CHARLIE">EQUIPE: CHARLIE</option>
                            <option value="DELTA">EQUIPE: DELTA</option>
                        </select>
                    </div>

                    {/* 2. Critério */}
                    <div className="flex flex-col gap-1 w-full md:w-auto">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Critério</label>
                        <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 h-[38px]">
                            <button 
                                onClick={() => setCriterioFila('PRODUTIVIDADE')}
                                className={`px-3 h-full flex items-center rounded text-[10px] font-bold uppercase transition-colors ${criterioFila === 'PRODUTIVIDADE' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                            >
                                Produtividade
                            </button>
                            <button 
                                onClick={() => setCriterioFila('ALMANAQUE')}
                                className={`px-3 h-full flex items-center rounded text-[10px] font-bold uppercase transition-colors ${criterioFila === 'ALMANAQUE' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                            >
                                Almanaque
                            </button>
                        </div>
                    </div>

                    {/* 3. Prazo (NOVO) */}
                    <div className="flex flex-col gap-1 w-full md:w-auto">
                        <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                            Prazo <span className="text-[9px] text-slate-300 font-normal">(Horas)</span>
                        </label>
                        <div className="relative">
                            <select
                                value={prazoFila}
                                onChange={(e) => setPrazoFila(Number(e.target.value))}
                                className="h-[38px] w-full md:w-32 bg-white border border-slate-200 rounded-lg pl-3 pr-8 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                            >
                                <option value={8}>08 Horas</option>
                                <option value={12}>12 Horas</option>
                                <option value={24}>24 Horas</option>
                                <option value={48}>48 Horas</option>
                            </select>
                            <span className="material-icons-round absolute right-2 top-2 text-slate-400 pointer-events-none text-base">schedule</span>
                        </div>
                    </div>

                    {/* 4. Botão Iniciar */}
                    <div className="ml-auto w-full md:w-auto">
                        <button 
                            onClick={handleIniciarFila} 
                            className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white h-[38px] px-6 rounded-lg text-xs font-bold uppercase flex items-center justify-center gap-2 shadow-lg shadow-green-200 transition-all active:scale-95"
                        >
                            <span className="material-icons-round text-lg">play_arrow</span> 
                            Iniciar Fila
                        </button>
                    </div>
                </div>

                {/* Card de Destaque (Próximo) */}
                <div className="bg-white border-2 border-blue-600 rounded-2xl p-6 shadow-xl flex items-center justify-between relative overflow-hidden group">
                    <div className="absolute top-0 left-0 h-full w-2 bg-blue-600"></div>
                    <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-blue-50 to-transparent opacity-50"></div>
                    <div className="flex items-center gap-6 z-10">
                        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border-4 border-white shadow-sm">
                            <span className="material-icons-round text-5xl">person</span>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase shadow-sm">Liberado Agora</span>
                                <span className="text-slate-400 text-xs font-bold bg-slate-100 px-2 py-0.5 rounded">MAT: 33120</span>
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Sub-Ten. Marcelo Rocha</h3>
                            <p className="text-slate-500 text-sm font-medium mt-1">Equipe {equipeFila} • <span className="text-blue-600 font-bold">2.140 Pontos</span></p>
                        </div>
                    </div>
                    <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center min-w-[160px] z-10">
                        <p className="text-[10px] font-bold text-red-400 uppercase mb-1 tracking-wider">Expira em</p>
                        <p className="text-3xl font-black text-red-600 font-mono tracking-tighter">
                            {/* Mock Visual do Prazo */}
                            {String(prazoFila).padStart(2, '0')}:00:00
                        </p>
                        <p className="text-[9px] text-red-300 font-bold mt-1">HORAS RESTANTES</p>
                    </div>
                </div>

                {/* Tabela de Próximos */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                        <h4 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                             <span className="material-icons-round text-blue-500">format_list_numbered</span> Próximos na Fila
                        </h4>
                    </div>
                    <table className="w-full text-left">
                        <tbody className="divide-y divide-slate-100">
                            <tr className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 w-16 text-center">
                                    <span className="w-8 h-8 rounded-full bg-slate-200 inline-flex items-center justify-center font-bold text-slate-600 text-sm">02</span>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="font-bold text-slate-800 text-sm uppercase">1º Sgt. Oliveira Santos</p>
                                    <p className="text-xs text-slate-400">Mat: 35137 • Equipe Alpha</p>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="font-bold text-slate-600 text-sm">3.120 pts</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => alert("Pular")} className="text-[10px] font-bold border border-slate-200 text-slate-500 rounded px-3 py-1.5 hover:bg-slate-50 transition-colors">PULAR VEZ</button>
                                        <button onClick={() => alert("Liberar")} className="text-[10px] font-bold bg-blue-50 border border-blue-200 text-blue-600 rounded px-3 py-1.5 hover:bg-blue-100 transition-colors">LIBERAR MANUAL</button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* ABA: CONFIGURAÇÕES */}
        {activeTab === 'CONFIG' && (
            <div className="p-8 max-w-5xl mx-auto space-y-8">
                {/* Limites */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl flex items-center justify-between hover:border-blue-300 transition-colors">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <div className="p-1.5 bg-blue-100 rounded text-blue-600"><span className="material-icons-round text-lg">queue</span></div>
                                <h4 className="text-sm font-bold text-slate-800">FILA CPC</h4>
                            </div>
                            <p className="text-[11px] font-medium text-slate-400 uppercase ml-9">Limite Mensal por Policial</p>
                        </div>
                        <input 
                            className="w-20 text-center font-black text-2xl text-blue-600 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                            type="number" 
                            min="0"
                            value={limiteCPC}
                            onChange={(e) => setLimiteCPC(Number(e.target.value))}
                        />
                    </div>
                    <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl flex items-center justify-between hover:border-green-300 transition-colors">
                         <div>
                            <div className="flex items-center gap-2 mb-1">
                                <div className="p-1.5 bg-green-100 rounded text-green-600"><span className="material-icons-round text-lg">event</span></div>
                                <h4 className="text-sm font-bold text-slate-800">FILA PRODUTIVIDADE</h4>
                            </div>
                            <p className="text-[11px] font-medium text-slate-400 uppercase ml-9">Limite Mensal por Policial</p>
                        </div>
                        <input 
                            className="w-20 text-center font-black text-2xl text-green-600 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 outline-none" 
                            type="number" 
                            min="0"
                            value={limiteProd}
                            onChange={(e) => setLimiteProd(Number(e.target.value))}
                        />
                    </div>
                </div>

                {/* Exceções */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                    <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <span className="material-icons-round text-blue-600 text-lg">person_add_alt</span>
                            Adicionar Exceção de Limite
                        </h3>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                            <div className="md:col-span-5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Policial (Nome ou Matrícula)</label>
                                <div className="relative">
                                    <input 
                                        className="w-full bg-white border border-slate-300 rounded-lg pl-3 pr-10 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500" 
                                        placeholder="Digite para buscar..." 
                                        value={excecaoForm.busca}
                                        onChange={(e) => setExcecaoForm({...excecaoForm, busca: e.target.value})}
                                    />
                                    <span className="material-icons-round absolute right-3 top-2.5 text-slate-400">search</span>
                                </div>
                            </div>
                            <div className="md:col-span-3">
                                <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Referência (Mês/Ano)</label>
                                <input 
                                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500" 
                                    type="month"
                                    value={excecaoForm.mes}
                                    onChange={(e) => setExcecaoForm({...excecaoForm, mes: e.target.value})}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Novo Limite</label>
                                <input 
                                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500" 
                                    placeholder="Qtd." 
                                    type="number"
                                    min="0"
                                    value={excecaoForm.limite}
                                    onChange={(e) => setExcecaoForm({...excecaoForm, limite: e.target.value})}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <button 
                                    onClick={() => alert("Exceção aplicada com sucesso!")}
                                    className="w-full bg-blue-600 text-white font-bold text-xs uppercase py-3 rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-100 transition-colors"
                                >
                                    Aplicar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default AdminDispensas;