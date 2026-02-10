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

// Lista inicial de Equipes/Setores
const INITIAL_TEAMS = [
  'Alpha', 
  'Bravo', 
  'Charlie', 
  'Delta', 
  'P2', 
  'P3', 
  'P4', 
  'Adjunto', 
  'TCO', 
  'Região 44', 
  'Manutenção', 
  'Comando', 
  'SubCmt'
];

// Mock inicial de dados carregado do PDF
const initialPoliciais: Policial[] = [
  { id: 1, nome: 'MAJ KAMINICHE', matricula: '33864', equipe: 'Comando', aniversario: '', telefone: '', email: '' },
  { id: 2, nome: 'CAP ERNANE', matricula: '36234', equipe: 'SubCmt', aniversario: '', telefone: '', email: '' },
  { id: 3, nome: '1º TEN J. CARLOS', matricula: '25646', equipe: 'Bravo', aniversario: '', telefone: '', email: '' },
  { id: 4, nome: '1º TEN SANTOS', matricula: '28702', equipe: 'P2', aniversario: '', telefone: '', email: '' },
  { id: 5, nome: '1º TEN KLEBER', matricula: '28905', equipe: 'Região 44', aniversario: '', telefone: '', email: '' },
  { id: 6, nome: '1º TEN SERAFIM', matricula: '30220', equipe: 'Charlie', aniversario: '', telefone: '', email: '' },
  { id: 7, nome: '1º TEN MONTES', matricula: '31123', equipe: 'Delta', aniversario: '', telefone: '', email: '' },
  { id: 8, nome: '1º TEN SANTIAGO', matricula: '38718', equipe: 'Alpha', aniversario: '', telefone: '', email: '' },
  { id: 9, nome: 'ST ANDRADE', matricula: '28639', equipe: 'Delta', aniversario: '', telefone: '', email: '' },
  { id: 10, nome: 'ST CLEIBE', matricula: '30611', equipe: 'Bravo', aniversario: '', telefone: '', email: '' },
  { id: 11, nome: 'ST MARCELO', matricula: '31141', equipe: 'Bravo', aniversario: '', telefone: '', email: '' },
  { id: 12, nome: 'ST MARÇAL', matricula: '33073', equipe: 'P4', aniversario: '', telefone: '', email: '' },
  { id: 13, nome: '1º SGT RAMOS', matricula: '24955', equipe: 'Alpha', aniversario: '', telefone: '', email: '' },
  { id: 14, nome: '1º SGT MACHADO', matricula: '27122', equipe: 'Adjunto', aniversario: '', telefone: '', email: '' },
  { id: 15, nome: '1º SGT MACEDO', matricula: '27733', equipe: 'Delta', aniversario: '', telefone: '', email: '' },
  { id: 16, nome: '1º SGT GONÇALVES', matricula: '28027', equipe: 'Adjunto', aniversario: '', telefone: '', email: '' },
  { id: 17, nome: '1º SGT LÚCIO', matricula: '28493', equipe: 'P2', aniversario: '', telefone: '', email: '' },
  { id: 18, nome: '1º SGT MOREIRA', matricula: '28748', equipe: 'Charlie', aniversario: '', telefone: '', email: '' },
  { id: 19, nome: '1º SGT JHONATAN', matricula: '31853', equipe: 'P2', aniversario: '', telefone: '', email: '' },
  { id: 20, nome: '1º SGT SUDÁRIO', matricula: '32288', equipe: 'Bravo', aniversario: '', telefone: '', email: '' },
  { id: 21, nome: '2º SGT DE PAULA', matricula: '27183', equipe: 'Bravo', aniversario: '', telefone: '', email: '' },
  { id: 22, nome: '2º SGT LEUCIONE', matricula: '30245', equipe: 'Manutenção', aniversario: '', telefone: '', email: '' },
  { id: 23, nome: '2º SGT FERNANDO', matricula: '31279', equipe: 'Charlie', aniversario: '', telefone: '', email: '' },
  { id: 24, nome: '2º SGT ÉDER', matricula: '33150', equipe: 'P2', aniversario: '', telefone: '', email: '' },
  { id: 25, nome: '2º SGT CARNEIRO', matricula: '33949', equipe: 'Bravo', aniversario: '', telefone: '', email: '' },
  { id: 26, nome: '3º SGT MONTEIRO', matricula: '27310', equipe: 'Adjunto', aniversario: '', telefone: '', email: '' },
  { id: 27, nome: '3º SGT MORENO', matricula: '31600', equipe: 'Adjunto', aniversario: '', telefone: '', email: '' },
  { id: 28, nome: '3º SGT WALACE', matricula: '34208', equipe: 'Região 44', aniversario: '', telefone: '', email: '' },
  { id: 29, nome: '3º SGT DIAS', matricula: '34425', equipe: 'Delta', aniversario: '', telefone: '', email: '' },
  { id: 30, nome: '3º SGT NETTO', matricula: '34686', equipe: 'P2', aniversario: '', telefone: '', email: '' },
  { id: 31, nome: '3º SGT BAYRON', matricula: '35447', equipe: 'Charlie', aniversario: '', telefone: '', email: '' },
  { id: 32, nome: '3º SGT SANDER', matricula: '35534', equipe: 'P2', aniversario: '', telefone: '', email: '' },
  { id: 33, nome: '3º SGT DARLAN', matricula: '35619', equipe: 'Bravo', aniversario: '', telefone: '', email: '' },
  { id: 34, nome: '3º SGT ÉZIO', matricula: '35672', equipe: 'Charlie', aniversario: '', telefone: '', email: '' },
  { id: 35, nome: '3º SGT ALENCAR', matricula: '35686', equipe: 'Delta', aniversario: '', telefone: '', email: '' },
  { id: 36, nome: '3º SGT JAIRO', matricula: '35768', equipe: 'Delta', aniversario: '', telefone: '', email: '' },
  { id: 37, nome: '3º SGT JUNIO', matricula: '35820', equipe: 'Alpha', aniversario: '', telefone: '', email: '' },
  { id: 38, nome: '3º SGT CÉSAR', matricula: '35928', equipe: 'Bravo', aniversario: '', telefone: '', email: '' },
  { id: 39, nome: 'CB RUFINA', matricula: '36490', equipe: 'Delta', aniversario: '', telefone: '', email: '' },
  { id: 40, nome: 'CB LIMA', matricula: '36507', equipe: 'P3', aniversario: '', telefone: '', email: '' },
  { id: 41, nome: 'CB SENA', matricula: '36713', equipe: 'P2', aniversario: '', telefone: '', email: '' },
  { id: 42, nome: 'CB AQUINO', matricula: '36720', equipe: 'Charlie', aniversario: '', telefone: '', email: '' },
  { id: 43, nome: 'CB FERREIRA', matricula: '36977', equipe: 'Charlie', aniversario: '', telefone: '', email: '' },
  { id: 44, nome: 'CB EULLER', matricula: '37104', equipe: 'Alpha', aniversario: '', telefone: '', email: '' },
  { id: 45, nome: 'CB SOARES', matricula: '37132', equipe: 'Bravo', aniversario: '', telefone: '', email: '' },
  { id: 46, nome: 'CB WARTELOO', matricula: '37190', equipe: 'P2', aniversario: '', telefone: '', email: '' },
  { id: 47, nome: 'CB GILVAN', matricula: '37253', equipe: 'Bravo', aniversario: '', telefone: '', email: '' },
  { id: 48, nome: 'CB DE LIMA', matricula: '37379', equipe: 'Bravo', aniversario: '', telefone: '', email: '' },
  { id: 49, nome: 'CB VARGAS', matricula: '37566', equipe: 'Comando', aniversario: '', telefone: '', email: '' },
  { id: 50, nome: 'CB EUGÊNIA', matricula: '37800', equipe: 'P3', aniversario: '', telefone: '', email: '' },
  { id: 51, nome: 'CB MENDES', matricula: '37829', equipe: 'P2', aniversario: '', telefone: '', email: '' },
  { id: 52, nome: 'CB PADILHA', matricula: '37932', equipe: 'P2', aniversario: '', telefone: '', email: '' },
  { id: 53, nome: 'CB REZENDE', matricula: '37958', equipe: 'Alpha', aniversario: '', telefone: '', email: '' },
  { id: 54, nome: 'CB HENRIQUE', matricula: '38019', equipe: 'Charlie', aniversario: '', telefone: '', email: '' },
  { id: 55, nome: 'CB PASSOS', matricula: '38183', equipe: 'P2', aniversario: '', telefone: '', email: '' },
  { id: 56, nome: 'CB SAITON', matricula: '38291', equipe: 'Alpha', aniversario: '', telefone: '', email: '' },
  { id: 57, nome: 'SD GERALDO', matricula: '39096', equipe: 'Alpha', aniversario: '', telefone: '', email: '' },
  { id: 58, nome: 'SD GUEDES', matricula: '39203', equipe: 'Bravo', aniversario: '', telefone: '', email: '' },
  { id: 59, nome: 'SD L SILVA', matricula: '39280', equipe: 'Delta', aniversario: '', telefone: '', email: '' },
  { id: 60, nome: 'SD SUCUPIRA', matricula: '39417', equipe: 'Alpha', aniversario: '', telefone: '', email: '' },
  { id: 61, nome: 'SD SARMENTO', matricula: '39435', equipe: 'Alpha', aniversario: '', telefone: '', email: '' },
  { id: 62, nome: 'SD VENÂNCIO', matricula: '39505', equipe: 'TCO', aniversario: '', telefone: '', email: '' },
  { id: 63, nome: 'SD COIMBRA', matricula: '39780', equipe: 'Adjunto', aniversario: '', telefone: '', email: '' },
  { id: 64, nome: 'SD NETO', matricula: '39948', equipe: 'Bravo', aniversario: '', telefone: '', email: '' },
  { id: 65, nome: 'SD RENAN', matricula: '39989', equipe: 'Delta', aniversario: '', telefone: '', email: '' },
  { id: 66, nome: 'SD OLIVEIRA', matricula: '40025', equipe: 'Charlie', aniversario: '', telefone: '', email: '' },
];

