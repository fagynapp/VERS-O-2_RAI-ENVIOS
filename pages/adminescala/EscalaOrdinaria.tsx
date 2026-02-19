import React, { useEffect, useMemo, useState } from 'react';
import { usePoliceData } from '../../contexts/PoliceContext';

// --- TIPOS ---
interface CellData {
  value: string;
}

// --- DADOS ESTÁTICOS PARA ESTRUTURA (SIMULANDO A PLANILHA) ---
const DATES = [
  { date: '19/02/2026 (QUI)', team: '1º PELOTÃO "ALPHA"', id: 'D1' },
  { date: '20/02/2026 (SEX)', team: '2º PELOTÃO "BRAVO"', id: 'D2' },
  { date: '21/02/2026 (SÁB)', team: '3º PELOTÃO "CHARLIE"', id: 'D3' },
  { date: '22/02/2026 (DOM)', team: '4º PELOTÃO "DELTA"', id: 'D4' }
];

const AREAS = [
  { id: 1, gvm: 'GYN', func: '62 9 9912-3615', desc: 'CPU' },
  { id: 2, gvm: 'ÁREA I', func: '62 9 9641-4977', desc: 'T. VERA CRUZ, T. PE. PELÁGIO ATÉ A ESTAÇÃO ANICUNS.' },
  { id: 3, gvm: 'ÁREA II', func: '62 9 9681-7279', desc: 'T. DERGO, T. PRAÇA A; ATÉ A ESTAÇÃO JOQUEI CLUBE.' },
  { id: 4, gvm: 'ÁREA III', func: '62 9 9968-6674', desc: 'ESTAÇÃO BANDEIRANTE OESTE, T. PRAÇA DA BÍBLIA, ATÉ O T. NOVO MUNDO' },
  { id: 5, gvm: 'ÁREA IV', func: '62 9 9660-6902', desc: 'TERMINAL ISIDÓRIA, T. BANDEIRAS, T. GYN VIVA, T. PQ OESTE.' },
  { id: 6, gvm: 'ÁREA V', func: '62 9 9969-7361', desc: 'REGIÃO DA 44, T PAULO GARCIA, T. HAILÉ PINHEIRO, T. RECANTO DO BOSQUE' },
];

