import React, { useState } from 'react';

interface NaturezaItem {
  id: number;
  natureza: string;
  descricao: string;
  pontos: number;
  nga: string;
  ativo: boolean;
}

const INITIAL_DATA: NaturezaItem[] = [
  { 
    id: 1, 
    natureza: 'Prisão em Flagrante', 
    descricao: 'Homicídio / Latrocínio / Estupro', 
    pontos: 50, 
    nga: 'Portaria Nº 22/2024', 
    ativo: true 
  },
  { 
    id: 2, 
    natureza: 'Apreensão de Arma', 
    descricao: 'Arma de fogo (qualquer calibre)', 
    pontos: 30, 
    nga: 'Portaria Nº 22/2024', 
    ativo: true 
  },
  { 
    id: 3, 
    natureza: 'Recuperação de Veículo', 
    descricao: 'Veículo com registro de furto/roubo', 
    pontos: 20, 
    nga: 'Portaria Nº 22/2024', 
    ativo: true 
  },
  { 
    id: 4, 
    natureza: 'TCO', 
    descricao: 'Termo Circunstanciado de Ocorrência', 
    pontos: 10, 
    nga: 'Portaria Nº 22/2024', 
    ativo: false 
  },
];

const AdminNatureza = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState<NaturezaItem[]>(INITIAL_DATA);

  // Estados do Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    natureza: '',
    descricao: '',
    pontos: 0,
    nga: 'Portaria Nº 22/2024',
    ativo: true
  });

  // Estatísticas Dinâmicas
  const stats = {
    total: data.length,
    ativas: data.filter(i => i.ativo).length,
    inativas: data.filter(i => !i.ativo).length,
    mediaPontos: data.length > 0 ? Math.round(data.reduce((acc, cur) => acc + cur.pontos, 0) / data.length) : 0
  };

  // Handlers Principais
  const toggleStatus = (id: number) => {
    setData(prev => prev.map(item => 
      item.id === id ? { ...item, ativo: !item.ativo } : item
    ));
  };

  const handleDelete = (id: number) => {
    if(window.confirm("Deseja realmente excluir esta natureza?")) {
      setData(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({
      natureza: '',
      descricao: '',
      pontos: 0,
      nga: 'Portaria Nº 22/2024',
      ativo: true
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: NaturezaItem) => {
    setEditingId(item.id);
    setFormData({
      natureza: item.natureza,
      descricao: item.descricao,
      pontos: item.pontos,
      nga: item.nga,
      ativo: item.ativo
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.natureza || formData.pontos < 0) {
      alert("Preencha os campos obrigatórios corretamente.");
      return;
    }

    if (editingId) {
      // Editar existente
      setData(prev => prev.map(item => 
        item.id === editingId ? { ...item, ...formData, id: editingId } : item
      ));
    } else {
      // Criar novo (Gera ID simples baseado no timestamp para evitar colisão no mock)
      const newItem: NaturezaItem = {
        id: Date.now(),
        ...formData
      };
      setData(prev => [newItem, ...prev]);
    }
    setIsModalOpen(false);
  };

  const filteredData = data.filter(item => 
    item.natureza.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Registrar Natureza</h2>
        <p className="text-sm text-slate-500 mt-1">Cadastre/edite naturezas e pontuação do RAI.</p>
      </div>
      
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Card 1: Total */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <span className="material-icons-round">description</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Total Cadastrado</p>
            <p className="text-2xl font-black text-slate-800">{stats.total}</p>
            <p className="text-[10px] text-blue-500 font-bold mt-0.5">Registros</p>
          </div>
        </div>

        {/* Card 2: Ativas */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
            <span className="material-icons-round">check_circle</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Ativas</p>
            <p className="text-2xl font-black text-slate-800">{stats.ativas}</p>
            <p className="text-[10px] text-green-500 font-bold mt-0.5">Disponíveis</p>
          </div>
        </div>

        {/* Card 3: Inativas */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
            <span className="material-icons-round">block</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Inativas</p>
            <p className="text-2xl font-black text-slate-800">{stats.inativas}</p>
            <p className="text-[10px] text-red-500 font-bold mt-0.5">Desabilitadas</p>
          </div>
        </div>

        {/* Card 4: Média Pontos */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
            <span className="material-icons-round">stars</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Média de Pontos</p>
            <p className="text-2xl font-black text-slate-800">{stats.mediaPontos}</p>
            <p className="text-[10px] text-amber-500 font-bold mt-0.5">Por Natureza</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex justify-between items-center">
        <div className="relative w-96">
            <span className="material-icons-round absolute left-3 top-2.5 text-slate-400">search</span>
            <input 
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-10 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Pesquisar natureza ou descrição..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <span className="material-icons-round text-lg">close</span>
              </button>
            )}
        </div>
        <button onClick={handleAddNew} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wide hover:bg-blue-700 shadow-sm flex items-center gap-2">
            <span className="material-icons-round text-lg">add</span>
            Nova Natureza
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Natureza</th>
              <th className="px-6 py-4">Descrição</th>
              <th className="px-6 py-4 text-center">Pontos</th>
              <th className="px-6 py-4">NGA <span className="text-[9px] font-normal normal-case block text-slate-400">(Portaria Nº 22 de Nov/2024)</span></th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800">
                        {item.natureza}
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-xs max-w-xs truncate" title={item.descricao}>
                        {item.descricao}
                    </td>
                    <td className="px-6 py-4 text-center">
                        <span className="bg-blue-50 text-blue-700 font-bold px-3 py-1 rounded border border-blue-100 min-w-[3rem] inline-block">
                            {item.pontos}
                        </span>
                    </td>
                    <td className="px-6 py-4">
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200 inline-flex items-center gap-1">
                            <span className="material-icons-round text-[12px]">gavel</span>
                            {item.nga}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                        <button 
                            onClick={() => toggleStatus(item.id)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${item.ativo ? 'bg-green-500' : 'bg-slate-200'}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${item.ativo ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                            <button onClick={() => handleEdit(item)} className="text-slate-400 hover:text-blue-600 p-1.5 rounded-full hover:bg-blue-50 transition-colors" title="Editar">
                                <span className="material-icons-round text-lg">edit</span>
                            </button>
                            <button onClick={() => handleDelete(item.id)} className="text-slate-400 hover:text-red-600 p-1.5 rounded-full hover:bg-red-50 transition-colors" title="Excluir">
                                <span className="material-icons-round text-lg">delete</span>
                            </button>
                        </div>
                    </td>
                </tr>
            ))}
          </tbody>
        </table>
        {filteredData.length === 0 && (
            <div className="p-8 text-center text-slate-500 text-sm">Nenhuma natureza encontrada.</div>
        )}
      </div>

      {/* Modal de Cadastro/Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-blue-600 p-5 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <span className="material-icons-round text-2xl">description</span>
                <div>
                  <h3 className="font-bold text-lg">{editingId ? 'Editar Natureza' : 'Nova Natureza'}</h3>
                  <p className="text-[10px] opacity-80 uppercase tracking-wider">Gestão de Pontuação RAI</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="hover:bg-white/20 p-1 rounded transition-colors">
                <span className="material-icons-round">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nome da Natureza</label>
                <input 
                  type="text"
                  value={formData.natureza}
                  onChange={(e) => setFormData({...formData, natureza: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-600 outline-none"
                  placeholder="Ex: Prisão em Flagrante"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Descrição / Detalhes</label>
                <textarea 
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 focus:ring-2 focus:ring-blue-600 outline-none resize-none"
                  placeholder="Detalhes específicos para enquadramento..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Pontuação</label>
                  <input 
                    type="number"
                    value={formData.pontos}
                    onChange={(e) => setFormData({...formData, pontos: Number(e.target.value)})}
                    className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm font-black text-blue-700 focus:ring-2 focus:ring-blue-600 outline-none"
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Referência NGA</label>
                  <input 
                    type="text"
                    value={formData.nga}
                    onChange={(e) => setFormData({...formData, nga: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-600 focus:ring-2 focus:ring-blue-600 outline-none"
                    placeholder="Portaria/Artigo"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                 <input 
                    type="checkbox"
                    id="ativoCheck"
                    checked={formData.ativo}
                    onChange={(e) => setFormData({...formData, ativo: e.target.checked})}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                 />
                 <label htmlFor="ativoCheck" className="text-sm text-slate-700 font-medium select-none cursor-pointer">Natureza Ativa para Seleção</label>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 mt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">Cancelar</button>
                <button type="submit" className="px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg shadow-blue-200 transition-colors">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNatureza;