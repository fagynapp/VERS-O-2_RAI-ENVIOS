import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';

interface Policial {
  id: number;
  nome: string;
  matricula: string;
  equipe: string;
  aniversario: string;
  telefone: string;
  email: string;
}

// Mock inicial de dados
const initialPoliciais: Policial[] = [
  { id: 1, nome: '1º Sgt S. Junior', matricula: '37123', equipe: 'Alpha', aniversario: '12/05', telefone: '(62) 99988-7766', email: 's.junior@pm.go.gov.br' },
  { id: 2, nome: 'Sd Almeida', matricula: '37124', equipe: 'Bravo', aniversario: '28/09', telefone: '(62) 98877-1122', email: 'almeida@pm.go.gov.br' },
  { id: 3, nome: 'Cb Soares', matricula: '37000', equipe: 'Charlie', aniversario: '15/03', telefone: '(62) 99111-2233', email: 'soares@pm.go.gov.br' },
  { id: 4, nome: 'Sub Ten Marcelo', matricula: '33000', equipe: 'Delta', aniversario: '01/01', telefone: '(62) 99888-0000', email: 'marcelo@pm.go.gov.br' },
  { id: 5, nome: 'Sd Silva', matricula: '37100', equipe: 'Alpha', aniversario: '10/10', telefone: '(62) 99777-6655', email: 'silva@pm.go.gov.br' },
];

