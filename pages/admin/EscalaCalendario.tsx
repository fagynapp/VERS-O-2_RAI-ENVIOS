import React, { useState } from 'react';
import { usePoliceData, Policial } from '../../contexts/PoliceContext';

interface DispensaRegistro {
  id: string;
  policial: string;
  matricula: string;
  tipo: string;
  obs: string;
}

interface BatchEntry {
  equipe: string;
  matricula: string;
  nome: string;
  data: string;
}

const AdminEscala = () => {
  const { policiais, availableTeams } = usePoliceData(); // Consumindo do banco de dados global
  const [selectedTeam, setSelectedTeam] = useState('ALPHA');
  
  // Estado para Navegação do Calendário
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1)); // Inicia em Janeiro 2026

  // Dados derivados da data atual
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-11
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const currentMonthStr = currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' }).toUpperCase();
  
  // Helpers de Data
  const getDateKey = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(null);
  };
  
  // Estado para armazenar as dispensas (Chave: "YYYY-MM-DD", Valor: array de dispensas)
  const [registros, setRegistros] = useState<Record<string, DispensaRegistro[]>>({});
  
  // Estado para dias bloqueados (Chave: "YYYY-MM-DD", Valor: Motivo)
  const [blockedDays, setBlockedDays] = useState<Record<string, string>>({});

  // Controle de Modais e Modos de Interação
  const [viewMode, setViewMode] = useState<'none' | 'options' | 'form' | 'block-form' | 'batch-register'>('none');
  const [interactionMode, setInteractionMode] = useState<'normal' | 'blocking'>('normal');

  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  
  // --- Estados para Bloqueio em Lote (Datas) ---
  const [showBatchBlock, setShowBatchBlock] = useState(false);
  const [batchDates, setBatchDates] = useState<string[]>(['', '', '', '', '']);
  const [batchReason, setBatchReason] = useState('');

  // --- Estados para Registro em Lote (Policiais) ---
  const initialBatchEntries = Array(5).fill(null).map(() => ({ equipe: 'ALPHA', matricula: '', nome: '', data: '' }));
  const [batchEntries, setBatchEntries] = useState<BatchEntry[]>(initialBatchEntries);

  // Form de Dispensa Individual
  const [formData, setFormData] = useState({
    policial: '',
    matricula: '',
    tipo: 'CPC (Fila)',
    obs: ''
  });

  // Form de Bloqueio Individual
  const [blockReason, setBlockReason] = useState('');
  
  // Estado para sugestões de busca
  const [suggestions, setSuggestions] = useState<Policial[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Lógica de Escala (Baseada em Época para consistência entre meses)
  const getDayStatus = (day: number) => {
    const cycle = ['DELTA', 'ALPHA', 'BRAVO', 'CHARLIE'];
    const epoch = new Date(2026, 0, 1); // Referência: 01/01/2026 é DELTA
    const target = new Date(year, month, day);
    
    const diffTime = target.getTime() - epoch.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Cálculo do índice cíclico seguro para datas passadas e futuras
    const teamIndex = ((diffDays % 4) + 4) % 4;
    
    const teamOnDuty = cycle[teamIndex];
    return teamOnDuty === selectedTeam ? 'ORDINÁRIO' : 'FOLGA';
  };

  const handleDayClick = (day: number) => {
    setSelectedDay(day);

    if (interactionMode === 'blocking') {
      handleBlockAction(day);
    } else {
      setViewMode('options');
    }
  };

  const handleBlockAction = (day: number) => {
    const key = getDateKey(day);
    if (blockedDays[key]) {
      setBlockedDays(prev => {
        const newBlocked = { ...prev };
        delete newBlocked[key];
        return newBlocked;
      });
      if (viewMode === 'options') setViewMode('none');
    } else {
      setSelectedDay(day);
      setBlockReason('');
      setViewMode('block-form');
    }
  };

  const handleSaveBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDay !== null) {
      const key = getDateKey(selectedDay);
      setBlockedDays(prev => ({
        ...prev,
        [key]: blockReason.toUpperCase() || "BLOQUEIO ADM"
      }));
      setViewMode('none');
    }
  };

  // --- Funções de Bloqueio em Lote (Datas) ---
  const handleBatchDateChange = (index: number, value: string) => {
    const newDates = [...batchDates];
    newDates[index] = value;
    setBatchDates(newDates);
  };

  const handleSaveBatchBlock = (e: React.FormEvent) => {
    e.preventDefault();
    const newBlocked = { ...blockedDays };
    let processedCount = 0;
    const motivo = batchReason.toUpperCase() || "BLOQUEIO LOTE";

    batchDates.forEach(dateStr => {
      if (!dateStr) return;
      // Usa a data (YYYY-MM-DD) diretamente como chave
      newBlocked[dateStr] = motivo;
      processedCount++;
    });

    if (processedCount > 0) {
      setBlockedDays(newBlocked);
      alert(`${processedCount} datas bloqueadas com sucesso!`);
      setShowBatchBlock(false);
      setBatchDates(['', '', '', '', '']);
      setBatchReason('');
    } else {
      alert("Nenhuma data selecionada.");
    }
  };

  // --- Funções de Registro em Lote (Policiais) ---
  const handleBatchEntryChange = (index: number, field: keyof BatchEntry, value: string) => {
    const newEntries = [...batchEntries];
    let newValue = value;

    // Lógica Específica para Matrícula: Apenas números, max 5 dígitos
    if (field === 'matricula') {
      newValue = value.replace(/\D/g, '').slice(0, 5);
      
      // Atualiza o valor da matrícula
      newEntries[index] = { ...newEntries[index], [field]: newValue };

      // Busca automática no "Banco de Dados" (Context)
      if (newValue.length >= 2) {
        const policialEncontrado = policiais.find(p => p.matricula === newValue);
        if (policialEncontrado) {
          newEntries[index].nome = policialEncontrado.nome;
          // Se a equipe também for preenchida automaticamente, podemos fazer aqui:
          if (availableTeams.includes(policialEncontrado.equipe)) {
             newEntries[index].equipe = policialEncontrado.equipe;
          }
        } else {
          newEntries[index].nome = ''; // Limpa se não encontrar
        }
      } else {
        newEntries[index].nome = '';
      }
    } else {
      newEntries[index] = { ...newEntries[index], [field]: newValue };
    }
    
    setBatchEntries(newEntries);
  };

  const handleSaveBatchRegisters = (e: React.FormEvent) => {
    e.preventDefault();
    const novosRegistros = { ...registros };
    let count = 0;

    batchEntries.forEach(entry => {
      if (entry.matricula && entry.nome && entry.data) {
        const key = entry.data; // A data do input type="date" já é YYYY-MM-DD
          
        const novoRegistro: DispensaRegistro = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            policial: entry.nome,
            matricula: entry.matricula,
            tipo: 'LOTE (Admin)',
            obs: `Equipe: ${entry.equipe}`
        };

        const registrosDoDia = novosRegistros[key] || [];
        novosRegistros[key] = [...registrosDoDia, novoRegistro];
        count++;
      }
    });

    if (count > 0) {
      setRegistros(novosRegistros);
      alert(`${count} dispensa(s) registrada(s) com sucesso!`);
      setBatchEntries(Array(5).fill(null).map(() => ({ equipe: 'ALPHA', matricula: '', nome: '', data: '' })));
      setViewMode('none');
    } else {
      alert("Nenhum registro completo encontrado.\nCertifique-se de preencher: Matrícula, Nome e Data.");
    }
  };

  // Funções do Menu de Opções
  const handleOptionRegistrar = () => {
    setFormData({ policial: '', matricula: '', tipo: 'CPC (Fila)', obs: '' });
    setSuggestions([]);
    setShowSuggestions(false);
    setViewMode('form');
  };

  const handleOptionBloquear = () => {
    if (selectedDay) {
      handleBlockAction(selectedDay);
    }
  };

  const handleOptionCancelarDispensas = () => {
    if (selectedDay && window.confirm(`Deseja cancelar TODAS as dispensas do dia ${selectedDay}?`)) {
      const key = getDateKey(selectedDay);
      setRegistros(prev => {
        const novo = { ...prev };
        delete novo[key];
        return novo;
      });
      setViewMode('none');
    }
  };

  // Funções do Formulário Individual
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Busca Inteligente no Formulário Individual
  const handlePolicialSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, policial: value }));

    if (value.length > 0) {
      // Busca no Contexto Global
      const filtered = policiais.filter(p => 
        p.nome.toLowerCase().includes(value.toLowerCase()) || 
        p.matricula.includes(value)
      ).slice(0, 5); // Limita a 5 sugestões
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectPolicial = (policial: Policial) => {
    setFormData(prev => ({
      ...prev,
      policial: policial.nome,
      matricula: policial.matricula,
      obs: prev.obs ? `${prev.obs} (Equipe: ${policial.equipe})` : `Equipe: ${policial.equipe}`
    }));
    setShowSuggestions(false);
  };

  const handleSaveDispensa = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDay !== null) {
      const key = getDateKey(selectedDay);
      const novoRegistro: DispensaRegistro = {
        ...formData,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };

      setRegistros(prev => {
        const registrosDoDia = prev[key] || [];
        return {
          ...prev,
          [key]: [...registrosDoDia, novoRegistro]
        };
      });
      alert(`Dispensa registrada com sucesso para o dia ${selectedDay}!`);
      setViewMode('none');
    }
  };

  const handleRemoveDispensaIndividual = (e: React.MouseEvent, day: number, id: string) => {
    e.preventDefault();
    e.nativeEvent.stopImmediatePropagation();
    e.stopPropagation();
    
    if (window.confirm('Tem certeza que deseja remover esta dispensa?')) {
      const key = getDateKey(day);
      setRegistros(prev => {
        const registrosAtuais = prev[key] || [];
        const novosRegistros = registrosAtuais.filter(registro => registro.id !== id);
        return { ...prev, [key]: novosRegistros };
      });
    }
  };

  // Funções da Toolbar
  const toggleBlockingMode = () => {
    setInteractionMode(prev => prev === 'blocking' ? 'normal' : 'blocking');
    setViewMode('none');
  };

  const handleToolbarCancel = () => {
    setInteractionMode('normal');
    setViewMode('none');
    setSelectedDay(null);
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Escala & Calendário</h2>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Efetivo no Mês', value: policiais.length.toString(), icon: 'groups', color: 'bg-blue-50 text-blue-500' },
          { label: 'Folgas Registradas', value: Object.values(registros).flat().length.toString(), icon: 'calendar_today', color: 'bg-orange-50 text-orange-500' },
          { label: 'Dias Bloqueados', value: Object.keys(blockedDays).length.toString(), icon: 'lock', color: 'bg-red-50 text-red-500' },
          { label: 'Status Escala', value: 'ABERTA', icon: 'lock_open', color: 'bg-slate-50 text-slate-500', isText: true }
        ].map((item, idx) => (
          <div key={idx} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">{item.label}</p>
              <p className={`text-2xl ${item.isText ? 'font-black text-slate-700 text-xl' : 'font-bold text-slate-800'}`}>{item.value}</p>
            </div>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.color}`}>
              <span className="material-icons-round text-2xl">{item.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Barra de Ferramentas */}
      <div className="bg-white rounded-xl p-2 border border-slate-200 flex flex-wrap items-center justify-between shadow-sm gap-4">
        <div className="flex items-center gap-2 pl-2 border-r border-slate-100 pr-6 h-10">
          <button onClick={handlePrevMonth} className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors"><span className="material-icons-round">chevron_left</span></button>
          <span className="text-xs font-black text-slate-700 uppercase min-w-[150px] text-center">{currentMonthStr}</span>
          <button onClick={handleNextMonth} className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors"><span className="material-icons-round">chevron_right</span></button>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          {['ALPHA', 'BRAVO', 'CHARLIE', 'DELTA'].map((team) => (
            <button key={team} onClick={() => setSelectedTeam(team)} className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${selectedTeam === team ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>{team}</button>
          ))}
        </div>
        <div className="flex items-center gap-2 pr-2 border-l border-slate-100 pl-6 h-10">
          <button onClick={() => setShowBatchBlock(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors border border-orange-100">
            <span className="material-icons-round text-sm">date_range</span><span className="text-[10px] font-bold uppercase">Bloqueio em Lote</span>
          </button>
          <button onClick={() => setViewMode('batch-register')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
            <span className="material-icons-round text-sm">playlist_add</span><span className="text-[10px] font-bold uppercase">Registrar em Lote</span>
          </button>
        </div>
      </div>

      {/* Grid do Calendário */}
      <div className={`bg-white shadow-lg rounded-b-xl border border-slate-200 overflow-hidden ${interactionMode === 'blocking' ? 'cursor-not-allowed' : ''}`}>
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
          {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'].map(day => (
            <div key={day} className="h-10 flex items-center justify-center text-[10px] font-black text-slate-400 uppercase tracking-wider">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 bg-slate-100 gap-px border-b border-slate-200">
           {[...Array(daysInMonth)].map((_, i) => {
             const day = i + 1;
             const dateKey = getDateKey(day);
             const status = getDayStatus(day);
             const isOrdinario = status === 'ORDINÁRIO';
             const blockReason = blockedDays[dateKey];
             const isBlocked = !!blockReason;
             const dispensasDoDia = registros[dateKey] || [];
             
             return (
               <div key={day} onClick={() => handleDayClick(day)} className={`min-h-[112px] p-2 relative flex flex-col justify-between transition-colors hover:bg-blue-50/50 cursor-pointer group ${isBlocked ? 'bg-slate-100' : isOrdinario ? 'bg-blue-50/30' : 'bg-white'}`}>
                 {isBlocked && <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#fee2e2_10px,#fee2e2_20px)] opacity-50 z-0" />}
                 <div className="flex justify-between items-start z-10">
                    <span className={`text-sm font-bold ${isBlocked ? 'text-red-400' : isOrdinario ? 'text-blue-700' : 'text-slate-400'}`}>{day}</span>
                    <div className={`transition-opacity ${isBlocked || interactionMode === 'blocking' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                      {isBlocked || interactionMode === 'blocking' ? (<span className={`material-icons-round text-lg ${isBlocked ? 'text-red-500' : 'text-slate-300'}`}>lock</span>) : (<span className="material-icons-round text-slate-300 text-lg">more_horiz</span>)}
                    </div>
                 </div>
                 <div className="flex flex-col gap-1 mt-1 z-10">
                   {isBlocked ? (
                      <div className="bg-red-100 text-red-700 border border-red-200 px-2 py-1 rounded text-[9px] font-black uppercase text-center w-full shadow-sm">
                        <div className="flex items-center justify-center gap-1"><span className="material-icons-round text-[10px]">lock</span><span className="truncate">{blockReason}</span></div>
                      </div>
                   ) : isOrdinario ? (
                     <div className="bg-blue-600 text-white px-2 py-0.5 rounded text-[8px] font-bold uppercase text-center shadow-sm w-full">Ordinário</div>
                   ) : (<div className="bg-slate-100 text-slate-400 px-2 py-0.5 rounded text-[8px] font-bold uppercase text-center w-full">Folga</div>)}
                   {!isBlocked && dispensasDoDia.map((disp) => (
                     <div key={disp.id} className="bg-orange-50 border border-orange-200 rounded px-1.5 py-1 shadow-sm mt-0.5 relative group/dispensa">
                       <div className="pr-3">
                         <p className="text-[9px] font-black text-slate-800 leading-tight truncate" title={disp.policial}>{disp.policial}</p>
                         <p className="text-[8px] font-bold text-orange-600 leading-tight mt-0.5">{disp.matricula} | {disp.tipo.split(' ')[0]}</p>
                       </div>
                       <button type="button" onClick={(e) => handleRemoveDispensaIndividual(e, day, disp.id)} className="absolute top-0.5 right-0.5 z-20 text-orange-300 hover:text-red-500 hover:bg-red-50 rounded-full p-1 transition-all opacity-0 group-hover/dispensa:opacity-100">
                         <span className="material-icons-round text-[10px] font-bold block">close</span>
                       </button>
                     </div>
                   ))}
                 </div>
               </div>
             )
           })}
        </div>
      </div>

      {/* Modal: Registro em Lote (Formulário) */}
      {viewMode === 'batch-register' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-blue-600 p-5 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <span className="material-icons-round text-2xl">playlist_add</span>
                <div>
                  <h3 className="font-bold text-lg">Registro em Lote</h3>
                  <p className="text-[10px] opacity-80 uppercase tracking-wider">Cadastro Múltiplo de Dispensas</p>
                </div>
              </div>
              <button onClick={() => setViewMode('none')} className="hover:bg-white/20 p-1 rounded transition-colors"><span className="material-icons-round">close</span></button>
            </div>

            <form onSubmit={handleSaveBatchRegisters} className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-bold text-slate-500 uppercase border-b border-slate-200">
                      <th className="pb-3 px-2 w-32">Equipe</th>
                      <th className="pb-3 px-2 w-40">Matrícula (Busca)</th>
                      <th className="pb-3 px-2">Policial (Auto)</th>
                      <th className="pb-3 px-2 w-40">Data Dispensa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {batchEntries.map((entry, index) => (
                      <tr key={index}>
                        <td className="py-2 px-2">
                          <select 
                            value={entry.equipe}
                            onChange={(e) => handleBatchEntryChange(index, 'equipe', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-2 text-xs font-bold outline-none focus:ring-1 focus:ring-blue-500 uppercase"
                          >
                            {availableTeams.map(team => (
                                <option key={team} value={team}>{team}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-2 px-2">
                          <input 
                            value={entry.matricula}
                            onChange={(e) => handleBatchEntryChange(index, 'matricula', e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500 uppercase placeholder-slate-400"
                            placeholder="00000"
                            maxLength={5}
                          />
                        </td>
                        <td className="py-2 px-2">
                          <input 
                            value={entry.nome}
                            readOnly
                            className="w-full bg-slate-100 border border-slate-200 rounded px-3 py-2 text-xs font-bold text-slate-600 outline-none uppercase"
                            placeholder="AGUARDANDO MATRÍCULA..."
                          />
                        </td>
                        <td className="py-2 px-2">
                          <input 
                            type="date"
                            value={entry.data}
                            onChange={(e) => handleBatchEntryChange(index, 'data', e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg text-xs text-blue-800 mt-4 flex gap-2 items-center">
                <span className="material-icons-round text-lg">info</span>
                <span>Digite os 5 números da matrícula para identificação automática usando o Banco de Dados.</span>
              </div>

              <div className="flex gap-3 justify-end pt-6 border-t border-slate-100 mt-4">
                <button type="button" onClick={() => setViewMode('none')} className="px-4 py-2 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">Cancelar</button>
                <button type="submit" className="px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg shadow-blue-200 transition-colors">Processar Lote</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Outros Modais (Opções do dia, Bloqueio, Form Individual) mantidos */}
      {viewMode === 'options' && selectedDay !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={() => setViewMode('none')}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden scale-100 animate-[fadeIn_0.2s_ease-out]" onClick={e => e.stopPropagation()}>
            <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Opções: Dia {selectedDay}</h3>
              <button onClick={() => setViewMode('none')} className="text-slate-400 hover:text-slate-600"><span className="material-icons-round">close</span></button>
            </div>
            <div className="p-4 space-y-3">
              <button onClick={handleOptionRegistrar} className="w-full flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors group">
                <div className="bg-white p-2 rounded-md shadow-sm text-blue-600 group-hover:scale-110 transition-transform"><span className="material-icons-round">edit_calendar</span></div>
                <div className="text-left"><span className="block text-sm font-bold uppercase">Registrar</span><span className="text-[10px] opacity-70">Adicionar dispensa manualmente</span></div>
              </button>
              <button onClick={handleOptionBloquear} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors group ${blockedDays[getDateKey(selectedDay)] ? 'bg-green-50 hover:bg-green-100 text-green-700' : 'bg-red-50 hover:bg-red-100 text-red-700'}`}>
                <div className={`bg-white p-2 rounded-md shadow-sm group-hover:scale-110 transition-transform ${blockedDays[getDateKey(selectedDay)] ? 'text-green-600' : 'text-red-600'}`}><span className="material-icons-round">{blockedDays[getDateKey(selectedDay)] ? 'lock_open' : 'lock'}</span></div>
                <div className="text-left"><span className="block text-sm font-bold uppercase">{blockedDays[getDateKey(selectedDay)] ? 'Desbloquear Data' : 'Bloquear Data'}</span><span className="text-[10px] opacity-70">{blockedDays[getDateKey(selectedDay)] ? 'Permitir registros' : 'Impedir registros neste dia'}</span></div>
              </button>
              {(registros[getDateKey(selectedDay)] || []).length > 0 && (
                <button onClick={handleOptionCancelarDispensas} className="w-full flex items-center gap-3 p-3 bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-lg transition-colors group border border-slate-100 hover:border-red-100">
                  <div className="bg-white p-2 rounded-md shadow-sm text-slate-400 group-hover:text-red-500 group-hover:scale-110 transition-transform"><span className="material-icons-round">delete_sweep</span></div>
                  <div className="text-left"><span className="block text-sm font-bold uppercase">Cancelar Dispensas</span><span className="text-[10px] opacity-70">Limpar todos os registros do dia</span></div>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {showBatchBlock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-orange-600 p-5 flex justify-between items-center text-white">
              <div className="flex items-center gap-3"><span className="material-icons-round text-2xl">date_range</span><div><h3 className="font-bold text-lg">Bloqueio em Lote</h3><p className="text-[10px] opacity-80 uppercase tracking-wider">Múltiplas datas</p></div></div>
              <button onClick={() => setShowBatchBlock(false)} className="hover:bg-white/20 p-1 rounded transition-colors"><span className="material-icons-round">close</span></button>
            </div>
            <form onSubmit={handleSaveBatchBlock} className="p-6 space-y-4">
              <div className="bg-orange-50 border border-orange-100 p-3 rounded-lg text-xs text-orange-800 mb-2"><strong>Instrução:</strong> Selecione até 5 datas para bloquear simultaneamente com o mesmo motivo.</div>
              <div className="space-y-3">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Datas para Bloqueio</label>
                {batchDates.map((date, index) => (
                  <input key={index} type="date" value={date} onChange={(e) => handleBatchDateChange(index, e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-700 outline-none focus:ring-1 focus:ring-orange-500" />
                ))}
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Motivo (Aplicado a todas)</label>
                <input value={batchReason} onChange={(e) => setBatchReason(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-orange-500 uppercase" placeholder="EX: OPERAÇÃO ESPECIAL" required />
              </div>
              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowBatchBlock(false)} className="px-4 py-2 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">Cancelar</button>
                <button type="submit" className="px-6 py-2 text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-lg shadow-orange-200 transition-colors">Confirmar Bloqueios</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewMode === 'block-form' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-red-600 p-5 flex justify-between items-center text-white">
              <div className="flex items-center gap-3"><span className="material-icons-round text-2xl">lock</span><div><h3 className="font-bold text-lg">Bloquear Data</h3><p className="text-[10px] opacity-80 uppercase tracking-wider">Dia {selectedDay} de {currentMonthStr}</p></div></div>
              <button onClick={() => setViewMode('none')} className="hover:bg-white/20 p-1 rounded transition-colors"><span className="material-icons-round">close</span></button>
            </div>
            <form onSubmit={handleSaveBlock} className="p-6 space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Motivo do Bloqueio</label>
                <input autoFocus value={blockReason} onChange={(e) => setBlockReason(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-red-500 uppercase" placeholder="EX: JOGO, TREINAMENTO, FERIADO..." required />
                <p className="text-[10px] text-slate-400 mt-2">Esta ação impedirá o registro de dispensas ordinárias para este dia.</p>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setViewMode('none')} className="px-4 py-2 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">Cancelar</button>
                <button type="submit" className="px-6 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-lg shadow-red-200 transition-colors">Confirmar Bloqueio</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewMode === 'form' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-visible">
            <div className="bg-blue-600 p-5 flex justify-between items-center text-white rounded-t-xl">
              <div className="flex items-center gap-3"><span className="material-icons-round text-2xl">edit_calendar</span><div><h3 className="font-bold text-lg">Registrar Dispensa Manual</h3><p className="text-[10px] opacity-80 uppercase tracking-wider">Dia {selectedDay} de {currentMonthStr}</p></div></div>
              <button onClick={() => setViewMode('none')} className="hover:bg-white/20 p-1 rounded transition-colors"><span className="material-icons-round">close</span></button>
            </div>
            <form onSubmit={handleSaveDispensa} className="p-8 space-y-6">
              <div className="relative">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Policial</label>
                <input name="policial" value={formData.policial} onChange={handlePolicialSearch} onFocus={() => { if(formData.policial) setShowSuggestions(true); }} className="w-full bg-slate-900 text-white border-2 border-blue-500 rounded-lg px-4 py-3 text-sm font-bold tracking-wide outline-none focus:ring-4 focus:ring-blue-500/20 uppercase" placeholder="DIGITE NOME OU MATRÍCULA..." autoComplete="off" required />
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                    {suggestions.map((policial, idx) => (
                      <button key={idx} type="button" onClick={() => selectPolicial(policial)} className="w-full text-left px-4 py-3 hover:bg-blue-50 flex justify-between items-center border-b border-slate-50 last:border-0">
                        <span className="font-bold text-slate-800 text-xs">{policial.nome}</span><span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{policial.matricula}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Matrícula</label>
                  <input name="matricula" value={formData.matricula} onChange={handleInputChange} className="w-full bg-slate-300/50 border-0 rounded-lg px-4 py-3 text-sm font-bold text-slate-600 outline-none" placeholder="00000" readOnly />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tipo de Dispensa</label>
                  <select name="tipo" value={formData.tipo} onChange={handleInputChange} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm outline-none bg-white focus:border-blue-500 transition-colors">
                    <option value="CPC (Fila)">CPC (Fila)</option>
                    <option value="PROD">Produtividade</option>
                    <option value="Banco de Horas">Banco de Horas</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Observações</label>
                <textarea name="obs" value={formData.obs} onChange={handleInputChange} rows={3} className="w-full bg-slate-950 text-slate-300 border-0 rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-blue-500 outline-none resize-none placeholder-slate-600" placeholder="Justificativa ou detalhes adicionais..." />
              </div>
              <div className="pt-4 flex gap-3 justify-end">
                <button type="button" onClick={() => setViewMode('none')} className="px-6 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">Cancelar</button>
                <button type="submit" className="px-8 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg shadow-blue-200 transition-colors">Salvar Registro</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEscala;