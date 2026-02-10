import React, { useState } from 'react';

const Overview = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase">CPC EM FILA</span>
          <span className="material-icons-round text-blue-600">groups</span>
        </div>
        <div className="flex items-end gap-3">
          <span className="text-2xl font-black text-slate-900">14</span>
          <span className="text-[10px] text-slate-400 font-bold uppercase mb-1">Total Geral</span>
        </div>
      </div>
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase">PROD AGENDADAS</span>
          <span className="material-icons-round text-green-500">event_available</span>
        </div>
        <div className="flex items-end gap-3">
          <span className="text-2xl font-black text-slate-900">42</span>
          <span className="text-[11px] font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded mb-1">+12%</span>
        </div>
      </div>
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase">BLOQUEIOS</span>
          <span className="material-icons-round text-red-500">lock</span>
        </div>
        <div className="flex items-end gap-3">
          <span className="text-2xl font-black text-slate-900">01</span>
          <span className="text-[11px] font-medium text-slate-500 italic mb-1">Regime especial</span>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
        <h3 className="text-sm font-bold text-slate-800 uppercase flex items-center gap-2">
          <span className="material-icons-round text-blue-600">list_alt</span>
          Últimos Registros
        </h3>
      </div>
      <table className="w-full text-left">
        <thead className="bg-slate-50 border-b border-slate-100">
          <tr>
            <th className="px-6 py-3 text-[11px] font-bold text-slate-400 uppercase">Policial</th>
            <th className="px-6 py-3 text-[11px] font-bold text-slate-400 uppercase">Matrícula</th>
            <th className="px-6 py-3 text-[11px] font-bold text-slate-400 uppercase">Natureza</th>
            <th className="px-6 py-3 text-[11px] font-bold text-slate-400 uppercase">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          <tr>
            <td className="px-6 py-4 font-bold text-slate-900">Sub-Ten. Marcelo Rocha</td>
            <td className="px-6 py-4 text-slate-600">33000</td>
            <td className="px-6 py-4"><span className="bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded text-[10px]">CPC</span></td>
            <td className="px-6 py-4"><span className="text-blue-600 font-bold text-[11px] uppercase flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span> Processado</span></td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-bold text-slate-900">1º Sgt. Oliveira Santos</td>
            <td className="px-6 py-4 text-slate-600">35137</td>
            <td className="px-6 py-4"><span className="bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded text-[10px]">PROD</span></td>
            <td className="px-6 py-4"><span className="text-green-600 font-bold text-[11px] uppercase flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-600"></span> Liberado</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