const AdminGestaoPoliciais = () => {
  const [policiais, setPoliciais] = useState<Policial[]>(initialPoliciais);
  const [search, setSearch] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados para o Modal de Edição/Criação
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<Policial, 'id'>>({
    nome: '',
    matricula: '',
    equipe: 'Alpha',
    aniversario: '',
    telefone: '',
    email: ''
  });

  // Lógica de filtragem baseada no estado atual
  const filteredPoliciais = policiais.filter((policial) => 
    policial.nome.toLowerCase().includes(search.toLowerCase()) ||
    policial.matricula.includes(search)
  );

  const getEquipeColor = (equipe: string) => {
    switch(equipe?.toUpperCase()) {
      case 'ALPHA': return 'bg-blue-100 text-blue-700';
      case 'BRAVO': return 'bg-green-100 text-green-700';
      case 'CHARLIE': return 'bg-orange-100 text-orange-700';
      case 'DELTA': return 'bg-purple-100 text-purple-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  // --- CRUD Handlers ---

  const handleDelete = (id: number, nome: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o policial ${nome}?`)) {
      setPoliciais(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleEdit = (policial: Policial) => {
    setFormData({
      nome: policial.nome,
      matricula: policial.matricula,
      equipe: policial.equipe,
      aniversario: policial.aniversario,
      telefone: policial.telefone,
      email: policial.email
    });
    setEditingId(policial.id);
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setFormData({
      nome: '',
      matricula: '',
      equipe: 'Alpha',
      aniversario: '',
      telefone: '',
      email: ''
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.matricula) {
      alert("Nome e Matrícula são obrigatórios.");
      return;
    }

    if (editingId) {
      // Editar existente
      setPoliciais(prev => prev.map(p => p.id === editingId ? { ...formData, id: editingId } : p));
    } else {
      // Criar novo
      const newId = Date.now();
      setPoliciais(prev => [...prev, { ...formData, id: newId }]);
    }

    setIsModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- Importação Excel ---

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileName = file.name.toLowerCase();
      if (!fileName.endsWith('.csv') && !fileName.endsWith('.xlsx') && !fileName.endsWith('.xls')) {
        alert("Formato inválido. Por favor, selecione um arquivo Excel (.xlsx, .xls) ou CSV.");
        return;
      }

      try {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
            alert("O arquivo parece estar vazio ou não pôde ser lido.");
            return;
        }

        const novosPoliciais = jsonData.map((row: any) => {
            const normalizedRow: any = {};
            Object.keys(row).forEach(key => {
                normalizedRow[key.trim().toLowerCase()] = row[key];
            });

            return {
                id: Date.now() + Math.random(),
                nome: normalizedRow['policial'] || normalizedRow['nome'] || normalizedRow['nome completo'] || 'Sem Nome',
                matricula: String(normalizedRow['matricula'] || normalizedRow['matrícula'] || normalizedRow['mat'] || '00000'),
                equipe: normalizedRow['equipe'] || normalizedRow['pelotão'] || normalizedRow['pelotao'] || 'Alpha',
                aniversario: normalizedRow['aniversário'] || normalizedRow['aniversario'] || normalizedRow['nascimento'] || normalizedRow['data nasc'] || '--/--',
                telefone: String(normalizedRow['telefone'] || normalizedRow['celular'] || normalizedRow['contato'] || ''),
                email: normalizedRow['email'] || normalizedRow['e-mail'] || ''
            };
        }).filter((p: any) => p.nome !== 'Sem Nome' && p.matricula !== '00000');

        if (novosPoliciais.length > 0) {
            setPoliciais(prev => [...prev, ...novosPoliciais]);
            alert(`${novosPoliciais.length} policiais importados com sucesso!`);
        } else {
            alert("Nenhum dado válido encontrado. Verifique as colunas.");
        }

      } catch (error) {
        console.error("Erro ao processar Excel:", error);
        alert("Erro ao ler o arquivo.");
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Gestão de Policiais</h2>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600"><span className="material-icons-round">groups</span></div>
          <div><p className="text-xs font-bold text-slate-500 uppercase">Total Efetivo</p><p className="text-2xl font-bold">{policiais.length}</p></div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center text-green-600"><span className="material-icons-round">check_circle</span></div>
          <div><p className="text-xs font-bold text-slate-500 uppercase">Ativos</p><p className="text-2xl font-bold">{policiais.length}</p></div>
        </div>
      </div>

      {/* Barra de Ações */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex gap-4">
        <div className="flex-1 relative">
          <span className="material-icons-round absolute left-3 top-2.5 text-slate-400">search</span>
          <input 
            className="w-full h-10 bg-white border border-slate-200 rounded-lg pl-10 pr-4 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400" 
            placeholder="Pesquisar por Nome ou Matrícula..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        />

        <button 
            onClick={handleImportClick}
            className="bg-green-600 text-white px-4 h-10 rounded-lg font-bold text-xs uppercase hover:bg-green-700 transition-colors shadow-sm shadow-green-200 flex items-center gap-2"
        >
            <span className="material-icons-round text-sm">upload_file</span>
            Importar Excel
        </button>

        <button onClick={handleNew} className="bg-blue-600 text-white px-6 h-10 rounded-lg font-bold text-xs uppercase hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
          Novo Registro
        </button>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredPoliciais.length > 0 ? (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-100 text-xs text-slate-500 uppercase">
              <tr>
                <th className="px-6 py-3 font-bold">Policial</th>
                <th className="px-6 py-3 font-bold">Matrícula</th>
                <th className="px-6 py-3 font-bold">Equipe</th>
                <th className="px-6 py-3 font-bold">Aniversário</th>
                <th className="px-6 py-3 font-bold">Telefone</th>
                <th className="px-6 py-3 font-bold">Email</th>
                <th className="px-6 py-3 font-bold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPoliciais.map((policial) => (
                <tr key={policial.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-800">{policial.nome}</td>
                  <td className="px-6 py-4 font-mono text-slate-600">{policial.matricula}</td>
                  <td className="px-6 py-4">
                    <span className={`${getEquipeColor(policial.equipe)} px-2 py-1 rounded text-xs font-bold uppercase`}>
                      {policial.equipe}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{policial.aniversario}</td>
                  <td className="px-6 py-4 text-slate-600 text-xs">{policial.telefone}</td>
                  <td className="px-6 py-4 text-slate-500 text-xs">{policial.email}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(policial)} className="text-slate-400 hover:text-blue-600 p-1 rounded-full hover:bg-blue-50 transition-colors" title="Editar">
                        <span className="material-icons-round text-lg">edit</span>
                      </button>
                      <button onClick={() => handleDelete(policial.id, policial.nome)} className="text-slate-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors" title="Excluir">
                        <span className="material-icons-round text-lg">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <span className="material-icons-round text-slate-300 text-5xl mb-3">search_off</span>
            <p className="text-slate-500 font-medium">Nenhum policial encontrado.</p>
            <p className="text-slate-400 text-xs mt-1">Tente buscar por outro nome ou matrícula.</p>
          </div>
        )}
      </div>

      {/* Modal de Edição/Criação */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-blue-600 p-5 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <span className="material-icons-round text-2xl">person_add</span>
                <div>
                  <h3 className="font-bold text-lg">{editingId ? 'Editar Policial' : 'Novo Policial'}</h3>
                  <p className="text-[10px] opacity-80 uppercase tracking-wider">Gerenciamento de Efetivo</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="hover:bg-white/20 p-1 rounded transition-colors"><span className="material-icons-round">close</span></button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nome Completo (Posto/Grad + Nome)</label>
                  <input 
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-600 outline-none" 
                    placeholder="Ex: Sd Silva"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Matrícula</label>
                    <input 
                      name="matricula"
                      value={formData.matricula}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-600 outline-none" 
                      placeholder="00000"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Equipe</label>
                    <select 
                      name="equipe"
                      value={formData.equipe}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                    >
                      <option value="Alpha">Alpha</option>
                      <option value="Bravo">Bravo</option>
                      <option value="Charlie">Charlie</option>
                      <option value="Delta">Delta</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Aniversário</label>
                    <input 
                      name="aniversario"
                      value={formData.aniversario}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-600 outline-none" 
                      placeholder="DD/MM"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Telefone</label>
                    <input 
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-600 outline-none" 
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Email</label>
                  <input 
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-600 outline-none" 
                    placeholder="email@pm.go.gov.br"
                  />
                </div>
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

export default AdminGestaoPoliciais;