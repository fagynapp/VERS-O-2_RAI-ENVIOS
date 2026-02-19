import React, { useState } from 'react';

// Interfaces
interface TiUser {
  id: number;
  email: string;
  nome: string;
  matricula: string;
  perfil: string;
  nivel: number;
  status: 'ATIVO' | 'INATIVO';
  acessoAdm: boolean;
}

const MOCK_USERS: TiUser[] = [
  { id: 1, email: 'marcos.silva@policia.gov.br', nome: 'Marcos Antonio da Silva', matricula: '284.102-1', perfil: 'ADMINISTRADOR', nivel: 3, status: 'ATIVO', acessoAdm: true },
  { id: 2, email: 'ana.costa@policia.gov.br', nome: 'Ana Paula Costa', matricula: '159.330-X', perfil: 'DELEGADO', nivel: 2, status: 'ATIVO', acessoAdm: false },
  { id: 3, email: 'ricardo.lima@policia.gov.br', nome: 'Ricardo Lima Jr.', matricula: '442.115-3', perfil: 'ESCRIVÃO', nivel: 1, status: 'INATIVO', acessoAdm: false },
];

const TiDashboard = () => {
  const [activeTab, setActiveTab] = useState('Acessos');
  const [users, setUsers] = useState<TiUser[]>(MOCK_USERS);
  const [search, setSearch] = useState('');

  // Form States
  const [formData, setFormData] = useState({
    email: '',
    nome: '',
    matricula: '',
    perfil: '',
    nivel: 1,
    ativo: true,
    acessoAdm: false
  });

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.nome || !formData.matricula) {
        alert("Preencha os campos obrigatórios");
        return;
    }
    const newUser: TiUser = {
        id: Date.now(),
        email: formData.email,
        nome: formData.nome,
        matricula: formData.matricula,
        perfil: formData.perfil || 'Não Definido',
        nivel: Number(formData.nivel),
        status: formData.ativo ? 'ATIVO' : 'INATIVO',
        acessoAdm: formData.acessoAdm
    };
    setUsers([newUser, ...users]);
    alert("Usuário cadastrado com sucesso!");
    setFormData({ email: '', nome: '', matricula: '', perfil: '', nivel: 1, ativo: true, acessoAdm: false });
  };

  const filteredUsers = users.filter(u => 
    u.nome.toLowerCase().includes(search.toLowerCase()) || 
    u.matricula.includes(search) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Content */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">TI – Central de Configurações</h1>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-200 overflow-x-auto">
        <div className="flex space-x-1">
          {['Acessos', 'Perfis & Permissões', 'Configurações do Sistema', 'Logs de Acesso', 'Logs de Alterações', 'Ferramentas'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
        
        {activeTab === 'Acessos' && (
          <>
            {/* Section: Novo Acesso Form */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-lg font-bold text-slate-800">Novo Acesso</h2>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <form onSubmit={handleSaveUser}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                        <div className="space-y-1.5 lg:col-span-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Corporativo</label>
                            <input 
                                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all" 
                                placeholder="usuario@policia.gov.br" 
                                type="email"
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                            />
                        </div>
                        <div className="space-y-1.5 lg:col-span-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nome Completo</label>
                            <input 
                                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all" 
                                placeholder="Nome do Agente" 
                                type="text"
                                value={formData.nome}
                                onChange={e => setFormData({...formData, nome: e.target.value})}
                            />
                        </div>
                        <div className="space-y-1.5 lg:col-span-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Matrícula</label>
                            <input 
                                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all" 
                                placeholder="000.000-0" 
                                type="text"
                                value={formData.matricula}
                                onChange={e => setFormData({...formData, matricula: e.target.value})}
                            />
                        </div>
                        <div className="space-y-1.5 lg:col-span-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Perfil de Acesso</label>
                            <select 
                                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all bg-white"
                                value={formData.perfil}
                                onChange={e => setFormData({...formData, perfil: e.target.value})}
                            >
                                <option value="">Selecionar...</option>
                                <option value="ADMINISTRADOR">Administrador</option>
                                <option value="ESCRIVÃO">Escrivão</option>
                                <option value="INVESTIGADOR">Investigador</option>
                                <option value="DELEGADO">Delegado</option>
                                <option value="TI Nível 1">TI Nível 1</option>
                            </select>
                        </div>
                        <div className="space-y-1.5 lg:col-span-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nível de Acesso</label>
                            <select 
                                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all bg-white"
                                value={formData.nivel}
                                onChange={e => setFormData({...formData, nivel: Number(e.target.value)})}
                            >
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                            </select>
                        </div>
                        <div className="flex items-end lg:col-span-1">
                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg text-sm transition-all shadow-md shadow-blue-200 flex items-center justify-center gap-2 h-[38px]">
                                <span className="material-icons-round text-lg">save</span>
                                Salvar
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-start gap-8 mt-6 pt-6 border-t border-slate-100">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-11 h-6 rounded-full p-1 transition-colors ${formData.ativo ? 'bg-blue-600' : 'bg-gray-200'}`}>
                                <div className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${formData.ativo ? 'translate-x-5' : 'translate-x-0'}`} />
                            </div>
                            <input type="checkbox" className="hidden" checked={formData.ativo} onChange={e => setFormData({...formData, ativo: e.target.checked})} />
                            <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900">Ativo</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-11 h-6 rounded-full p-1 transition-colors ${formData.acessoAdm ? 'bg-blue-600' : 'bg-gray-200'}`}>
                                <div className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${formData.acessoAdm ? 'translate-x-5' : 'translate-x-0'}`} />
                            </div>
                            <input type="checkbox" className="hidden" checked={formData.acessoAdm} onChange={e => setFormData({...formData, acessoAdm: e.target.checked})} />
                            <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900">Pode Acessar ADM</span>
                        </label>
                    </div>
                </form>
              </div>
            </section>

            {/* Section: Usuários Cadastrados Table */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-800">Usuários Cadastrados</h2>
                <div className="relative">
                  <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                  <input 
                    className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm w-64 outline-none focus:ring-2 focus:ring-blue-600 transition-all" 
                    placeholder="Filtrar por nome ou matrícula..." 
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nome</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Matrícula</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Perfil</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nível</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Acesso ADM</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-6 py-4 text-sm font-medium text-slate-700">{user.email}</td>
                            <td className="px-6 py-4 text-sm text-slate-900 font-bold">{user.nome}</td>
                            <td className="px-6 py-4 text-sm text-slate-600 font-mono">{user.matricula}</td>
                            <td className="px-6 py-4">
                                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 uppercase">{user.perfil}</span>
                            </td>
                            <td className="px-6 py-4">
                                <span className="text-sm font-bold text-slate-900">{user.nivel}</span>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold ${user.status === 'ATIVO' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'ATIVO' ? 'bg-green-500' : 'bg-slate-400'}`}></span>
                                    {user.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                                {user.acessoAdm ? (
                                    <span className="material-icons-round text-blue-600 text-xl">check_circle</span>
                                ) : (
                                    <span className="material-icons-round text-slate-200 text-xl">cancel</span>
                                )}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors rounded hover:bg-blue-50">
                                        <span className="material-icons-round text-lg">edit_note</span>
                                    </button>
                                    <button className="p-1.5 text-slate-400 hover:text-red-500 transition-colors rounded hover:bg-red-50">
                                        <span className="material-icons-round text-lg">toggle_on</span>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
                
                {/* Pagination (Visual) */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">Mostrando {filteredUsers.length} usuários</span>
                  <div className="flex items-center gap-1">
                    <button className="p-1 hover:bg-white rounded transition-colors disabled:opacity-30" disabled>
                      <span className="material-icons-round text-lg text-slate-500">chevron_left</span>
                    </button>
                    <button className="px-2 py-0.5 bg-blue-600 text-white text-xs font-bold rounded shadow-sm">1</button>
                    <button className="px-2 py-0.5 hover:bg-white text-slate-600 text-xs font-medium rounded transition-colors">2</button>
                    <button className="px-2 py-0.5 hover:bg-white text-slate-600 text-xs font-medium rounded transition-colors">3</button>
                    <span className="px-2 py-0.5 text-xs text-slate-400">...</span>
                    <button className="p-1 hover:bg-white rounded transition-colors">
                      <span className="material-icons-round text-lg text-slate-500">chevron_right</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Placeholder for other tabs */}
        {activeTab !== 'Acessos' && (
            <div className="bg-white p-12 rounded-xl border border-slate-200 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                    <span className="material-icons-round text-4xl">construction</span>
                </div>
                <h3 className="text-lg font-bold text-slate-700">Módulo em Desenvolvimento</h3>
                <p className="text-slate-500 text-sm mt-1">A aba <strong>{activeTab}</strong> estará disponível em breve.</p>
            </div>
        )}

      </div>
    </div>
  );
};

export default TiDashboard;