const FilaCPC = () => {
  const [equipe, setEquipe] = useState('ALPHA');
  const [criterio, setCriterio] = useState('ALMANAQUE');

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase">Equipe</label>
          <select 
            className="text-sm font-bold text-slate-700 border-slate-200 rounded-lg bg-slate-50 py-2 pl-3 pr-10"
            value={equipe}
            onChange={(e) => setEquipe(e.target.value)}
          >
            <option value="ALPHA">EQUIPE: ALPHA</option>
            <option value="BRAVO">EQUIPE: BRAVO</option>
            <option value="CHARLIE">EQUIPE: CHARLIE</option>
            <option value="DELTA">EQUIPE: DELTA</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase">Critério</label>
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-1">
            <button 
              onClick={() => setCriterio('PRODUTIVIDADE')}
              className={`px-3 py-1 rounded text-[11px] font-bold uppercase transition-colors ${criterio === 'PRODUTIVIDADE' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500'}`}
            >
              Produtividade
            </button>
            <button 
              onClick={() => setCriterio('ALMANAQUE')}
              className={`px-3 py-1 rounded text-[11px] font-bold uppercase transition-colors ${criterio === 'ALMANAQUE' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500'}`}
            >
              Almanaque
            </button>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => alert("Processamento da fila iniciado!")} className="bg-green-500 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase flex items-center gap-2 hover:bg-green-600"><span className="material-icons-round text-sm">play_arrow</span> Iniciar</button>
        </div>
      </div>

      <div className="bg-white border-2 border-blue-600 rounded-2xl p-6 shadow-lg flex items-center justify-between relative overflow-hidden">
        <div className="absolute top-0 left-0 h-full w-2 bg-blue-600"></div>
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <span className="material-icons-round text-4xl">person</span>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">Liberado Agora</span>
              <span className="text-slate-400 text-xs font-medium">Mat: 33120</span>
            </div>
            <h3 className="text-xl font-black text-slate-900 uppercase">Sub-Ten. Marcelo Rocha</h3>
            <p className="text-slate-500 text-sm">Equipe {equipe} • 2.140 Pontos</p>
          </div>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-center min-w-[150px]">
          <p className="text-[10px] font-bold text-red-400 uppercase mb-1">Expira em</p>
          <p className="text-2xl font-black text-red-600 font-mono">08:45:12</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <h4 className="font-bold text-slate-700 uppercase flex items-center gap-2 text-sm">
            <span className="material-icons-round text-blue-600">format_list_numbered</span> 
            Próximos na Fila
          </h4>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase text-center">Ordem</th>
              <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase">Policial</th>
              <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase text-center">Pontos</th>
              <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="px-6 py-4 text-center"><span className="w-6 h-6 rounded-full bg-slate-100 inline-flex items-center justify-center font-bold text-slate-600 text-xs">02</span></td>
              <td className="px-6 py-4 font-bold text-slate-800">1º Sgt. Oliveira Santos</td>
              <td className="px-6 py-4 text-center text-slate-600">3.120</td>
              <td className="px-6 py-4 text-center flex justify-center gap-2">
                 <button onClick={() => alert("Policial pulado para o final da fila.")} className="text-[10px] font-bold border border-slate-200 rounded px-2 py-1 hover:bg-slate-50">PULAR</button>
                 <button onClick={() => alert("Policial liberado manualmente.")} className="text-[10px] font-bold border border-blue-200 text-blue-600 rounded px-2 py-1 hover:bg-blue-50">LIBERAR</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Config = () => {
  const [limiteCPC, setLimiteCPC] = useState(1);
  const [limiteProd, setLimiteProd] = useState(1);
  const [excecaoForm, setExcecaoForm] = useState({ busca: '', mes: '', limite: '' });

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[11px] font-black text-slate-400 uppercase">Limite Mensal</p>
            <h4 className="text-sm font-bold text-slate-700">FILA CPC</h4>
          </div>
          <input 
            className="w-16 text-center font-black text-blue-600 border border-slate-200 rounded p-2" 
            type="number" 
            value={limiteCPC}
            onChange={(e) => setLimiteCPC(Number(e.target.value))}
          />
        </div>
        <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[11px] font-black text-slate-400 uppercase">Limite Mensal</p>
            <h4 className="text-sm font-bold text-slate-700">FILA PROD</h4>
          </div>
          <input 
            className="w-16 text-center font-black text-blue-600 border border-slate-200 rounded p-2" 
            type="number" 
            value={limiteProd}
            onChange={(e) => setLimiteProd(Number(e.target.value))}
          />
        </div>
      </div>
      
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
          <span className="material-icons-round text-blue-600 text-lg">person_add</span>
          Adicionar Exceção
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-1">
            <label className="text-[11px] font-bold text-slate-700 uppercase mb-1 block">Pesquisar</label>
            <input 
              className="w-full border border-slate-200 rounded-lg p-2 text-sm" 
              placeholder="Nome ou Matrícula" 
              value={excecaoForm.busca}
              onChange={(e) => setExcecaoForm({...excecaoForm, busca: e.target.value})}
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-700 uppercase mb-1 block">Mês / Ano</label>
            <input 
              className="w-full border border-slate-200 rounded-lg p-2 text-sm" 
              type="month"
              value={excecaoForm.mes}
              onChange={(e) => setExcecaoForm({...excecaoForm, mes: e.target.value})}
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-700 uppercase mb-1 block">Novo Limite</label>
            <input 
              className="w-full border border-slate-200 rounded-lg p-2 text-sm" 
              placeholder="Ex: 2" 
              type="number"
              value={excecaoForm.limite}
              onChange={(e) => setExcecaoForm({...excecaoForm, limite: e.target.value})}
            />
          </div>
          <button 
            onClick={() => alert("Exceção aplicada com sucesso!")}
            className="bg-blue-600 text-white font-bold text-xs uppercase p-2.5 rounded-lg h-[38px] hover:bg-blue-700"
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminDispensas = () => {
  const [tab, setTab] = useState(0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Gestão de Dispensas</h2>
      </div>

      <nav className="flex border-b border-slate-200">
        <button onClick={() => setTab(0)} className={`px-6 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${tab === 0 ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-blue-600'}`}>Visão Geral</button>
        <button onClick={() => setTab(1)} className={`px-6 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${tab === 1 ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-blue-600'}`}>CPC — Fila</button>
        <button onClick={() => setTab(2)} className={`px-6 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${tab === 2 ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-blue-600'}`}>Configurações</button>
      </nav>

      {tab === 0 && <Overview />}
      {tab === 1 && <FilaCPC />}
      {tab === 2 && <Config />}
    </div>
  );
};

export default AdminDispensas;