const EscalaDigital = () => {
  // Estado único para armazenar todos os inputs da planilha
  // Chave: string (ex: "AREA_1_D1_CMT") -> Valor: string
  const [sheetData, setSheetData] = useState<Record<string, string>>({});

  const handleInputChange = (key: string, value: string) => {
    setSheetData(prev => ({ ...prev, [key]: value }));
  };

  // Componente de Célula de Input (Simula célula do Excel)
  const ExcelInput = ({ 
    id, 
    placeholder = "", 
    className = "", 
    center = false,
    bold = false 
  }: { id: string, placeholder?: string, className?: string, center?: boolean, bold?: boolean }) => (
    <input
      type="text"
      value={sheetData[id] || ''}
      onChange={(e) => handleInputChange(id, e.target.value)}
      className={`w-full h-full bg-transparent outline-none px-1 text-xs text-slate-800 uppercase
        ${center ? 'text-center' : 'text-left'}
        ${bold ? 'font-black' : 'font-medium'}
        ${className}
      `}
      placeholder={placeholder}
    />
  );

  return (
    <div className="bg-gray-200 p-4 min-h-screen font-sans overflow-x-auto">
      {/* CONTAINER PRINCIPAL (PAPEL) */}
      <div className="bg-white min-w-[1600px] border border-gray-400 shadow-xl mx-auto pb-10" style={{ printColorAdjust: 'exact' }}>
        
        {/* =================================================================================
            1. CABEÇALHO SUPERIOR
           ================================================================================= */}
        <header className="flex border-b-2 border-black">
          {/* Logo e Título */}
          <div className="w-[200px] bg-[#4472c4] border-r border-white flex flex-col items-center justify-center p-2">
             <div className="w-16 h-16 bg-white/20 rounded-full mb-1 flex items-center justify-center text-white text-[10px]">LOGO</div>
          </div>
          
          <div className="flex-1 bg-[#4472c4] flex flex-col items-center justify-center py-2 text-white">
            <h1 className="text-3xl font-black uppercase tracking-wide">Escalas de Serviço - BPM Terminal</h1>
          </div>
        </header>

        {/* Sub-cabeçalho de Horários */}
        <div className="bg-[#d9d9d9] border-b-2 border-black text-center py-1">
           <span className="text-sm font-black uppercase text-black">HORÁRIO DAS 05:00 ÀS 23:59 E CORUJÃO DAS 05H ÀS 05H</span>
        </div>

        {/* =================================================================================
            2. TABELA PRINCIPAL - OPERACIONAL
           ================================================================================= */}
        <div className="grid grid-cols-[40px_80px_100px_400px_1fr_1fr_1fr_1fr] border-l-2 border-r-2 border-black">
          
          {/* --- HEADER DA TABELA --- */}
          {/* Linha 1: Títulos Fixos + Datas */}
          <div className="col-span-4 bg-[#4472c4] border-r border-white border-b border-white flex items-center justify-center text-white font-bold text-sm">
             DESCRIÇÃO DETALHADA DA ÁREA
          </div>
          {DATES.map(d => (
            <div key={d.id} className="bg-[#ffff00] border-r border-black border-b border-black text-center p-1">
              <span className="text-xs font-black text-black block uppercase">{d.date}</span>
            </div>
          ))}

          {/* Linha 2: Sub-títulos Fixos + Pelotões */}
          <div className="bg-[#4472c4] text-white flex items-center justify-center border-r border-white border-b-2 border-black text-xs font-bold py-1">Nº</div>
          <div className="bg-[#4472c4] text-white flex items-center justify-center border-r border-white border-b-2 border-black text-xs font-bold">ÁREA</div>
          <div className="bg-[#4472c4] text-white flex items-center justify-center border-r border-white border-b-2 border-black text-xs font-bold">FUNCIONAL</div>
          <div className="bg-[#4472c4] text-white flex items-center justify-center border-r border-black border-b-2 border-black text-xs font-bold">DESCRIÇÃO</div>
          
          {DATES.map(d => (
            <div key={`pel-${d.id}`} className="bg-[#4472c4] border-r border-black border-b-2 border-black text-center p-1">
              <span className="text-xs font-bold text-white uppercase">{d.team}</span>
            </div>
          ))}

          {/* --- CORPO DA TABELA (ÁREAS) --- */}
          {AREAS.map((area, idx) => {
             const rowColor = idx % 2 === 0 ? 'bg-[#e9eff7]' : 'bg-white'; // Alternância sutil
             return (
              <React.Fragment key={area.id}>
                {/* Colunas Fixas */}
                <div className={`row-span-2 ${rowColor} border-r border-black border-b border-black flex items-center justify-center font-black text-sm`}>{area.id}</div>
                <div className={`row-span-2 bg-[#d9e1f2] border-r border-black border-b border-black flex items-center justify-center font-bold text-xs text-center px-1`}>{area.gvm}</div>
                <div className={`row-span-2 bg-white border-r border-black border-b border-black flex items-center justify-center font-medium text-[10px] text-center px-1`}>{area.func}</div>
                <div className={`row-span-2 bg-white border-r-2 border-black border-b border-black flex items-center px-2 py-1 text-[10px] font-bold leading-tight uppercase`}>{area.desc}</div>

                {/* Colunas Dinâmicas (Datas) - LINHA CMT */}
                {DATES.map(date => (
                  <div key={`cmt-${area.id}-${date.id}`} className="bg-white border-r border-black border-b border-gray-300 h-8 flex">
                    <div className="w-8 bg-gray-100 border-r border-gray-300 flex items-center justify-center text-[9px] font-bold text-gray-500">CMT</div>
                    <div className="flex-1">
                      <ExcelInput id={`AREA_${area.id}_${date.id}_CMT`} bold />
                    </div>
                  </div>
                ))}

                {/* Colunas Dinâmicas (Datas) - LINHA MOT */}
                {DATES.map(date => (
                  <div key={`mot-${area.id}-${date.id}`} className="bg-white border-r border-black border-b border-black h-8 flex">
                    <div className="w-8 bg-gray-100 border-r border-gray-300 flex items-center justify-center text-[9px] font-bold text-gray-500">MOT</div>
                    <div className="flex-1">
                      <ExcelInput id={`AREA_${area.id}_${date.id}_MOT`} />
                    </div>
                  </div>
                ))}
              </React.Fragment>
             );
          })}

          {/* =================================================================================
              3. EQUIPE DE PRONTO EMPREGO – EPE / CDC
             ================================================================================= */}
          
          {/* Header EPE */}
          <div className="col-span-4 bg-[#4472c4] border-r-2 border-black border-b border-black h-6"></div> {/* Spacer Left */}
          {DATES.map(d => (
             <div key={`epe-header-${d.id}`} className="bg-[#4472c4] text-white text-center text-xs font-bold border-r border-black border-b border-black h-6 flex items-center justify-center">
                EPE / CDC
             </div>
          ))}

          {/* Rows EPE (3 Equipes) */}
          {[1, 2, 3].map((epeId) => (
            <React.Fragment key={`epe-row-${epeId}`}>
               {/* Fixed Info */}
               <div className="bg-[#d9e1f2] border-r border-black border-b border-black flex items-center justify-center font-black text-sm">REC</div>
               <div className="bg-white border-r border-black border-b border-black flex items-center justify-center text-xs">-</div>
               <div className="bg-white border-r border-black border-b border-black"></div>
               <div className="bg-[#e7e6e6] border-r-2 border-black border-b border-black px-2 flex items-center font-bold text-xs uppercase">
                  EQUIPE DE PRONTO EMPREGO - EPE/CDC {epeId}
               </div>

               {/* Dynamic Date Cells for EPE */}
               {DATES.map(date => (
                 <div key={`epe-${epeId}-${date.id}`} className="border-r border-black border-b border-black">
                    <div className="flex border-b border-gray-300 h-6">
                        <div className="w-8 bg-gray-100 border-r border-gray-300 flex items-center justify-center text-[9px]">CMT</div>
                        <ExcelInput id={`EPE_${epeId}_${date.id}_CMT`} bold />
                    </div>
                    <div className="flex h-6">
                        <div className="w-8 bg-gray-100 border-r border-gray-300 flex items-center justify-center text-[9px]">MOT</div>
                        <ExcelInput id={`EPE_${epeId}_${date.id}_MOT`} />
                    </div>
                 </div>
               ))}
            </React.Fragment>
          ))}

          {/* =================================================================================
              4. REC – RECOBRIMENTO
             ================================================================================= */}
          
          {[1, 2, 3].map((recId) => (
            <React.Fragment key={`rec-row-${recId}`}>
               <div className="bg-[#d9e1f2] border-r border-black border-b border-black flex items-center justify-center font-black text-sm">{recId + 7}</div>
               <div className="bg-white border-r border-black border-b border-black flex items-center justify-center text-xs">-</div>
               <div className="bg-white border-r border-black border-b border-black"></div>
               <div className="bg-[#e7e6e6] border-r-2 border-black border-b border-black px-2 flex items-center font-bold text-xs uppercase">
                  EPE/CDC (REC) - RECOBRIMENTO {recId}
               </div>

               {DATES.map(date => (
                 <div key={`rec-${recId}-${date.id}`} className="border-r border-black border-b border-black">
                    <div className="flex border-b border-gray-300 h-6">
                        <div className="w-8 bg-gray-100 border-r border-gray-300 flex items-center justify-center text-[9px]">CMT</div>
                        <ExcelInput id={`REC_${recId}_${date.id}_CMT`} bold />
                    </div>
                    <div className="flex h-6">
                        <div className="w-8 bg-gray-100 border-r border-gray-300 flex items-center justify-center text-[9px]">MOT</div>
                        <ExcelInput id={`REC_${recId}_${date.id}_MOT`} />
                    </div>
                 </div>
               ))}
            </React.Fragment>
          ))}

          {/* =================================================================================
              11. ESCALA ADJUNTOS 24x72 (Barra Separadora)
             ================================================================================= */}
          <div className="col-span-4 bg-[#4472c4] text-white border-r-2 border-black border-b border-black text-center font-bold text-sm py-1 uppercase">
             ESCALA DE ADJUNTO: 24X72
          </div>
          {DATES.map(date => (
             <div key={`adj-header-${date.id}`} className="bg-[#4472c4] text-white border-r border-black border-b border-black text-center font-bold text-xs py-1 uppercase">
                ADJUNTO
             </div>
          ))}

          <div className="col-span-4 bg-[#d9d9d9] border-r-2 border-black border-b-2 border-black text-center font-bold text-xs py-2 uppercase">
             HORÁRIO: 07:00H ÀS 07:00
          </div>
          {DATES.map(date => (
             <div key={`adj-cell-${date.id}`} className="bg-white border-r border-black border-b-2 border-black flex h-10">
                <div className="w-8 bg-gray-200 border-r border-gray-300 flex items-center justify-center text-[9px] font-bold">ADJ</div>
                <div className="flex-1">
                   <ExcelInput id={`ADJUNTO_${date.id}`} center bold />
                </div>
             </div>
          ))}

        </div> 
        {/* FIM DO GRID PRINCIPAL */}

        {/* =================================================================================
            5, 6, 7, 8, 9, 10, 12 - BLOCOS INFERIORES (GRID SEPARADO)
           ================================================================================= */}
        
        <div className="grid grid-cols-5 gap-4 mt-6 px-1">
            
            {/* BLOCO 5: EXPEDIENTE */}
            <div className="border-2 border-black">
               <div className="bg-[#4472c4] text-white text-center font-bold text-xs py-1 uppercase border-b border-black">EXPEDIENTE</div>
               
               <div className="grid grid-cols-[80px_1fr] border-b border-black">
                  <div className="bg-[#4472c4] text-white text-center text-[10px] font-bold py-1 border-r border-black">HORÁRIO</div>
                  <div className="bg-[#d9d9d9] text-center text-[10px] font-bold py-1">08H ÀS 18H</div>
               </div>

               {/* Linhas Expediente */}
               {[
                 { role: 'COMANDO', ph: 'MAJ KAMINICHE' },
                 { role: 'SUBCMT', ph: 'CAP ERNANE' },
                 { role: 'P1', ph: 'CB EUGÊNIA' },
                 { role: 'P2', ph: '1º TEN SANTOS' },
                 { role: 'P3', ph: 'CB LIMA' },
                 { role: 'P4', ph: 'ST MARÇAL' },
                 { role: 'MOT CMD', ph: 'CB VARGAS' },
                 { role: 'TCO', ph: 'SD VENÂNCIO' },
               ].map((item, i) => (
                 <div key={i} className="border-b border-black last:border-0 h-7">
                    <ExcelInput id={`EXP_${item.role}`} placeholder={`${item.ph} [${item.role}]`} className="text-[10px] px-2" bold />
                 </div>
               ))}

               {/* Bloco 6: Escala 12x36 (Dentro da coluna esquerda) */}
               <div className="bg-[#4472c4] text-white text-center font-bold text-xs py-1 uppercase border-t-2 border-b border-black mt-0">ESCALA 12X36</div>
               <div className="grid grid-cols-[80px_1fr] border-b border-black">
                  <div className="bg-[#4472c4] text-white text-center text-[10px] font-bold py-1 border-r border-black">HORÁRIO</div>
                  <div className="bg-[#d9d9d9] text-center text-[10px] font-bold py-1">07H ÀS 19H</div>
               </div>
               {[
                 { role: 'CMD 44', ph: '1º TEN KLEBER' },
                 { role: 'MOT CMD 44', ph: '3º SGT WALACE' },
                 { role: 'AUX P2', ph: '1º SGT JHONATAN' },
                 { role: 'MANUTENÇÃO', ph: '2º SGT LEUCIONE' },
               ].map((item, i) => (
                 <div key={i} className="border-b border-black last:border-0 h-7">
                    <ExcelInput id={`12X36_${item.role}`} placeholder={`${item.ph} [${item.role}]`} className="text-[10px] px-2" bold />
                 </div>
               ))}
            </div>

            {/* BLOCO 10: DISPENSA RECOMPENSA */}
            <div className="border-2 border-black">
               <div className="bg-[#4472c4] text-white text-center font-bold text-xs py-1 uppercase border-b border-black">DISPENSA RECOMPENSA</div>
               <div className="grid grid-cols-[80px_1fr] border-b border-black bg-[#4472c4] text-white text-[10px] font-bold">
                  <div className="text-center py-1 border-r border-white">DATA</div>
                  <div className="text-center py-1">NOME DO POLICIAL</div>
               </div>
               {/* 16 Linhas para preencher com renderização garantida (Ajustado para uniformidade) */}
               {Array.from({ length: 16 }).map((_, i) => (
                  <div key={`dispensa-${i}`} className="grid grid-cols-[80px_1fr] border-b border-black h-6 last:border-0 bg-white">
                     <div className="border-r border-black h-full">
                        <ExcelInput id={`DISP_DATA_${i}`} center />
                     </div>
                     <div className="h-full">
                        <ExcelInput id={`DISP_NOME_${i}`} className="px-2" />
                     </div>
                  </div>
               ))}
            </div>

            {/* BLOCO 7, 8, 9: AFASTAMENTOS */}
            <div className="col-span-2 border-2 border-black">
                <div className="bg-[#4472c4] text-white text-center font-bold text-xs py-1 uppercase border-b border-black">AFASTAMENTOS</div>
                <div className="grid grid-cols-[80px_80px_1fr_100px] border-b border-black bg-[#4472c4] text-white text-[10px] font-bold text-center">
                   <div className="py-1 border-r border-white">INÍCIO</div>
                   <div className="py-1 border-r border-white">FINAL</div>
                   <div className="py-1 border-r border-white">NOME DO POLICIAL</div>
                   <div className="py-1">TIPO</div>
                </div>
                {/* 16 Linhas para Afastamentos com renderização garantida (Ajustado para uniformidade) */}
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={`afastamento-${i}`} className="grid grid-cols-[80px_80px_1fr_100px] border-b border-black h-6 last:border-0 bg-white">
                     <div className="border-r border-black h-full"><ExcelInput id={`AFAST_INI_${i}`} center /></div>
                     <div className="border-r border-black h-full"><ExcelInput id={`AFAST_FIM_${i}`} center /></div>
                     <div className="border-r border-black h-full"><ExcelInput id={`AFAST_NOME_${i}`} className="px-2" /></div>
                     <div className="h-full"><ExcelInput id={`AFAST_TIPO_${i}`} className="px-2" placeholder={i === 0 ? "FÉRIAS" : i === 1 ? "LICENÇA ESPECIAL" : i === 2 ? "BAIXA MÉDICA" : ""} /></div>
                  </div>
               ))}
            </div>

            {/* BLOCO 12: P2 (NOVO) */}
            <div className="border-2 border-black">
               <div className="bg-[#4472c4] text-white text-center font-bold text-xs py-1 uppercase border-b border-black">P2</div>
               
               <div className="grid grid-cols-[100px_1fr] border-b border-black">
                  <div className="bg-[#4472c4] text-white text-center text-[10px] font-bold py-1 border-r border-black">HORÁRIO</div>
                  <div className="bg-[#d9d9d9] text-center text-[10px] font-bold py-1">05:00 ÀS 00:00</div>
               </div>

               {/* Linhas P2 com grid consistente */}
               <div className="grid grid-cols-[100px_1fr] border-b border-black h-6 bg-white">
                  <div className="border-r border-black flex items-center px-1 text-[10px] font-bold">ANÁLISE</div>
                  <div className="h-full"><ExcelInput id="P2_ANALISE" className="px-1" /></div>
               </div>

               {[
                 { label: 'PELOTÃO: ALPHA', id: 'ALPHA_1', ph: '2ºSGT EDER' },
                 { label: 'PELOTÃO: ALPHA', id: 'ALPHA_2', ph: '3ºSGT SANDER' },
                 { label: 'PELOTÃO: BRAVO', id: 'BRAVO_1', ph: 'CB PASSOS' },
                 { label: 'PELOTÃO: BRAVO', id: 'BRAVO_2', ph: 'CB WARTELOO' },
                 { label: 'PELOTÃO: CHARLIE', id: 'CHARLIE_1', ph: 'CB SENA' },
                 { label: 'PELOTÃO: CHARLIE', id: 'CHARLIE_2', ph: 'CB MENDES' },
                 { label: 'PELOTÃO: DELTA', id: 'DELTA_1', ph: '3ºSGT NETTO' },
                 { label: 'PELOTÃO: DELTA', id: 'DELTA_2', ph: 'PM DE FÉRIAS' },
               ].map((item, i) => (
                 <div key={i} className="grid grid-cols-[100px_1fr] border-b border-black h-6 bg-white">
                    <div className="border-r border-black flex items-center px-1 text-[9px] font-bold uppercase">{item.label}</div>
                    <div className="h-full">
                        <ExcelInput id={`P2_${item.id}`} placeholder={item.ph} className="text-[10px] px-1" />
                    </div>
                 </div>
               ))}
               
               {/* Linhas Vazias de Preenchimento para P2 (Ajustado para totalizar 16 linhas: 9 fixas + 7 vazias) */}
               {Array.from({ length: 7 }).map((_, i) => (
                  <div key={`p2-empty-${i}`} className="grid grid-cols-[100px_1fr] border-b border-black h-6 last:border-0 bg-white">
                     <div className="border-r border-black h-full"></div>
                     <div className="h-full">
                        <ExcelInput id={`P2_EMPTY_${i}`} className="px-1" />
                     </div>
                  </div>
               ))}
            </div>

        </div>

      </div>
    </div>
  );
};


