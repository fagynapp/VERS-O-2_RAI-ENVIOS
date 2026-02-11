import React, { useState, useMemo, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { usePoliceData } from '../../contexts/PoliceContext';

interface RankingData {
  id: number;
  nome: string;
  matricula: string;
  equipe: string;
  raisValidados: number;
  pontuacao: number;
}

const AdminRanking = () => {
  const { policiais, availableTeams } = usePoliceData();
  
  const [search, setSearch] = useState('');
  const [selectedEquipe, setSelectedEquipe] = useState('TODAS');

  // --- Estados do Filtro de Datas Personalizado ---
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeFilterLabel, setActiveFilterLabel] = useState('Mensal'); // Default para mensal
  
  // Controles de Visibilidade dos Menus
  const [showDatePickerMenu, setShowDatePickerMenu] = useState(false);
  const [showCustomDateModal, setShowCustomDateModal] = useState(false);

  // Estados temporários para o Modal Personalizado
  const [tempStartDate, setTempStartDate] = useState('');
  const [tempEndDate, setTempEndDate] = useState('');
  const [noEndDate, setNoEndDate] = useState(false);

  // Estado para armazenar edições manuais de produtividade (simulando persistência)
  const [productivityOverrides, setProductivityOverrides] = useState<Record<number, { rais: number, pontos: number }>>({});

  // Estados do Modal de Edição de Pontos
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    matricula: '',
    equipe: '',
    rais: 0,
    pontos: 0
  });

  // --- Estados do Modal de Exportação ---
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<'excel' | 'pdf'>('excel');
  // Alterado de string única para array de strings para permitir múltiplas seleções
  const [selectedExportTeams, setSelectedExportTeams] = useState<string[]>([]);

  // Inicializa com o mês atual
  useEffect(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  }, []);

  // Fecha o menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showDatePickerMenu && !target.closest('.date-picker-container')) {
        setShowDatePickerMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDatePickerMenu]);

  // --- Lógica de Filtros de Data ---
  const setDateRange = (daysBackStart: number, daysBackEnd: number) => {
    const end = new Date();
    end.setDate(end.getDate() - daysBackEnd);
    const start = new Date();
    start.setDate(start.getDate() - daysBackStart);
    
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  };

  const setMonthRange = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  };

  const setQuarterRange = () => {
    const now = new Date();
    const quarter = Math.floor((now.getMonth() + 3) / 3);
    const start = new Date(now.getFullYear(), (quarter - 1) * 3, 1);
    const end = new Date(now.getFullYear(), quarter * 3, 0);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  };

  const setSemesterRange = () => {
    const now = new Date();
    const semester = now.getMonth() < 6 ? 0 : 6;
    const start = new Date(now.getFullYear(), semester, 1);
    const end = new Date(now.getFullYear(), semester + 6, 0);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  };

  const setFixedYear = (year: number) => {
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  };

  const filterOptions = [
    { label: 'Hoje', action: () => setDateRange(0, 0) },
    { label: 'Semanal', action: () => setDateRange(7, 0) },
    { label: '30 Dias', action: () => setDateRange(30, 0) },
    { label: 'Mensal', action: () => setMonthRange() },
    { label: '3 Meses', action: () => setDateRange(90, 0) },
    { label: 'Trimestral', action: () => setQuarterRange() },
    { label: '6 Meses', action: () => setDateRange(180, 0) },
    { label: 'Semestral', action: () => setSemesterRange() },
    { label: '2026', action: () => setFixedYear(2026) },
    { label: 'Ano', action: () => setFixedYear(new Date().getFullYear()) },
  ];

  const handleFilterClick = (label: string, action?: () => void) => {
    if (label === 'Personalizado') {
        setTempStartDate(startDate);
        setTempEndDate(endDate);
        setNoEndDate(!endDate);
        setShowCustomDateModal(true);
        setShowDatePickerMenu(false);
    } else if (action) {
        action();
        setActiveFilterLabel(label);
        setShowDatePickerMenu(false);
    }
  };

  const applyCustomDate = () => {
      setStartDate(tempStartDate);
      setEndDate(noEndDate ? '' : tempEndDate);
      setActiveFilterLabel('Personalizado');
      setShowCustomDateModal(false);
  };

  // Helper para formatar matrícula
  const formatMatricula = (value: string) => {
    if (!value) return '-';
    const clean = value.replace(/\D/g, '');
    if (clean.length === 5) {
      return clean.replace(/^(\d{2})(\d{3})$/, '$1.$2');
    }
    return value;
  };

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

  // Mock de dados de produtividade com suporte a overrides manuais
  const rankingList = useMemo(() => {
    const generatedData: RankingData[] = policiais.map((p) => {
      // Verifica se existe edição manual para este policial
      if (productivityOverrides[p.id]) {
         return {
            id: p.id,
            nome: p.nome,
            matricula: p.matricula,
            equipe: p.equipe,
            raisValidados: productivityOverrides[p.id].rais,
            pontuacao: productivityOverrides[p.id].pontos
         };
      }

      // Se não houver edição, gera dados mockados (simulação)
      const rais = Math.floor((p.id * 13) % 40); 
      const pts = rais * 10 + Math.floor((p.id * 7) % 50);
      
      return {
        id: p.id,
        nome: p.nome,
        matricula: p.matricula,
        equipe: p.equipe,
        raisValidados: rais,
        pontuacao: pts
      };
    });

    // Ordena por pontuação decrescente (Ranking Global)
    return generatedData.sort((a, b) => b.pontuacao - a.pontuacao);
  }, [policiais, startDate, endDate, productivityOverrides]);

  // Filtragem para exibição
  const filteredRanking = rankingList.filter((item) => {
    // Filtro Texto
    const term = search.toLowerCase();
    const cleanTerm = term.replace(/\D/g, '');
    const cleanMatricula = item.matricula.replace(/\D/g, '');

    const matchesName = item.nome.toLowerCase().includes(term);
    const matchesMatricula = cleanTerm.length > 0 && cleanMatricula.includes(cleanTerm);
    const matchesSearch = term === '' || matchesName || matchesMatricula;

    // Filtro Equipe
    const itemEquipe = item.equipe ? item.equipe.toString().trim().toLowerCase() : '';
    const filtroEquipe = selectedEquipe.trim().toLowerCase();
    const matchesEquipe = selectedEquipe === 'TODAS' || itemEquipe === filtroEquipe;

    return matchesSearch && matchesEquipe;
  });

  // Estatísticas
  const totalPontos = filteredRanking.reduce((acc, curr) => acc + curr.pontuacao, 0);
  const totalRais = filteredRanking.reduce((acc, curr) => acc + curr.raisValidados, 0);
  const topPerformer = rankingList[0]; // Líder global (sem filtros)

  // Função para renderizar ícone de posição
  const renderRankIcon = (index: number) => {
    if (index === 0) return <div className="w-8 h-8 rounded-full bg-yellow-100 border border-yellow-200 flex items-center justify-center text-yellow-600 shadow-sm"><span className="material-icons-round text-lg">emoji_events</span></div>;
    if (index === 1) return <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 shadow-sm"><span className="material-icons-round text-lg">emoji_events</span></div>;
    if (index === 2) return <div className="w-8 h-8 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 shadow-sm"><span className="material-icons-round text-lg">emoji_events</span></div>;
    return <span className="text-slate-500 font-black text-lg">{(index + 1)}º</span>;
  };

  // Handlers de Edição
  const handleEdit = (item: RankingData) => {
    setEditingId(item.id);
    setFormData({
      nome: item.nome,
      matricula: item.matricula,
      equipe: item.equipe,
      rais: item.raisValidados,
      pontos: item.pontuacao
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId !== null) {
      setProductivityOverrides(prev => ({
        ...prev,
        [editingId]: {
          rais: Number(formData.rais),
          pontos: Number(formData.pontos)
        }
      }));
      setIsModalOpen(false);
      setEditingId(null);
    }
  };

  // --- Lógica de Exportação ---
  const handleOpenExportModal = () => {
      // Pré-seleciona as equipes no modal baseado no filtro atual da tela
      if (selectedEquipe === 'TODAS') {
        setSelectedExportTeams([...availableTeams]); // Seleciona todas
      } else {
        setSelectedExportTeams([selectedEquipe]); // Seleciona apenas a atual
      }
      setShowExportModal(true);
  };

  const processExport = () => {
    if (selectedExportTeams.length === 0) {
        alert("Selecione pelo menos uma equipe para exportar.");
        return;
    }

    // Filtra os dados baseados nas equipes selecionadas (checkboxes)
    // Usa a lista global (rankingList) para ter acesso a todos os dados antes do filtro
    const dataToExport = rankingList.filter(item => {
        const itemEquipe = item.equipe?.trim().toLowerCase();
        return selectedExportTeams.some(team => team.trim().toLowerCase() === itemEquipe);
    });

    if (dataToExport.length === 0) {
        alert("Não há dados para exportar com as equipes selecionadas.");
        return;
    }

    const dateStr = new Date().toISOString().split('T')[0];
    
    // Define sufixo do nome do arquivo
    let teamLabel = "Geral";
    if (selectedExportTeams.length === 1) teamLabel = selectedExportTeams[0];
    else if (selectedExportTeams.length < availableTeams.length) teamLabel = "Multiplas_Equipes";

    const filename = `Ranking_Resultados_${teamLabel}_${dateStr}`;

    if (exportFormat === 'excel') {
        const exportData = dataToExport.map((item, index) => ({
            'Posição': index + 1,
            'Policial': item.nome,
            'Matrícula': formatMatricula(item.matricula),
            'Equipe': item.equipe,
            'RAIs Validados': item.raisValidados,
            'Pontuação': item.pontuacao
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Ranking");
        XLSX.writeFile(wb, `${filename}.xlsx`);
    } 
    else if (exportFormat === 'pdf') {
        const doc = new jsPDF();
        
        let headerTeams = selectedExportTeams.length === availableTeams.length ? 'TODAS' : selectedExportTeams.join(', ');
        if (headerTeams.length > 70) headerTeams = headerTeams.substring(0, 67) + '...';

        // Título
        doc.setFontSize(16);
        doc.text("Relatório de Ranking - RAI ENVIOS", 14, 15);
        doc.setFontSize(10);
        doc.text(`Equipe(s): ${headerTeams}`, 14, 22);
        doc.text(`Data Emissão: ${dateStr}`, 14, 27);

        // Tabela
        const tableBody = dataToExport.map((item, index) => [
            index + 1,
            item.nome,
            formatMatricula(item.matricula),
            item.equipe,
            item.raisValidados,
            item.pontuacao
        ]);

        autoTable(doc, {
            head: [['Pos', 'Policial', 'Matrícula', 'Equipe', 'RAIs', 'Pontos']],
            body: tableBody,
            startY: 32,
            theme: 'grid',
            headStyles: { fillColor: [37, 99, 235] }, // Blue-600
        });

        doc.save(`${filename}.pdf`);
    }

    setShowExportModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Título removido */}

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Líder do Período</p>
            <p className="text-lg font-black text-slate-900 mt-1 truncate max-w-[150px]">{topPerformer?.nome || '-'}</p>
            <p className="text-xs font-bold text-green-600">{topPerformer?.pontuacao || 0} pts</p>
          </div>
          <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-500 border border-yellow-100"><span className="material-icons-round">emoji_events</span></div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
          <div><p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Total Pontos</p><span className="text-3xl font-bold text-blue-600">{totalPontos.toLocaleString()}</span></div>
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600"><span className="material-icons-round">stars</span></div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
          <div><p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">RAIs Validados</p><span className="text-3xl font-bold text-slate-700">{totalRais}</span></div>
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600"><span className="material-icons-round">assignment_turned_in</span></div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
          <div><p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Efetivo Listado</p><span className="text-3xl font-bold text-slate-700">{filteredRanking.length}</span></div>
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600"><span className="material-icons-round">groups</span></div>
        </div>
      </div>

      {/* Barra de Ferramentas */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col md:flex-row gap-4 items-center justify-between z-20 relative">
        {/* Busca */}
        <div className="relative w-full md:w-80">
          <span className="material-icons-round absolute left-3 top-2.5 text-slate-400">search</span>
          <input 
            className="w-full h-10 bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-10 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder-slate-400" 
            placeholder="Pesquisar Policial ou Matrícula..." 
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

        {/* Filtros Direita */}
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
           {/* SELETOR DE DATA PERSONALIZADO (NOVO ESTILO CLARO) */}
           <div className="relative date-picker-container">
              <button 
                onClick={() => setShowDatePickerMenu(!showDatePickerMenu)}
                className="h-10 px-4 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-bold uppercase tracking-wide hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm"
              >
                <span className="material-icons-round text-lg text-slate-400">calendar_month</span>
                <span>{activeFilterLabel}</span>
                <span className="material-icons-round text-sm ml-1 text-slate-400">expand_more</span>
              </button>
              
              {/* Dropdown Menu Claro */}
              {showDatePickerMenu && (
                <div className="absolute top-12 right-0 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden py-2 animate-[fadeIn_0.1s_ease-out]">
                  {filterOptions.map((option, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleFilterClick(option.label, option.action)}
                      className="w-full text-left px-4 py-2 text-xs font-bold uppercase text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center justify-between"
                    >
                      {option.label}
                      {activeFilterLabel === option.label && <span className="material-icons-round text-blue-600 text-xs">check</span>}
                    </button>
                  ))}
                  <div className="border-t border-slate-100 my-1"></div>
                  <button 
                    onClick={() => handleFilterClick('Personalizado')}
                    className="w-full text-left px-4 py-2 text-xs font-bold uppercase text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-2"
                  >
                    <span className="material-icons-round text-base">date_range</span>
                    Personalizado
                  </button>
                </div>
              )}
            </div>

           {/* Filtro de Equipe (Tela Principal) */}
           <div className="relative">
              <select
                value={selectedEquipe}
                onChange={(e) => setSelectedEquipe(e.target.value)}
                className="h-10 bg-slate-50 border border-slate-200 rounded-lg px-3 text-xs font-bold uppercase text-slate-600 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none min-w-[150px]"
              >
                <option value="TODAS">TODAS AS EQUIPES</option>
                {availableTeams.map((team) => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>
           </div>
           
           <button onClick={handleOpenExportModal} className="h-10 px-4 bg-slate-800 text-white rounded-lg text-xs font-bold uppercase tracking-wide hover:bg-slate-900 transition-colors flex items-center gap-2">
             <span className="material-icons-round text-lg">download</span>
             <span className="hidden md:inline">Exportar</span>
           </button>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredRanking.length > 0 ? (
            <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-100 text-xs text-slate-500 uppercase">
                <tr>
                <th className="px-6 py-4 font-black text-center text-slate-600 border-r border-slate-200 w-24">Posição</th>
                <th className="px-6 py-4 font-bold">Policial</th>
                <th className="px-6 py-4 font-bold">Matrícula</th>
                <th className="px-6 py-4 font-bold text-center">Equipe</th>
                <th className="px-6 py-4 font-bold text-center">RAIs Validados</th>
                <th className="px-6 py-4 font-bold text-center text-blue-700">Pontuação</th>
                <th className="px-6 py-4 font-bold text-right">Ações</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {filteredRanking.map((policial) => {
                    // Encontra o índice global (posição real) deste policial na lista completa ordenada
                    const globalRank = rankingList.findIndex(p => p.id === policial.id);
                    
                    return (
                    <tr key={policial.id} className={`hover:bg-slate-50 transition-colors ${globalRank < 3 ? 'bg-slate-50/50' : ''}`}>
                        <td className="px-6 py-4 text-center border-r border-slate-100">
                            <div className="flex justify-center">
                                {renderRankIcon(globalRank)}
                            </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-800 uppercase flex items-center gap-3">
                           {/* Avatar placeholder com iniciais */}
                           <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${globalRank < 3 ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-500'}`}>
                              {policial.nome.substring(0,2).toUpperCase()}
                           </div>
                           {policial.nome}
                        </td>
                        <td className="px-6 py-4 font-mono text-slate-600 font-medium">{formatMatricula(policial.matricula)}</td>
                        <td className="px-6 py-4 text-center">
                            <span className={`${getEquipeColor(policial.equipe)} px-2 py-1 rounded text-[10px] font-bold uppercase`}>
                                {policial.equipe}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-center font-bold text-slate-600">
                            {policial.raisValidados}
                        </td>
                        <td className="px-6 py-4 text-center">
                           <span className="font-black text-blue-600 text-lg">{policial.pontuacao}</span> <span className="text-xs font-bold text-blue-400">pts</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <button onClick={() => handleEdit(policial)} className="text-slate-400 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors" title="Editar Resultados">
                                <span className="material-icons-round text-lg">edit_note</span>
                           </button>
                        </td>
                    </tr>
                )})}
            </tbody>
            </table>
        ) : (
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <span className="material-icons-round text-slate-300 text-5xl mb-3">leaderboard</span>
              <p className="text-slate-500 font-medium">Nenhum registro encontrado para este filtro.</p>
              <p className="text-slate-400 text-xs mt-1">
                Verifique o período ou os termos de busca.
              </p>
            </div>
        )}
      </div>

      {/* Modal de Edição (Produtividade) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-blue-600 p-5 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <span className="material-icons-round text-2xl">edit_note</span>
                <div>
                  <h3 className="font-bold text-lg">Editar Produtividade</h3>
                  <p className="text-[10px] opacity-80 uppercase tracking-wider">Ajuste Manual de Resultados</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="hover:bg-white/20 p-1 rounded transition-colors"><span className="material-icons-round">close</span></button>
            </div>

            {/* Aviso sobre dados bloqueados */}
            <div className="bg-blue-50 px-6 py-3 border-b border-blue-100 flex gap-3 items-start">
               <span className="material-icons-round text-blue-500 text-lg mt-0.5">info</span>
               <p className="text-xs text-blue-800 leading-relaxed">
                 <span className="font-bold">Atenção:</span> Ajustes manuais de pontuação refletem imediatamente no ranking.
               </p>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              
              {/* DADOS IDENTIFICAÇÃO (BLOQUEADOS) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Policial</label>
                  <div className="relative">
                    <input 
                        value={formData.nome}
                        readOnly
                        disabled
                        className="w-full bg-slate-100 border border-slate-200 rounded-lg pl-8 pr-4 py-2 text-sm text-slate-500 font-bold outline-none cursor-not-allowed uppercase" 
                    />
                    <span className="material-icons-round absolute left-2 top-2 text-slate-400 text-sm">person</span>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Matrícula</label>
                  <div className="relative">
                    <input 
                        value={formatMatricula(formData.matricula)} 
                        readOnly
                        disabled
                        className="w-full bg-slate-100 border border-slate-200 rounded-lg pl-8 pr-4 py-2 text-sm text-slate-500 font-mono font-bold outline-none cursor-not-allowed" 
                    />
                    <span className="material-icons-round absolute left-2 top-2 text-slate-400 text-sm">badge</span>
                  </div>
                </div>
                 <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Equipe</label>
                  <div className="relative">
                    <input 
                        value={formData.equipe} 
                        readOnly
                        disabled
                        className="w-full bg-slate-100 border border-slate-200 rounded-lg pl-8 pr-4 py-2 text-sm text-slate-500 font-bold outline-none cursor-not-allowed uppercase" 
                    />
                    <span className="material-icons-round absolute left-2 top-2 text-slate-400 text-sm">groups</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 my-2"></div>

              {/* DADOS EDITÁVEIS */}
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">RAIs Validados</span>
                    <input 
                        type="number"
                        name="rais"
                        value={formData.rais}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-slate-300 text-slate-800 font-bold text-xl rounded px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500 text-center"
                    />
                 </div>
                 <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <span className="text-[10px] font-bold text-blue-600 uppercase block mb-1">Pontuação Total</span>
                    <div className="flex items-center">
                        <input 
                            type="number"
                            name="pontos"
                            value={formData.pontos}
                            onChange={handleInputChange}
                            className="w-full bg-white border border-blue-300 text-blue-700 font-black text-xl rounded px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500 text-center"
                        />
                        <span className="text-blue-500 font-bold ml-1 text-xs">pts</span>
                    </div>
                 </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 mt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">Cancelar</button>
                <button type="submit" className="px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg shadow-blue-200 transition-colors">Salvar Alterações</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL DE SELEÇÃO DE DATA (NOVO ESTILO CLARO) */}
      {showCustomDateModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
           <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-[fadeIn_0.2s_ease-out]">
              <div className="p-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50">
                  <span className="material-icons-round text-blue-600">calendar_month</span>
                  <h3 className="font-bold text-slate-800 text-lg">Seleção de Data</h3>
                  <button onClick={() => setShowCustomDateModal(false)} className="ml-auto text-slate-400 hover:text-slate-600 transition-colors">
                      <span className="material-icons-round">close</span>
                  </button>
              </div>
              
              <div className="p-6 space-y-5">
                  <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Data Inicial</label>
                      <div className="relative">
                          <input 
                              type="date"
                              value={tempStartDate}
                              onChange={(e) => setTempStartDate(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                          />
                      </div>
                  </div>

                  <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Data Final</label>
                      <div className="relative">
                          <input 
                              type="date"
                              value={tempEndDate}
                              onChange={(e) => setTempEndDate(e.target.value)}
                              disabled={noEndDate}
                              className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 ${noEndDate ? 'opacity-50 cursor-not-allowed' : ''}`}
                          />
                      </div>
                  </div>

                  <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id="noEndDate"
                        checked={noEndDate}
                        onChange={(e) => setNoEndDate(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="noEndDate" className="text-sm text-slate-600 font-medium cursor-pointer select-none">Sem data final</label>
                  </div>

                  <div className="flex gap-3 pt-2">
                      <button 
                          onClick={applyCustomDate}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition-colors shadow-lg shadow-blue-200"
                      >
                          OK
                      </button>
                      <button 
                          onClick={() => setShowCustomDateModal(false)}
                          className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-2.5 rounded-lg transition-colors"
                      >
                          Cancelar
                      </button>
                  </div>
              </div>
           </div>
        </div>
      )}

      {/* 6. MODAL DE EXPORTAÇÃO */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-[fadeIn_0.2s_ease-out]">
                <div className="bg-slate-800 p-5 flex justify-between items-center text-white">
                    <div className="flex items-center gap-3">
                        <span className="material-icons-round text-2xl">file_download</span>
                        <div>
                            <h3 className="font-bold text-lg">Exportar Dados</h3>
                            <p className="text-[10px] opacity-80 uppercase tracking-wider">Selecione o formato e filtros</p>
                        </div>
                    </div>
                    <button onClick={() => setShowExportModal(false)} className="hover:bg-white/20 p-1 rounded transition-colors">
                        <span className="material-icons-round">close</span>
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Seleção de Formato */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Formato do Arquivo</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button 
                                onClick={() => setExportFormat('excel')}
                                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${exportFormat === 'excel' ? 'border-green-500 bg-green-50 text-green-700' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}
                            >
                                <span className="material-icons-round text-3xl mb-1">table_view</span>
                                <span className="text-xs font-bold uppercase">Excel (.xlsx)</span>
                            </button>
                            <button 
                                onClick={() => setExportFormat('pdf')}
                                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${exportFormat === 'pdf' ? 'border-red-500 bg-red-50 text-red-700' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}
                            >
                                <span className="material-icons-round text-3xl mb-1">picture_as_pdf</span>
                                <span className="text-xs font-bold uppercase">PDF</span>
                            </button>
                        </div>
                    </div>

                    {/* Seleção de Equipes (Multi-select) */}
                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Filtrar por Equipe(s)</label>
                            <button 
                              onClick={() => {
                                if (selectedExportTeams.length === availableTeams.length) setSelectedExportTeams([]);
                                else setSelectedExportTeams([...availableTeams]);
                              }}
                              className="text-[10px] font-bold text-blue-600 hover:text-blue-800 underline"
                            >
                              {selectedExportTeams.length === availableTeams.length ? 'Desmarcar Todas' : 'Marcar Todas'}
                            </button>
                        </div>
                        <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-lg p-2 bg-slate-50 grid grid-cols-2 gap-2">
                            {availableTeams.map(team => (
                                <label key={team} className={`flex items-center gap-2 p-2 rounded cursor-pointer border transition-all ${selectedExportTeams.includes(team) ? 'bg-blue-50 border-blue-200' : 'hover:bg-white border-transparent'}`}>
                                    <input 
                                        type="checkbox"
                                        checked={selectedExportTeams.includes(team)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedExportTeams(prev => [...prev, team]);
                                            } else {
                                                setSelectedExportTeams(prev => prev.filter(t => t !== team));
                                            }
                                        }}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-slate-300"
                                    />
                                    <span className={`text-xs font-bold uppercase ${selectedExportTeams.includes(team) ? 'text-blue-700' : 'text-slate-600'}`}>{team}</span>
                                </label>
                            ))}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-2 text-right">{selectedExportTeams.length} equipes selecionadas</p>
                    </div>

                    <button 
                        onClick={processExport}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-200 transition-colors flex items-center justify-center gap-2"
                    >
                        <span className="material-icons-round">download</span>
                        Confirmar Exportação
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default AdminRanking;