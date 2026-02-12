import React, { useState } from 'react';
import { usePoliceData, DispensaRegistro } from '../../contexts/PoliceContext';

const UserCalendar = () => {
  const { 
    userPoints, 
    setUserPoints, 
    calendarBloqueios, 
    calendarRegistros, 
    setCalendarRegistros
  } = usePoliceData();
  
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1));
  const [showInfoPanel, setShowInfoPanel] = useState(true);
  
  // Estado para controlar a data SELECIONADA pelo clique
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);

  // Mock do usuário logado
  const currentUser = {
    nome: 'SD LUCAS MIGUEL',
    matricula: '39874',
    equipe: 'ALPHA'
  };

  // Dados da data atual
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const currentMonthStr = currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' }).toUpperCase();

  const getDateKey = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDateKey(null); // Limpa seleção ao mudar mês
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDateKey(null); // Limpa seleção ao mudar mês
  };

  // Lógica de Escala
  const getDayStatus = (day: number) => {
    const cycle = ['DELTA', 'ALPHA', 'BRAVO', 'CHARLIE'];
    const epoch = new Date(2026, 0, 1);
    const target = new Date(year, month, day);
    const diffTime = target.getTime() - epoch.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const teamIndex = ((diffDays % 4) + 4) % 4;
    const teamOnDuty = cycle[teamIndex];
    return teamOnDuty === currentUser.equipe ? 'ORDINÁRIO' : 'FOLGA';
  };

  // --- 1. Ação de Clicar no Dia (Apenas Seleciona) ---
  const handleDaySelect = (day: number) => {
    const key = getDateKey(day);
    const status = getDayStatus(day);
    const isBlocked = !!calendarBloqueios[key];

    // Validações imediatas para UX
    if (isBlocked) {
      alert(`DATA BLOQUEADA PELA ADM: ${calendarBloqueios[key]}`);
      return;
    }

    if (status !== 'ORDINÁRIO') {
      alert("Selecione apenas dias de serviço ORDINÁRIO (Azul) para solicitar dispensa.");
      return;
    }

    // Se passou, seleciona a data
    setSelectedDateKey(prev => prev === key ? null : key); // Toggle seleção
  };

  // --- 2. Ação do Botão Lateral (Processa a Lógica) ---
  const handleMainAction = () => {
    if (!selectedDateKey) {
        alert("Por favor, selecione um dia no calendário primeiro.");
        return;
    }

    const dispensasDoDia = calendarRegistros[selectedDateKey] || [];
    const jaTemDispensa = dispensasDoDia.some(d => d.matricula === currentUser.matricula);
    const dataFormatada = selectedDateKey.split('-').reverse().join('/');

    // --- CENÁRIO A: Cancelar Dispensa Existente ---
    if (jaTemDispensa) {
        if(window.confirm(`Deseja CANCELAR sua dispensa do dia ${dataFormatada}?\nOs pontos (100 pts) serão estornados.`)) {
            setCalendarRegistros(prev => {
                const novosRegistros = (prev[selectedDateKey] || []).filter(d => d.matricula !== currentUser.matricula);
                // Se array ficar vazio, deleta a chave
                if (novosRegistros.length === 0) {
                    const copia = { ...prev };
                    delete copia[selectedDateKey];
                    return copia;
                }
                return { ...prev, [selectedDateKey]: novosRegistros };
            });
            setUserPoints(prev => prev + 100);
            alert("Dispensa cancelada com sucesso!");
            setSelectedDateKey(null); // Limpa seleção
        }
        return;
    }

    // --- CENÁRIO B: Solicitar Nova Dispensa ---
    if (userPoints < 100) {
        alert(`Saldo insuficiente (${userPoints} pts). Necessário 100 pontos.`);
        return;
    }

    if (window.confirm(`CONFIRMAR DISPENSA?\n\nData: ${dataFormatada}\nCusto: 100 Pontos`)) {
        const novaDispensa: DispensaRegistro = {
            id: `${Date.now()}-${currentUser.matricula}`,
            policial: currentUser.nome,
            matricula: currentUser.matricula,
            tipo: 'PTS', // Sigla PTS conforme solicitado para produtividade
            obs: 'Solicitação via App',
            equipe: currentUser.equipe
        };

        setCalendarRegistros(prev => ({
            ...prev,
            [selectedDateKey]: [...(prev[selectedDateKey] || []), novaDispensa]
        }));

        setUserPoints(prev => prev - 100);
        alert("Dispensa registrada com sucesso!");
        setSelectedDateKey(null); // Limpa seleção
    }
  };

  // Helpers para o UI do Botão
  const getButtonState = () => {
    if (!selectedDateKey) return { text: 'SELECIONE UMA DATA', color: 'bg-slate-400', icon: 'touch_app', disabled: true };
    
    const dispensasDoDia = calendarRegistros[selectedDateKey] || [];
    const jaTem = dispensasDoDia.some(d => d.matricula === currentUser.matricula);

    if (jaTem) return { text: 'CANCELAR DISPENSA', color: 'bg-red-600 hover:bg-red-700', icon: 'event_busy', disabled: false };
    return { text: 'SOLICITAR DISPENSA', color: 'bg-green-600 hover:bg-green-700', icon: 'check_circle', disabled: false };
  };

  const btnState = getButtonState();

  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-[fadeIn_0.3s_ease-out] pb-10 h-full">
      {/* Lado Esquerdo: Calendário */}
      <div className="flex-1 bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden flex flex-col transition-all duration-300">
        {/* Header */}
        <div className="bg-white p-2 border-b border-slate-200 flex items-center justify-between shadow-sm gap-4">
            <div className="flex items-center gap-2 pl-2 pr-6 h-10">
                <button onClick={handlePrevMonth} className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors"><span className="material-icons-round">chevron_left</span></button>
                <span className="text-xs font-black text-slate-700 uppercase min-w-[150px] text-center">{currentMonthStr}</span>
                <button onClick={handleNextMonth} className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors"><span className="material-icons-round">chevron_right</span></button>
            </div>
            
            <div className="flex items-center gap-2 mr-2">
                <div className="hidden md:flex items-center gap-2 mr-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Minha Escala:</span>
                    <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded border border-blue-100 uppercase">{currentUser.equipe}</span>
                </div>
                <button 
                    onClick={() => setShowInfoPanel(!showInfoPanel)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all text-[10px] font-bold uppercase ${showInfoPanel ? 'bg-slate-50 text-slate-500 border-slate-200' : 'bg-blue-600 text-white border-blue-600'}`}
                >
                    <span className="material-icons-round text-base">{showInfoPanel ? 'last_page' : 'first_page'}</span>
                    <span className="hidden sm:inline">{showInfoPanel ? 'Ocultar' : 'Info & Saldo'}</span>
                </button>
            </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
          {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'].map(day => (
            <div key={day} className="h-10 flex items-center justify-center text-[10px] font-black text-slate-400 uppercase tracking-wider">{day}</div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 bg-slate-100 gap-px border-b border-slate-200 flex-1">
           {calendarDays.map((day, idx) => {
             if (day === null) return <div key={`empty-${idx}`} className="bg-slate-50/50 min-h-[112px]" />;

             const dateKey = getDateKey(day);
             const status = getDayStatus(day);
             const isOrdinario = status === 'ORDINÁRIO';
             const isBlocked = !!calendarBloqueios[dateKey];
             const isSelected = selectedDateKey === dateKey;
             
             const dispensasDoDia = calendarRegistros[dateKey] || [];
             
             return (
               <div 
                  key={day} 
                  onClick={() => handleDaySelect(day)}
                  className={`min-h-[112px] p-2 relative flex flex-col justify-between transition-all cursor-pointer group 
                    ${isSelected ? 'bg-green-50 ring-4 ring-inset ring-green-400 z-20' : ''}
                    ${!isSelected && isBlocked ? 'bg-slate-100 hover:bg-red-50' : !isSelected && isOrdinario ? 'bg-white hover:bg-blue-50' : 'bg-white hover:bg-slate-50'}
                  `}
               >
                 {isBlocked && <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#fee2e2_10px,#fee2e2_20px)] opacity-50 z-0" />}
                 
                 <div className="flex justify-between items-start z-10">
                    <span className={`text-sm font-bold ${isBlocked ? 'text-red-400' : isOrdinario ? 'text-blue-700' : 'text-slate-400'}`}>{String(day).padStart(2, '0')}</span>
                    {isBlocked && <span className="material-icons-round text-red-500 text-sm">lock</span>}
                 </div>

                 <div className="flex flex-col gap-1 mt-1 z-10">
                   {isBlocked ? (
                      <div className="bg-red-100 text-red-700 px-2 py-1 rounded text-[8px] font-black uppercase text-center w-full truncate">{calendarBloqueios[dateKey]}</div>
                   ) : isOrdinario ? (
                     <div className="bg-blue-600 text-white px-2 py-0.5 rounded text-[8px] font-bold uppercase text-center w-full">Ordinário</div>
                   ) : (
                     <div className="bg-slate-100 text-slate-400 px-2 py-0.5 rounded text-[8px] font-bold uppercase text-center w-full">Folga</div>
                   )}
                   
                   {/* Renderiza as dispensas */}
                   {!isBlocked && dispensasDoDia.map(disp => (
                     <div 
                        key={disp.id} 
                        className={`border rounded px-1.5 py-1 shadow-sm mt-0.5 text-left relative group/dispensa
                            ${disp.matricula === currentUser.matricula 
                                ? 'bg-[#fff7ed] border-[#ffedd5]' // Estilo Laranja claro para o usuário (conforme imagem)
                                : 'bg-slate-50 border-slate-200'  // Estilo padrão para outros
                            }`}
                     >
                         <p className="text-[9px] font-black text-slate-900 leading-tight truncate uppercase">{disp.policial}</p>
                         <p className="text-[8px] font-bold text-orange-600 leading-tight mt-0.5">
                             {disp.matricula} | {disp.equipe || currentUser.equipe} {disp.tipo === 'PTS' ? '| PTS' : ''}
                         </p>
                     </div>
                   ))}
                 </div>
               </div>
             )
           })}
        </div>
      </div>

      {/* Lado Direito: Info e Ação */}
      {showInfoPanel && (
        <div className="w-full lg:w-80 shrink-0 flex flex-col gap-5 animate-[fadeInRight_0.2s_ease-out]">
            {/* Card Saldo */}
            <div className="bg-blue-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden group">
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                    <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                        <span className="material-icons-round text-xl">loyalty</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Saldo Disponível</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black">{userPoints}</span>
                    <span className="text-xs uppercase font-bold opacity-80 tracking-tighter">Pontos</span>
                    </div>
                </div>
                <span className="material-icons-round absolute -right-4 -bottom-4 text-[120px] opacity-10 group-hover:scale-110 transition-transform duration-500">workspace_premium</span>
            </div>

            {/* --- BOTÃO DE AÇÃO DINÂMICO --- */}
            <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                <button
                onClick={handleMainAction}
                disabled={btnState.disabled}
                className={`w-full py-4 rounded-lg shadow-md flex items-center justify-center gap-3 transition-all transform active:scale-95 group relative overflow-hidden ${btnState.color} ${btnState.disabled ? 'cursor-not-allowed opacity-80' : 'text-white'}`}
                >
                <div className="text-left flex items-center gap-3">
                    <div className="p-2 bg-black/10 rounded-lg backdrop-blur-sm">
                        <span className="material-icons-round text-2xl">{btnState.icon}</span>
                    </div>
                    <div>
                        <span className="block text-[9px] font-bold uppercase opacity-80 tracking-wider">Ação</span>
                        <span className="block text-sm font-black tracking-tight leading-none">{btnState.text}</span>
                    </div>
                </div>
                </button>
                {selectedDateKey && (
                    <div className="text-center mt-2 pb-1">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Data Selecionada: <span className="text-blue-600">{selectedDateKey.split('-').reverse().join('/')}</span></p>
                    </div>
                )}
            </div>

            {/* Painel de Informações */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex-1">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                    <span className="material-icons-round text-blue-600">info</span>
                    <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest">Informações</h4>
                </div>
                
                <div className="space-y-4">
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                        <p className="text-[10px] font-bold text-blue-800 uppercase mb-1">Passo a Passo</p>
                        <ol className="text-[10px] text-blue-700 leading-relaxed list-decimal list-inside space-y-1">
                            <li>Clique em um dia <span className="font-bold">ORDINÁRIO (Azul)</span>.</li>
                            <li>Verifique a data selecionada no painel.</li>
                            <li>Clique no botão <span className="font-bold">SOLICITAR DISPENSA</span>.</li>
                        </ol>
                    </div>

                    <div className="p-3 bg-orange-50 border border-orange-100 rounded-lg flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                            <span className="material-icons-round text-sm">check_circle</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-orange-800 uppercase">Confirmado</p>
                            <p className="text-[9px] text-orange-700">Dispensas de Produtividade serão marcadas com <span className="font-bold">PTS</span>.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default UserCalendar;