// =================================================================================
//  ABA "REGISTRAR" (NOVA) — CADASTRO ESTRUTURADO PARA A ADM (SEM ALTERAR A ESCALA DIGITAL)
//  Observação: nesta etapa, os registros ficam em localStorage. Na próxima etapa,
//  conectaremos esses dados para preencher automaticamente a Escala Digital.
// =================================================================================

type Situacao =
  | 'PM ESCALADO'
  | 'PM DISPENSADO'
  | 'PM DE FÉRIAS'
  | 'PM DE ATESTADO'
  | 'PM DE LICENÇA ESPECIAL';

type SecaoCadastro =
  | 'ESCALA OPERACIONAL'
  | 'EPE/CDC'
  | 'REC'
  | 'ESCALA EXPEDIENTE'
  | 'ESCALA 12X36'
  | 'ESCALA P2';

interface RegistroEscala {
  id: string;
  dataISO: string; // yyyy-mm-dd
  secao: SecaoCadastro;
  equipe: string;  // ALPHA/BRAVO/CHARLIE/DELTA/P2/...
  area: string;    // CPU / ÁREA I / ...
  funcao: string;  // CMT / MOT / ...
  policial: string; // "POSTO/GRAD + NOME + RG/MAT" (texto)
  situacao: Situacao;
  obs?: string;
  createdAtISO: string;
}

