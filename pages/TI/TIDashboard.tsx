import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const TIDashboard = () => {
  const [activeTab, setActiveTab] = useState<'ACESSOS' | 'CONFIG' | 'LOGS'>('ACESSOS');

  // --- MOCK DATA FOR LOGS ---
  const logs = [
    { id: 1, time: '2023-10-27 14:32:15', email: 'rodrigo.silva@policia.gov.br', perfil: 'Super Admin', acao: 'CRIAR', recurso: 'USUARIOS', chave: 'UUID-8821-X99' },
    { id: 2, time: '2023-10-27 13:10:02', email: 'maria.oliveira@policia.gov.br', perfil: 'TI Security', acao: 'EDITAR', recurso: 'CONFIG_SISTEMA', chave: 'AUTH_TIMEOUT_LIMIT' },
    { id: 3, time: '2023-10-27 11:45:55', email: 'sistema.bot@policia.gov.br', perfil: 'System Bot', acao: 'EXCLUIR', recurso: 'API_KEYS', chave: 'PROD_K8S_991' },
    { id: 4, time: '2023-10-27 10:22:11', email: 'admin.central@policia.gov.br', perfil: 'Diretor TI', acao: 'EDITAR', recurso: 'ACESSOS', chave: 'PERM_GROUP_OPS' },
    { id: 5, time: '2023-10-27 09:05:44', email: 'ti.suporte@policia.gov.br', perfil: 'Suporte N3', acao: 'CRIAR', recurso: 'LOG_POLICIES', chave: 'RETENTION_90D' },
  ];

  // --- MOCK DATA FOR USERS ---
  const users = [
    { email: 'marcos.silva@policia.gov.br', nome: 'Marcos Antonio da Silva', matricula: '284.102-1', perfil: 'ADMINISTRADOR', nivel: 3, status: true },
    { email: 'ana.costa@policia.gov.br', nome: 'Ana Paula Costa', matricula: '159.330-X', perfil: 'DELEGADO', nivel: 2, status: true },
    { email: 'ricardo.lima@policia.gov.br', nome: 'Ricardo Lima Jr.', matricula: '442.115-3', perfil: 'ESCRIVÃO', nivel: 1, status: false },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900">
      
      {/* SIDEBAR TI */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0 border-r border-slate-800">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/50">
            <span className="material-icons-round text-xl">settings_suggest</span>
          </div>
          <div>
            <h1 className="text-sm font-bold uppercase tracking-wider">TI CENTRAL</h1>
            <p className="text-[10px] text-slate-400 font-medium">Infraestrutura</p>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1">
          <button onClick={() => setActiveTab('ACESSOS')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${activeTab === 'ACESSOS' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <span className="material-icons-round text-sm">admin_panel_settings</span>
            <span className="text-sm font-medium">Acessos & Perfis</span>
          </button>
          <button onClick={() => setActiveTab('CONFIG')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${activeTab === 'CONFIG' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <span className="material-icons-round text-sm">tune</span>
            <span className="text-sm font-medium">Configurações</span>
          </button>
          <button onClick={() => setActiveTab('LOGS')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${activeTab === 'LOGS' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <span className="material-icons-round text-sm">history</span>
            <span className="text-sm font-medium">Logs de Auditoria</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <Link to="/" className="flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-slate-800 rounded-lg transition-colors">
            <span className="material-icons-round">logout</span>
            <span className="text-sm font-medium">Sair do Modo TI</span>
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* HEADER */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 flex-shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-bold text-slate-600">TI Central</span>
            <span className="material-icons-round text-[14px]">chevron_right</span>
            <span className="text-blue-600 font-bold uppercase">{activeTab}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-[10px] font-bold border border-orange-100 uppercase flex items-center gap-1">
                <span className="material-icons-round text-sm">lock</span> Acesso Restrito
            </div>
            <div className="h-8 w-[1px] bg-slate-200"></div>
            <div className="flex items-center gap-3">
                <div className="text-right">
                    <p className="text-xs font-bold text-slate-900">Admin Master</p>
                    <p className="text-[10px] text-slate-500">ID: 992-TI</p>
                </div>
                <div className="w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center text-white text-xs font-bold">TI</div>
            </div>
          </div>
        </header>

        {/* CONTENT BODY */}
        <div className="flex-1 overflow-y-auto p-8 bg-[#f8f9fc]">
            
            {/* --- TAB: ACESSOS --- */}
            {activeTab === 'ACESSOS' && (
                <div className="max-w-6xl mx-auto space-y-8 animate-[fadeIn_0.2s_ease-out]">
                    <div className="flex justify-between items-end">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Gestão de Acessos</h2>
                            <p className="text-sm text-slate-500">Controle de credenciais e níveis de permissão do sistema.</p>
                        </div>
                    </div>

                    {/* Form Novo Acesso */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                            <span className="material-icons-round text-blue-600">person_add</span>
                            <h3 className="font-bold text-slate-800">Novo Acesso</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Email Corporativo</label>
                                <input className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="usuario@policia.gov.br" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Nome Completo</label>
                                <input className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nome do Agente" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Matrícula</label>
                                <input className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="000.000-0" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Perfil</label>
                                <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                                    <option>Administrador</option>
                                    <option>Oficial</option>
                                    <option>Praça</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end mt-4 pt-4 border-t border-slate-100">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg text-sm shadow-md transition-all flex items-center gap-2">
                                <span className="material-icons-round text-sm">save</span> Salvar Usuário
                            </button>
                        </div>
                    </div>

                    {/* Tabela de Usuários */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nome</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Matrícula</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Perfil</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {users.map((user, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-slate-700">{user.email}</td>
                                        <td className="px-6 py-4 text-sm font-bold text-slate-800">{user.nome}</td>
                                        <td className="px-6 py-4 text-sm font-mono text-slate-500">{user.matricula}</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[10px] font-bold uppercase">{user.perfil}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {user.status ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase border border-green-200">
                                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Ativo
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase border border-slate-200">
                                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span> Inativo
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-slate-400 hover:text-blue-600 transition-colors p-1"><span className="material-icons-round text-lg">edit</span></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* --- TAB: CONFIGURAÇÕES --- */}
            {activeTab === 'CONFIG' && (
                <div className="max-w-5xl mx-auto space-y-6 animate-[fadeIn_0.2s_ease-out]">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Variáveis do Sistema</h2>
                        <p className="text-sm text-slate-500">
                            Ajuste de constantes globais. <span className="text-red-500 font-bold">Atenção:</span> Alterações impactam regras de negócio.
                        </p>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-4 items-start">
                        <span className="material-icons-round text-amber-600">warning</span>
                        <div className="text-sm text-amber-800">
                            <p className="font-bold">Modo Auditoria Ativo</p>
                            <p>Toda alteração de chave é registrada com log de IP e usuário para fins de auditoria interna.</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Chave</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest w-32">Valor</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Descrição</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Ação</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <tr>
                                    <td className="px-6 py-4"><code className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-1 rounded">META_SEG_QUI</code></td>
                                    <td className="px-6 py-4"><input className="w-20 px-2 py-1 border border-slate-200 rounded text-sm font-bold text-blue-600 text-center" defaultValue="100" /></td>
                                    <td className="px-6 py-4 text-sm text-slate-600">Meta de produtividade (Segunda a Quinta).</td>
                                    <td className="px-6 py-4 text-center"><button className="text-blue-600 hover:bg-blue-50 p-1 rounded"><span className="material-icons-round">save</span></button></td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4"><code className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-1 rounded">META_SEX_DOM</code></td>
                                    <td className="px-6 py-4"><input className="w-20 px-2 py-1 border border-slate-200 rounded text-sm font-bold text-blue-600 text-center" defaultValue="140" /></td>
                                    <td className="px-6 py-4 text-sm text-slate-600">Meta de produtividade (Sexta a Domingo/Feriados).</td>
                                    <td className="px-6 py-4 text-center"><button className="text-blue-600 hover:bg-blue-50 p-1 rounded"><span className="material-icons-round">save</span></button></td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4"><code className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-1 rounded">PRAZO_RAI_DIAS</code></td>
                                    <td className="px-6 py-4"><input className="w-20 px-2 py-1 border border-slate-200 rounded text-sm font-bold text-blue-600 text-center" defaultValue="90" /></td>
                                    <td className="px-6 py-4 text-sm text-slate-600">Prazo máximo para expiração de relatórios.</td>
                                    <td className="px-6 py-4 text-center"><button className="text-blue-600 hover:bg-blue-50 p-1 rounded"><span className="material-icons-round">save</span></button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* --- TAB: LOGS --- */}
            {activeTab === 'LOGS' && (
                <div className="max-w-7xl mx-auto space-y-6 animate-[fadeIn_0.2s_ease-out]">
                    <div className="flex justify-between items-end">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Logs de Auditoria</h2>
                            <p className="text-sm text-slate-500">Rastreamento de modificações críticas no núcleo do sistema.</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                                <span className="material-icons-round text-lg">download</span> Exportar CSV
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                                <span className="material-icons-round text-lg">refresh</span> Atualizar
                            </button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <span className="material-icons-round absolute left-3 top-2.5 text-slate-400">search</span>
                            <input className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Buscar por email ou chave..." />
                        </div>
                        <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 outline-none focus:ring-2 focus:ring-blue-500">
                            <option>Todos os Recursos</option>
                            <option>USUARIOS</option>
                            <option>CONFIG_SISTEMA</option>
                        </select>
                        <input type="date" className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 outline-none focus:ring-2 focus:ring-blue-500" />
                        <button className="bg-slate-800 text-white font-bold rounded-lg text-sm hover:bg-slate-700 transition-colors">Filtrar</button>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Timestamp</th>
                                    <th className="px-4 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Email</th>
                                    <th className="px-4 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Perfil</th>
                                    <th className="px-4 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Ação</th>
                                    <th className="px-4 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Recurso</th>
                                    <th className="px-4 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Chave</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="px-4 py-3 text-xs font-mono text-slate-500">{log.time}</td>
                                        <td className="px-4 py-3 text-sm font-bold text-slate-700">{log.email}</td>
                                        <td className="px-4 py-3"><span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-slate-200">{log.perfil}</span></td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                                                log.acao === 'CRIAR' ? 'bg-green-100 text-green-700 border-green-200' :
                                                log.acao === 'EXCLUIR' ? 'bg-red-100 text-red-700 border-red-200' :
                                                'bg-amber-100 text-amber-700 border-amber-200'
                                            }`}>
                                                {log.acao}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3"><span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">{log.recurso}</span></td>
                                        <td className="px-4 py-3 text-xs font-mono text-slate-500">{log.chave}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

        </div>
      </main>
    </div>
  );
};

export default TIDashboard;