const AdminGestaoPoliciais = () => {
  const [policiais, setPoliciais] = useState<Policial[]>(initialPoliciais);
  const [availableTeams, setAvailableTeams] = useState<string[]>(INITIAL_TEAMS);
  
  const [search, setSearch] = useState('');
  const [selectedEquipe, setSelectedEquipe] = useState('TODAS'); // Estado do Filtro
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados para o Modal de Edição/Criação de Policial
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Estados para o Gerenciador de Equipes
  const [isTeamManagerOpen, setIsTeamManagerOpen] = useState(false);
  const [teamToEdit, setTeamToEdit] = useState<string | null>(null);
  const [newTeamName, setNewTeamName] = useState('');

  // Controle de input personalizado de equipe no modal
  const [isCustomTeam, setIsCustomTeam] = useState(false);
  
  const [formData, setFormData] = useState<Omit<Policial, 'id'>>({
    nome: '',
    matricula: '',
    equipe: 'Alpha',
    aniversario: '',
    telefone: '',
    email: ''
  });

  // Lógica de filtragem atualizada (Case Insensitive e Trim)
  const filteredPoliciais = policiais.filter((policial) => {
    const matchesSearch = policial.nome.toLowerCase().includes(search.toLowerCase()) ||
                          policial.matricula.includes(search);
    
    // Normalização: Converte para minúsculas e remove espaços das pontas
    const policialEquipe = policial.equipe ? policial.equipe.toString().trim().toLowerCase() : '';
    const filtroEquipe = selectedEquipe.trim().toLowerCase();
    
    const matchesEquipe = selectedEquipe === 'TODAS' || policialEquipe === filtroEquipe;
    
    return matchesSearch && matchesEquipe;
  });

  const getEquipeColor = (equipe: string) => {
    switch(equipe?.trim().toUpperCase()) {
      case 'ALPHA': return 'bg-blue-100 text-blue-700';
      case 'BRAVO': return 'bg-green-100 text-green-700';
      case 'CHARLIE': return 'bg-orange-100 text-orange-700';
      case 'DELTA': return 'bg-purple-100 text-purple-700';
      case 'COMANDO': 
      case 'SUBCMT': return 'bg-red-100 text-red-700';
      case 'P2':
      case 'P3':
      case 'P4': return 'bg-slate-200 text-slate-700';
      default: return 'bg-slate-100 text-slate-600';
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
    // Verificar se a equipe é padrão ou personalizada para ajustar o estado do modal
    const isStandardTeam = INITIAL_TEAMS.includes(policial.equipe);
    setIsCustomTeam(!isStandardTeam);
    
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
    setIsCustomTeam(false);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.matricula) {
      alert("Nome e Matrícula são obrigatórios.");
      return;
    }

    if (!formData.equipe) {
      alert("Por favor, informe a Equipe/Setor.");
      return;
    }

    // Adiciona a nova equipe à lista de disponíveis se não existir
    if (!availableTeams.some(t => t.toLowerCase() === formData.equipe.toLowerCase())) {
        setAvailableTeams(prev => [...prev, formData.equipe].sort());
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

  // --- Funções de Gerenciamento de Equipes ---
  const startEditingTeam = (team: string) => {
    setTeamToEdit(team);
    setNewTeamName(team);
  };

  const saveTeamName = () => {
    if (!newTeamName.trim() || !teamToEdit) return;
    
    const oldName = teamToEdit;
    const newName = newTeamName.trim();

    if (oldName === newName) {
        setTeamToEdit(null);
        return;
    }

    if (availableTeams.some(t => t.toLowerCase() === newName.toLowerCase() && t.toLowerCase() !== oldName.toLowerCase())) {
        alert("Já existe uma equipe com este nome.");
        return;
    }

    // Update availableTeams
    setAvailableTeams(prev => prev.map(t => t === oldName ? newName : t).sort());

    // Update policemen associated with this team
    setPoliciais(prev => prev.map(p => p.equipe === oldName ? { ...p, equipe: newName } : p));

    // Update filter if selected
    if (selectedEquipe === oldName) {
        setSelectedEquipe(newName);
    }

    setTeamToEdit(null);
    setNewTeamName('');
  };

  const cancelEditTeam = () => {
    setTeamToEdit(null);
    setNewTeamName('');
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
            // Atualizar lista de equipes com as importadas
            const importedTeams: string[] = Array.from(new Set(novosPoliciais.map((p: any) => String(p.equipe))));
            setAvailableTeams((prev: string[]) => {
                const combined = new Set<string>([...prev, ...importedTeams]);
                return Array.from(combined).sort();
            });

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

      {/* Barra de Ações e Filtros */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col md:flex-row gap-4 items-center">
        {/* Busca */}
        <div className="flex-1 relative w-full">
          <span className="material-icons-round absolute left-3 top-2.5 text-slate-400">search</span>
          <input 
            className="w-full h-10 bg-white border border-slate-200 rounded-lg pl-10 pr-4 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400" 
            placeholder="Pesquisar por Nome ou Matrícula..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filtro de Equipe com Botão de Edição */}
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-48">
            <select
              value={selectedEquipe}
              onChange={(e) => setSelectedEquipe(e.target.value)}
              className="w-full h-10 bg-white border border-slate-200 rounded-lg px-3 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none"
            >
              <option value="TODAS">Todas as Equipes</option>
              {availableTeams.map((team) => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
            <span className="material-icons-round absolute right-3 top-2.5 text-slate-400 pointer-events-none">expand_more</span>
          </div>
          <button 
            onClick={() => setIsTeamManagerOpen(true)}
            className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-colors shadow-sm"
            title="Gerenciar Nomes das Equipes"
          >
            <span className="material-icons-round">edit_note</span>
          </button>
        </div>
        
        {/* Input Oculto para Arquivo */}
        <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        />

        {/* Botão Importar */}
        <button 
            onClick={handleImportClick}
            className="bg-green-600 text-white px-4 h-10 rounded-lg font-bold text-xs uppercase hover:bg-green-700 transition-colors shadow-sm shadow-green-200 flex items-center gap-2 justify-center"
        >
            <span className="material-icons-round text-sm">upload_file</span>
            Importar
        </button>

        {/* Botão Novo */}
        <button onClick={handleNew} className="bg-blue-600 text-white px-6 h-10 rounded-lg font-bold text-xs uppercase hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200 whitespace-nowrap">
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
                <th className="px-6 py-3 font-bold">Equipe/Setor</th>
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
                    <span className={`${getEquipeColor(policial.equipe)} px-2 py-1 rounded text-[10px] font-bold uppercase`}>
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
            <p className="text-slate-400 text-xs mt-1">
              {search ? 'Tente buscar por outro nome ou matrícula.' : 'Tente alterar o filtro de equipe.'}
            </p>
          </div>
        )}
      </div>

      {/* Modal de Gerenciamento de Equipes */}
      {isTeamManagerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-slate-800 p-5 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <span className="material-icons-round text-2xl">edit_note</span>
                <div>
                  <h3 className="font-bold text-lg">Gerenciar Equipes</h3>
                  <p className="text-[10px] opacity-80 uppercase tracking-wider">Editar Nomes</p>
                </div>
              </div>
              <button onClick={() => setIsTeamManagerOpen(false)} className="hover:bg-white/20 p-1 rounded transition-colors"><span className="material-icons-round">close</span></button>
            </div>
            
            <div className="p-0 max-h-[60vh] overflow-y-auto">
                <table className="w-full text-left">
                    <tbody className="divide-y divide-slate-100">
                        {availableTeams.map((team) => (
                            <tr key={team} className="hover:bg-slate-50">
                                <td className="px-6 py-3">
                                    {teamToEdit === team ? (
                                        <div className="flex items-center gap-2">
                                            <input 
                                                value={newTeamName}
                                                onChange={(e) => setNewTeamName(e.target.value)}
                                                className="w-full bg-white border border-blue-400 rounded px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                                                autoFocus
                                            />
                                            <button onClick={saveTeamName} className="p-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors" title="Salvar">
                                                <span className="material-icons-round text-sm">check</span>
                                            </button>
                                            <button onClick={cancelEditTeam} className="p-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors" title="Cancelar">
                                                <span className="material-icons-round text-sm">close</span>
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium text-slate-700 text-sm">{team}</span>
                                            <button onClick={() => startEditingTeam(team)} className="text-slate-400 hover:text-blue-600 p-1" title="Renomear">
                                                <span className="material-icons-round text-sm">edit</span>
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 text-xs text-center text-slate-500">
                Ao renomear uma equipe, todos os policiais vinculados a ela serão atualizados automaticamente.
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição/Criação de Policial */}
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
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Equipe / Setor</label>
                      <button 
                        type="button" 
                        onClick={() => setIsCustomTeam(!isCustomTeam)}
                        className="text-[10px] font-bold text-blue-600 hover:text-blue-800 uppercase"
                      >
                        {isCustomTeam ? 'Selecionar da Lista' : '+ Nova Equipe'}
                      </button>
                    </div>
                    {isCustomTeam ? (
                      <input 
                        name="equipe"
                        value={formData.equipe}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-blue-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-600 outline-none placeholder-slate-400"
                        placeholder="Digite o nome da nova equipe..."
                        autoFocus
                      />
                    ) : (
                      <select 
                        name="equipe"
                        value={formData.equipe}
                        onChange={handleInputChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                      >
                        {availableTeams.map(team => (
                          <option key={team} value={team}>{team}</option>
                        ))}
                      </select>
                    )}
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