const ESCALA_REGISTRAR_STORAGE_KEY = 'bpmterminal:escala:ordinaria:registrar:v1';

function newId() {
  return Math.random().toString(16).slice(2) + '-' + Date.now().toString(16);
}

function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function loadRegistrar(): RegistroEscala[] {
  try {
    const raw = localStorage.getItem(ESCALA_REGISTRAR_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as RegistroEscala[]) : [];
  } catch {
    return [];
  }
}

function saveRegistrar(rows: RegistroEscala[]) {
  localStorage.setItem(ESCALA_REGISTRAR_STORAGE_KEY, JSON.stringify(rows));
}

const SITUACOES: Situacao[] = [
  'PM ESCALADO',
  'PM DISPENSADO',
  'PM DE FÉRIAS',
  'PM DE ATESTADO',
  'PM DE LICENÇA ESPECIAL',
];

const SECOES: SecaoCadastro[] = [
  'ESCALA OPERACIONAL',
  'EPE/CDC',
  'REC',
  'ESCALA EXPEDIENTE',
  'ESCALA 12X36',
  'ESCALA P2',
];

const EQUIPES_BASE = ['ALPHA', 'BRAVO', 'CHARLIE', 'DELTA', 'P2', 'P3', 'P4', 'ADJUNTO', 'TCO', 'COMANDO', 'SUBCMT'];

