import React, { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { usePoliceData } from '../../contexts/PoliceContext';

const AdminConfiguracoes = () => {
  const { reportLogo, setReportLogo } = usePoliceData(); // Usando Contexto Global
  const [vagas, setVagas] = useState(2);
  const [validade, setValidade] = useState(90);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    alert("Configurações salvas com sucesso!");
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReportLogo(reader.result as string); // Salva no Global
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setReportLogo(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const generateManual = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const today = new Date().toLocaleDateString('pt-BR');

    // --- CABEÇALHO ---
    doc.setFillColor(37, 99, 235); // Blue 600
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    // Configuração de Posição do Texto
    let textX = 14;
    
    // Usa a variável global reportLogo
    if (reportLogo) {
        try {
            // Lógica inteligente de redimensionamento mantendo Aspect Ratio
            const imgProps = doc.getImageProperties(reportLogo);
            const originalRatio = imgProps.width / imgProps.height;
            
            // Área máxima disponível para a logo no cabeçalho
            const maxWidth = 35;  // Largura máxima em mm
            const maxHeight = 30; // Altura máxima em mm (cabeçalho tem 40mm)
            
            let finalW = maxWidth;
            let finalH = maxWidth / originalRatio;

            // Se a altura calculada exceder a altura máxima, redimensiona pela altura
            if (finalH > maxHeight) {
                finalH = maxHeight;
                finalW = maxHeight * originalRatio;
            }

            // Centraliza verticalmente no cabeçalho (altura 40)
            const posY = (40 - finalH) / 2;

            doc.addImage(reportLogo, 'PNG', 14, posY, finalW, finalH); 
            
            // Ajusta o texto para a direita baseado na largura da imagem + margem
            textX = 14 + finalW + 5; 

        } catch (error) {
            console.error("Erro ao adicionar logo ao PDF", error);
        }
    }

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text("MANUAL DO SISTEMA", textX, 20);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text("RAI ENVIOS - BPM Terminal", textX, 28);
    
    doc.setFontSize(10);
    doc.text(`Gerado em: ${today}`, pageWidth - 14, 35, { align: 'right' });

    let finalY = 50;

    // --- SEÇÃO 1: REGRAS DE NEGÓCIO ---
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("1. Regras de Negócio e Validações", 14, finalY);
    
    finalY += 5;

    const rulesData = [
        ['Módulo', 'Regra', 'Comportamento do Sistema'],
        ['Produtividade', 'Validade 90 Dias', 'RAIs ocorridos há mais de 90 dias entram como EXPIRADO. Pontos não somam automaticamente. Exige liberação em "Admin > Liberações".'],
        ['Produtividade', 'Unicidade', 'Impede duplicidade de RAI para o mesmo policial. O sistema verifica o banco em tempo real.'],
        ['Dispensas', 'Cota Mensal', 'Máximo: 1 PTS (Pontos) e 1 CPC (Gratuita) por mês/usuário. Bloqueia novas solicitações se a cota for atingida.'],
        ['Dispensas', 'Custo Variável', 'Seg-Qui: 100 pts | Sex-Dom/Feriados: 140 pts. Aniversariantes pagam 50% do valor.'],
        ['Dispensas', 'Escala', 'Só é permitido agendar em dias marcados como ORDINÁRIO (Azul). Dias de Folga são bloqueados.'],
        ['Fila CPC', 'Timer de Decisão', 'O Admin define um prazo (8h-48h). O sistema gerencia a prioridade visualmente no painel.'],
    ];

    autoTable(doc, {
        startY: finalY,
        head: [rulesData[0]],
        body: rulesData.slice(1),
        theme: 'grid',
        headStyles: { fillColor: [71, 85, 105] }, // Slate 600
        styles: { fontSize: 9, cellPadding: 3 },
        columnStyles: {
            0: { fontStyle: 'bold', width: 30 },
            1: { fontStyle: 'bold', width: 35 },
            2: { width: 'auto' }
        }
    });

    // @ts-ignore
    finalY = doc.lastAutoTable.finalY + 15;

    // --- SEÇÃO 2: ARQUITETURA E FLUXO DE DADOS ---
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("2. Mapeamento de Fluxo e Arquivos", 14, finalY);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text("Como os menus se comunicam (User -> Admin)", 14, finalY + 6);

    finalY += 10;

    const flowData = [
        ['Fluxo', 'Origem (Usuário)', 'Destino (Admin)', 'Descrição Técnica da Integração'],
        
        ['Registro de RAI', 
         'RegisterRAI.tsx', 
         'Auditoria.tsx', 
         'O usuário preenche o formulário. O sistema grava no Contexto (userRaiRecords). O Admin visualiza na aba "Pendentes". Se aprovado, soma pontos; se reprovado, marca flag.'],
        
        ['Banco de Dados', 
         'RegisterRAI.tsx', 
         'BancoDados.tsx', 
         'Todos os registros (App, Importação Excel ou Manual) convergem para este arquivo central. Serve como fonte da verdade para evitar duplicidades.'],
        
        ['Solicitação Dispensa', 
         'UserCalendar.tsx', 
         'Dispensas.tsx & EscalaCalendario.tsx', 
         'O usuário clica na data. O sistema valida saldo e cota mensal. Se OK, debita pontos e cria registro. O Admin vê na fila (Dispensas) e no grid visual (Escala).'],
        
        ['Ranking', 
         'Contexto Global', 
         'Ranking.tsx', 
         'O sistema varre todos os policiais ativos e soma os RAIs validados no período. Permite "Override" manual pelo Admin caso precise ajustar pontuação sem lançar RAI.'],
        
        ['Gestão Pessoal', 
         'N/A', 
         'GestãoPoliciais.tsx', 
         'Cadastro central de efetivo. Alimenta todos os "Selects" de busca de policial (na Auditoria, Escala, Fila, etc). Se alterar a equipe aqui, reflete em todo o sistema.']
    ];

    autoTable(doc, {
        startY: finalY,
        head: [flowData[0]],
        body: flowData.slice(1),
        theme: 'striped',
        headStyles: { fillColor: [37, 99, 235] }, // Blue 600
        styles: { fontSize: 9, cellPadding: 4 },
        columnStyles: {
            0: { fontStyle: 'bold', width: 30 },
            1: { fontStyle: 'italic', textColor: [100, 100, 100] }, // Arquivo Origem
            2: { fontStyle: 'italic', textColor: [100, 100, 100] }, // Arquivo Destino
            3: { width: 'auto' }
        }
    });

    // Rodapé
    const pageCount = doc.internal.pages.length - 1;
    doc.setFontSize(8);
    for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(`Página ${i} de ${pageCount}`, pageWidth - 20, doc.internal.pageSize.height - 10);
        doc.text("Documentação Gerada Automaticamente pelo Sistema", 14, doc.internal.pageSize.height - 10);
    }

    doc.save(`Manual_Sistema_BPM_${today.replace(/\//g, '-')}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Cards de Atalho */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-8 text-white shadow-lg flex items-center justify-between">
         <div>
            <h2 className="text-2xl font-bold mb-2">Central de Configuração</h2>
            <p className="text-slate-300 text-sm max-w-xl">
               Gerencie parâmetros globais do sistema e acesse a documentação técnica atualizada das regras de negócio e fluxos de dados.
            </p>
         </div>
         <div className="hidden md:block opacity-20">
            <span className="material-icons-round text-8xl">settings_applications</span>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Painel de Parâmetros */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
                <span className="material-icons-round text-slate-400">tune</span>
                <h3 className="text-lg font-semibold text-slate-900">Parâmetros Globais</h3>
            </div>
            <button 
                onClick={handleSave} 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
                <span className="material-icons-round text-lg">save</span>
                Salvar
            </button>
            </div>
            
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-700 uppercase">Vagas por Dia (Dispensa)</label>
                        <div className="relative">
                            <input 
                            className="w-full border border-slate-300 rounded-lg pl-4 pr-10 py-3 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-600 outline-none transition-all" 
                            type="number" 
                            value={vagas}
                            onChange={(e) => setVagas(Number(e.target.value))}
                            />
                            <span className="material-icons-round absolute right-3 top-3 text-slate-400">event_seat</span>
                        </div>
                        <p className="text-xs text-slate-500">Limite automático de liberações no calendário.</p>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-700 uppercase">Validade Pontos (Dias)</label>
                        <div className="relative">
                            <input 
                            className="w-full border border-slate-300 rounded-lg pl-4 pr-10 py-3 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-600 outline-none transition-all" 
                            type="number" 
                            value={validade}
                            onChange={(e) => setValidade(Number(e.target.value))}
                            />
                            <span className="material-icons-round absolute right-3 top-3 text-slate-400">history</span>
                        </div>
                        <p className="text-xs text-slate-500">Prazo para expiração automática de saldo.</p>
                    </div>
                </div>

                <div className="border-t border-slate-100 pt-4">
                    <label className="block text-sm font-bold text-slate-700 uppercase mb-3">Logotipo do Relatório (Padrão)</label>
                    <div className="flex items-center gap-4">
                        {reportLogo ? (
                            <div className="relative group">
                                <div className="w-16 h-16 rounded-lg border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center">
                                    <img src={reportLogo} alt="Logo" className="max-w-full max-h-full object-contain" />
                                </div>
                                <button 
                                    onClick={removeLogo}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                                    title="Remover Logo"
                                >
                                    <span className="material-icons-round text-xs block">close</span>
                                </button>
                            </div>
                        ) : (
                            <div className="w-16 h-16 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-slate-400">
                                <span className="material-icons-round">image</span>
                            </div>
                        )}
                        
                        <div>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleLogoUpload} 
                                className="hidden" 
                                accept="image/png, image/jpeg, image/jpg" 
                            />
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold uppercase text-slate-600 hover:bg-slate-200 transition-colors flex items-center gap-2"
                            >
                                <span className="material-icons-round text-sm">upload</span>
                                {reportLogo ? 'Alterar Imagem' : 'Carregar Logo'}
                            </button>
                            <p className="text-[10px] text-slate-400 mt-1">
                                Recomendado: PNG (Fundo Transparente). Ajuste automático de tamanho.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Painel de Documentação */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                <span className="material-icons-round text-blue-600">menu_book</span>
                <h3 className="text-lg font-semibold text-slate-900">Documentação do Sistema</h3>
            </div>
            
            <div className="flex-1 flex flex-col justify-center items-center text-center space-y-4 py-4">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-2">
                    <span className="material-icons-round text-4xl text-blue-600">description</span>
                </div>
                <div>
                    <h4 className="font-bold text-slate-800">Manual de Regras & Arquitetura</h4>
                    <p className="text-sm text-slate-500 max-w-xs mx-auto mt-2">
                        Gere um PDF detalhado contendo todas as regras de negócio ativas e o mapeamento técnico de como os menus (Usuário x Admin) se comunicam.
                    </p>
                </div>
                <button 
                    onClick={generateManual}
                    className="mt-4 w-full max-w-xs bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-3"
                >
                    <span className="material-icons-round">download</span>
                    Baixar Manual PDF
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminConfiguracoes;