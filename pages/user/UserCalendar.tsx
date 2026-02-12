import React, { useState } from 'react';
import { usePoliceData, DispensaRegistro } from '../../contexts/PoliceContext';

const UserCalendar = () => {
  const { 
    userPoints, 
    setUserPoints, 
    calendarBloqueios, 
    calendarRegistros, 
    setCalendarRegistros,
    policiais // Usado para fallback de busca de equipe
  } = usePoliceData();
  
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1)); // Inicia em Janeiro 2026 para consistência
  const [showInfoPanel, setShowInfoPanel] = useState(true); // Controle do Painel Lateral

  // Mock do usuário logado (Em um sistema real, viria do AuthContext)
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

  // Helper de Chave de Data
  const getDateKey = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Lógica de Escala (Sincronizada com Admin)
  const getDayStatus = (day: number) => {
    const cycle = ['DELTA', 'ALPHA', 'BRAVO', 'CHARLIE'];
    const epoch = new Date(2026, 0, 1); // Referência: 01/01/2026 é DELTA
    const target = new Date(year, month, day);
    
    const diffTime = target.getTime() - epoch.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    const teamIndex = ((diffDays % 4) + 4) % 4;
    const teamOnDuty = cycle[teamIndex];
    
    return teamOnDuty === currentUser.equipe ? 'ORDINÁRIO' : 'FOLGA';
  };

  // --- Função para Remover Própria Dispensa (Botão X) ---
  const handleRemoveMyDispensa = (e: React.MouseEvent, day: number) => {
    e.preventDefault();
    e.stopPropagation(); // Impede disparar o click da célula
    
    if(window.confirm("Deseja cancelar sua dispensa neste dia?")) {
        const key = getDateKey(day);
        setCalendarRegistros(prev => {
            const novosRegistrosDoDia = (prev[key] || []).filter(d => d.matricula !== currentUser.matricula);
            if (novosRegistrosDoDia.length === 0) {
                const copia = { ...prev };
                delete copia[key];
                return copia;
            }
            return { ...prev, [key]: novosRegistrosDoDia };
        });
        setUserPoints(prev => prev + 100); // Devolve os pontos (Mock)
        alert("Dispensa cancelada.");
    }
  };

  // --- Função para Solicitar Dispensa ao Clicar no Dia ---
  const handleDayClick = (day: number) => {
    const key = getDateKey(day);
    const status = getDayStatus(day);
    const isBlocked = !!calendarBloqueios[key];
    const dispensasDoDia = calendarRegistros[key] || [];
    const jaTemDispensa = dispensasDoDia.some(d => d.matricula === currentUser.matricula);

    // Regras de Negócio
    if (isBlocked) {
      alert(`Data bloqueada pela administração: ${calendarBloqueios[key]}`);
      return;
    }

    if (jaTemDispensa) {
      // Se já tem, pergunta se quer cancelar (comportamento padrão do clique na célula)
      if(window.confirm("Você já possui dispensa neste dia. Deseja cancelar?")) {
          setCalendarRegistros(prev => {
              const novosRegistrosDoDia = (prev[key] || []).filter(d => d.matricula !== currentUser.matricula);
              if (novosRegistrosDoDia.length === 0) {
                  const copia = { ...prev };
                  delete copia[key];
                  return copia;
              }
              return { ...prev, [key]: novosRegistrosDoDia };
          });
          setUserPoints(prev => prev + 100);
          alert("Dispensa cancelada.");
      }
      return;
    }

    if (status !== 'ORDINÁRIO') {
      alert("Você só pode solicitar dispensa nos dias de serviço ORDINÁRIO.");
      return;
    }

    if (userPoints < 100) {
      alert("Saldo insuficiente. Necessário 100 pontos.");
      return;
    }

    // Solicitar Dispensa
    if (window.confirm(`Deseja utilizar 100 pontos para solicitar dispensa no dia ${day}/${month+1}?`)) {
       const novaDispensa: DispensaRegistro = {
           id: `${Date.now()}-${currentUser.matricula}`,
           policial: currentUser.nome,
           matricula: currentUser.matricula,
           tipo: 'PROD (User)',
           obs: 'Solicitado via App',
           equipe: currentUser.equipe
       };

       setCalendarRegistros(prev => ({
           ...prev,
           [key]: [...(prev[key] || []), novaDispensa]
       }));

       setUserPoints(prev => prev - 100);
       alert("Dispensa agendada com sucesso!");
    }
  };

  // Gerar array de dias para o grid
  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-[fadeIn_0.3s_ease-out] pb-10 h-full">
      {/* Lado Esquerdo: O Calendário (Estilo Admin) */}
      <div className="flex-1 bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden flex flex-col transition-all duration-300">
        {/* Barra de Ferramentas / Header */}
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
                
                <div className="h-6 w-px bg-slate-200 mx-1 hidden md:block"></div>

                <button 
                    onClick={() => setShowInfoPanel(!showInfoPanel)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all text-[10px] font-bold uppercase ${
                        showInfoPanel 
                        ? 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100' 
                        : 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200 hover:bg-blue-700'
                    }`}
                    title={showInfoPanel ? "Ocultar Painel" : "Exibir Detalhes e Saldo"}
                >
                    <span className="material-icons-round text-base">{showInfoPanel ? 'last_page' : 'first_page'}</span>
                    <span className="hidden sm:inline">{showInfoPanel ? 'Ocultar' : 'Info & Saldo'}</span>
                </button>
            </div>
        </div>

        {/* Grid do Calendário */}
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
          {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'].map(day => (
            <div key={day} className="h-10 flex items-center justify-center text-[10px] font-black text-slate-400 uppercase tracking-wider">{day}</div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 bg-slate-100 gap-px border-b border-slate-200 flex-1">
           {calendarDays.map((day, idx) => {
             if (day === null) {
                return <div key={`empty-${idx}`} className="bg-slate-50/50 min-h-[112px]" />;
             }

             const dateKey = getDateKey(day);
             const status = getDayStatus(day);
             const isOrdinario = status === 'ORDINÁRIO';
             const today = new Date();
             const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;

             // Checa dados globais
             const blockReason = calendarBloqueios[dateKey];
             const isBlocked = !!blockReason;
             const dispensasDoDia = calendarRegistros[dateKey] || [];
             
             // Ordenação: Coloca a dispensa do próprio usuário (se existir) no topo da lista
             const dispensasSorted = [...dispensasDoDia].sort((a, b) => {
                 if (a.matricula === currentUser.matricula) return -1;
                 if (b.matricula === currentUser.matricula) return 1;
                 return 0;
             });
             
             return (
               <div 
                  key={day} 
                  onClick={() => handleDayClick(day)}
                  className={`min-h-[112px] p-2 relative flex flex-col justify-between transition-colors cursor-pointer group 
                    ${isBlocked ? 'bg-slate-100 hover:bg-red-50' : isOrdinario ? 'bg-white hover:bg-blue-50/50' : 'bg-white hover:bg-slate-50'} 
                    ${isToday ? 'ring-2 ring-inset ring-blue-500 z-10' : ''}`}
               >
                 {isBlocked && <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#fee2e2_10px,#fee2e2_20px)] opacity-50 z-0" />}
                 
                 <div className="flex justify-between items-start z-10">
                    <span className={`text-sm font-bold ${isBlocked ? 'text-red-400' : isOrdinario ? 'text-blue-700' : 'text-slate-400'}`}>{String(day).padStart(2, '0')}</span>
                    {isToday && <span className="w-2 h-2 rounded-full bg-blue-600"></span>}
                    {isBlocked && <span className="material-icons-round text-red-500 text-sm">lock</span>}
                 </div>

                 <div className="flex flex-col gap-1 mt-1 z-10">
                   {isBlocked ? (
                      <div className="bg-red-100 text-red-700 border border-red-200 px-2 py-1 rounded text-[8px] font-black uppercase text-center w-full shadow-sm">
                         <span className="truncate block" title={blockReason}>{blockReason}</span>
                      </div>
                   ) : isOrdinario ? (
                     <div className="bg-blue-600 text-white px-2 py-0.5 rounded text-[8px] font-bold uppercase text-center shadow-sm w-full">
                        Ordinário
                     </div>
                   ) : (
                     <div className="bg-slate-100 text-slate-400 px-2 py-0.5 rounded text-[8px] font-bold uppercase text-center w-full">
                        Folga
                     </div>
                   )}
                   
                   {/* Renderização de TODAS as dispensas (Padronizado com Admin) */}
                   {!isBlocked && dispensasSorted.map(disp => (
                     <div key={disp.id} className="bg-orange-50 border border-orange-200 rounded px-1.5 py-1 shadow-sm mt-0.5 relative group/dispensa text-left">
                       <div className="pr-3">
                         <p className="text-[9px] font-black text-slate-800 leading-tight truncate" title={disp.policial}>{disp.policial}</p>
                         <p className="text-[8px] font-bold text-orange-600 leading-tight mt-0.5">{disp.matricula} | {disp.tipo.split(' ')[0]}</p>
                       </div>
                       {/* Botão de Excluir APENAS para a dispensa do próprio usuário */}
                       {disp.matricula === currentUser.matricula && (
                           <button type="button" onClick={(e) => handleRemoveMyDispensa(e, day)} className="absolute top-0.5 right-0.5 z-20 text-orange-300 hover:text-red-500 hover:bg-red-50 rounded-full p-1 transition-all opacity-0 group-hover/dispensa:opacity-100">
                             <span className="material-icons-round text-[10px] font-bold block">close</span>
                           </button>
                       )}
                     </div>
                   ))}
                 </div>
               </div>
             )
           })}
        </div>
      </div>

      {/* Lado Direito: Info e Saldo (Condicional) */}
      {showInfoPanel && (
        <div className="w-full lg:w-80 shrink-0 flex flex-col gap-5 animate-[fadeInRight_0.2s_ease-out]">
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

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex-1">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                <span className="material-icons-round text-blue-600">info</span>
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest">Informações</h4>
            </div>
            
            <div className="space-y-4">
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                    <p className="text-[10px] font-bold text-blue-800 uppercase mb-1">Como Solicitar?</p>
                    <p className="text-[10px] text-blue-700 leading-relaxed">
                    Clique em um dia marcado como "ORDINÁRIO" (Azul) para solicitar sua dispensa utilizando seus pontos.
                    </p>
                </div>

                <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                    <p className="text-[10px] font-bold text-red-800 uppercase mb-1">Legenda de Bloqueio</p>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="material-icons-round text-red-500 text-sm">lock</span>
                        <span className="text-[10px] text-slate-600 font-medium">Dias indisponíveis (ADM)</span>
                    </div>
                </div>

                <div className="p-3 bg-orange-50 border border-orange-100 rounded-lg">
                    <p className="text-[10px] font-bold text-orange-800 uppercase mb-1">Dispensas</p>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="w-3 h-3 bg-orange-100 border border-orange-200 rounded"></div>
                        <span className="text-[10px] text-slate-600 font-medium">Dispensas Agendadas</span>
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