const TEMPLATE = {
  'ESCALA OPERACIONAL': {
    areas: ['CPU', 'ÁREA I', 'ÁREA II', 'ÁREA III', 'ÁREA IV', 'ÁREA V'],
    funcoes: ['CMT', 'MOT', 'AUX', 'OBS'],
    equipeDefault: 'ALPHA',
  },
  'EPE/CDC': {
    areas: ['EPE/CDC 1', 'EPE/CDC 2', 'EPE/CDC 3'],
    funcoes: ['CMT', 'MOT'],
    equipeDefault: 'EPE/CDC',
  },
  'REC': {
    areas: ['REC 1', 'REC 2', 'REC 3'],
    funcoes: ['CMT', 'MOT'],
    equipeDefault: 'REC',
  },
  'ESCALA EXPEDIENTE': {
    areas: ['EXPEDIENTE'],
    funcoes: ['COMANDO', 'SUBCMT', 'P/1', 'P/2', 'P/3', 'P/4', 'MOT CMD', 'TCO'],
    equipeDefault: 'EXPEDIENTE',
  },
  'ESCALA 12X36': {
    areas: ['12X36'],
    funcoes: ['CMD 44', 'MOT CMD 44', 'AUX P/2', 'MANUTENÇÃO'],
    equipeDefault: '12X36',
  },
  'ESCALA P2': {
    areas: ['P2'],
    funcoes: ['ANÁLISE', 'EQUIPE A', 'EQUIPE B', 'EQUIPE C', 'EQUIPE D'],
    equipeDefault: 'P2',
  },
} as const;

function RegistrarTab() {
  const { policiais, availableTeams } = usePoliceData();

  const [rows, setRows] = useState<RegistroEscala[]>([]);
  const [dataISO, setDataISO] = useState<string>(todayISO());
  const [secao, setSecao] = useState<SecaoCadastro>('ESCALA OPERACIONAL');
  const [equipe, setEquipe] = useState<string>(TEMPLATE['ESCALA OPERACIONAL'].equipeDefault);
  const [area, setArea] = useState<string>(TEMPLATE['ESCALA OPERACIONAL'].areas[0]);
  const [funcao, setFuncao] = useState<string>(TEMPLATE['ESCALA OPERACIONAL'].funcoes[0]);
  const [policial, setPolicial] = useState<string>('');
  const [situacao, setSituacao] = useState<Situacao>('PM ESCALADO');
  const [obs, setObs] = useState<string>('');

  useEffect(() => {
    const loaded = loadRegistrar();
    setRows(loaded);
  }, []);

  useEffect(() => {
    saveRegistrar(rows);
  }, [rows]);

  // quando muda a seção, aplica defaults para acelerar cadastro
  useEffect(() => {
    const t = TEMPLATE[secao];
    setEquipe(t.equipeDefault);
    setArea(t.areas[0] ?? '');
    setFuncao(t.funcoes[0] ?? '');
    // não zera policial (para facilitar cadastro em lote)
  }, [secao]);

  const policiaisFiltrados = useMemo(() => {
    const eq = (equipe || '').toUpperCase();
    // Se a equipe for uma equipe operacional (ALPHA/BRAVO/CHARLIE/DELTA), filtra por ela.
    // Caso contrário, mostra todos para facilitar (Expediente, 12x36, etc).
    if (['ALPHA', 'BRAVO', 'CHARLIE', 'DELTA', 'P2', 'P3', 'P4', 'ADJUNTO'].includes(eq)) {
      return policiais.filter((p) => (p.equipe || '').toUpperCase() === eq);
    }
    return policiais;
  }, [policiais, equipe]);

  const rowsDoDia = useMemo(() => rows.filter((r) => r.dataISO === dataISO), [rows, dataISO]);

  function addRow() {
    if (!policial.trim()) return;

    const r: RegistroEscala = {
      id: newId(),
      dataISO,
      secao,
      equipe: equipe.trim(),
      area: area.trim(),
      funcao: funcao.trim(),
      policial: policial.trim(),
      situacao,
      obs: obs.trim() ? obs.trim() : undefined,
      createdAtISO: new Date().toISOString(),
    };

    setRows((prev) => [r, ...prev]);
    setObs('');
    setSituacao('PM ESCALADO');
  }

  function removeRow(id: string) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  function patchRow(id: string, patch: Partial<RegistroEscala>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  const teamsForSelect = useMemo(() => {
    const t = availableTeams?.length ? availableTeams : EQUIPES_BASE;
    // garante presença das equipes padrão
    const merged = Array.from(new Set([...(t || []), ...EQUIPES_BASE]));
    return merged;
  }, [availableTeams]);

  const areaOptions = TEMPLATE[secao].areas;
  const funcOptions = TEMPLATE[secao].funcoes;

  return (
    <div className="bg-gray-100 border border-gray-300 rounded-xl p-4">
      <div className="flex flex-col gap-1 mb-4">
        <div className="text-sm font-black uppercase text-slate-800">Registrar Escala (ADM)</div>
        <div className="text-xs text-slate-600">
          Preencha por dropdown e salve. (Nesta etapa, isso prepara os dados para alimentar a Escala Digital sem alterar o layout.)
        </div>
      </div>

      {/* FORMULÁRIO */}
      <div className="grid grid-cols-12 gap-3 items-end">
        <div className="col-span-12 md:col-span-3">
          <div className="text-[11px] font-black text-slate-700 uppercase mb-1">Data</div>
          <input
            type="date"
            value={dataISO}
            onChange={(e) => setDataISO(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white"
          />
        </div>

        <div className="col-span-12 md:col-span-4">
          <div className="text-[11px] font-black text-slate-700 uppercase mb-1">Setor</div>
          <select
            value={secao}
            onChange={(e) => setSecao(e.target.value as SecaoCadastro)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white"
          >
            {SECOES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="col-span-12 md:col-span-2">
          <div className="text-[11px] font-black text-slate-700 uppercase mb-1">Equipe</div>
          <select
            value={equipe}
            onChange={(e) => setEquipe(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white"
          >
            {teamsForSelect.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="col-span-12 md:col-span-3">
          <div className="text-[11px] font-black text-slate-700 uppercase mb-1">Situação</div>
          <select
            value={situacao}
            onChange={(e) => setSituacao(e.target.value as Situacao)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white"
          >
            {SITUACOES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="col-span-12 md:col-span-4">
          <div className="text-[11px] font-black text-slate-700 uppercase mb-1">Área / Subsetor</div>
          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white"
          >
            {areaOptions.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        <div className="col-span-12 md:col-span-3">
          <div className="text-[11px] font-black text-slate-700 uppercase mb-1">Função</div>
          <select
            value={funcao}
            onChange={(e) => setFuncao(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white"
          >
            {funcOptions.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>

        <div className="col-span-12 md:col-span-5">
          <div className="text-[11px] font-black text-slate-700 uppercase mb-1">Policial</div>
          <select
            value={policial}
            onChange={(e) => setPolicial(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white"
          >
            <option value="">Selecione...</option>
            {policiaisFiltrados.map((p) => (
              <option key={p.id} value={`${p.nome} RG ${p.matricula}`}>
                {p.nome} — RG {p.matricula} ({p.equipe})
              </option>
            ))}
          </select>
          <div className="text-[10px] text-slate-500 mt-1">
            Dica: selecione um policial e altere apenas a Situação (atestados/férias) para corrigir rapidamente o dia.
          </div>
        </div>

        <div className="col-span-12 md:col-span-10">
          <div className="text-[11px] font-black text-slate-700 uppercase mb-1">Observação (opcional)</div>
          <input
            value={obs}
            onChange={(e) => setObs(e.target.value)}
            placeholder="Ex.: substituição, reforço, motivo..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white"
          />
        </div>

        <div className="col-span-12 md:col-span-2 flex justify-end">
          <button
            onClick={addRow}
            disabled={!policial.trim()}
            className={`w-full rounded-lg px-4 py-2 text-sm font-black uppercase
              ${policial.trim() ? 'bg-green-700 text-white hover:bg-green-800' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}
            `}
          >
            Salvar
          </button>
        </div>
      </div>

      {/* LISTA DO DIA */}
      <div className="mt-6">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="text-xs font-black uppercase text-slate-800">
            Registros do dia: {dataISO} ({rowsDoDia.length})
          </div>
          <button
            onClick={() => {
              if (!confirm('Deseja apagar TODOS os registros salvos no Registrar?')) return;
              setRows([]);
            }}
            className="text-xs font-black uppercase border border-red-600 text-red-700 rounded-lg px-3 py-2 hover:bg-red-50"
          >
            Limpar tudo
          </button>
        </div>

        {rowsDoDia.length === 0 ? (
          <div className="text-sm text-slate-600 bg-white border border-gray-200 rounded-lg p-3">
            Nenhum registro salvo para esta data.
          </div>
        ) : (
          <div className="space-y-2">
            {rowsDoDia.map((r) => (
              <div key={r.id} className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-col">
                    <div className="text-sm font-black text-slate-800">
                      {r.policial} <span className="text-xs font-bold text-slate-500">• {r.secao}</span>
                    </div>
                    <div className="text-xs text-slate-600">
                      Equipe: <b>{r.equipe}</b> • Área: <b>{r.area}</b> • Função: <b>{r.funcao}</b> • Situação: <b>{r.situacao}</b>
                    </div>
                    {r.obs ? <div className="text-xs text-slate-600 mt-1">Obs: {r.obs}</div> : null}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={r.situacao}
                      onChange={(e) => patchRow(r.id, { situacao: e.target.value as Situacao })}
                      className="rounded-lg border border-gray-300 px-2 py-2 text-xs bg-white"
                      title="Alterar situação rapidamente"
                    >
                      {SITUACOES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>

                    <button
                      onClick={() => removeRow(r.id)}
                      className="rounded-lg border border-red-600 text-red-700 px-3 py-2 text-xs font-black uppercase hover:bg-red-50"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 text-[11px] text-slate-600">
        <b>Próximo passo:</b> conectar estes registros ao layout da <b>Escala Digital</b> para preencher automaticamente as células (sem mexer na estrutura visual).
      </div>
    </div>
  );
}

function TabsShell() {
  const [tab, setTab] = useState<'REGISTRAR' | 'ESCALA_DIGITAL'>('REGISTRAR');

  return (
    <div className="p-4 min-h-screen bg-gray-200 font-sans">
      <div className="max-w-[1800px] mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex flex-col">
            <div className="text-base font-black uppercase text-slate-800">Escala Ordinária</div>
            <div className="text-xs text-slate-600">Painel ADM — Registrar | Escala Digital</div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTab('REGISTRAR')}
              className={`rounded-xl px-4 py-2 text-sm font-black uppercase border
                ${tab === 'REGISTRAR' ? 'bg-green-700 text-white border-green-800' : 'bg-white text-slate-800 border-gray-300'}
              `}
            >
              Registrar
            </button>
            <button
              onClick={() => setTab('ESCALA_DIGITAL')}
              className={`rounded-xl px-4 py-2 text-sm font-black uppercase border
                ${tab === 'ESCALA_DIGITAL' ? 'bg-green-700 text-white border-green-800' : 'bg-white text-slate-800 border-gray-300'}
              `}
            >
              Escala Digital
            </button>
          </div>
        </div>

        {tab === 'REGISTRAR' ? <RegistrarTab /> : <EscalaDigital />}
      </div>
    </div>
  );
}

// Componente exportado (mantém rota/integração existente)
const EscalaOrdinaria = () => <TabsShell />;


export default EscalaOrdinaria;
