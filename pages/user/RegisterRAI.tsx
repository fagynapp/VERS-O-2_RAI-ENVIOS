import React, { useState, useRef, useEffect } from 'react';
import { usePoliceData } from '../../contexts/PoliceContext';

const RegisterRAI = () => {
  const dateInputRef = useRef<HTMLInputElement>(null);
  const { naturezas, setUserPoints } = usePoliceData();
  
  // Filtra apenas naturezas ativas para exibição
  const activeNaturezas = naturezas.filter(n => n.ativo);

  const [formData, setFormData] = useState({
    raiNumber: '',
    dataOcorrencia: '',
    natureza: '', // Inicializa vazio para forçar seleção ou usa o primeiro item no useEffect
    obs: ''
  });

  // Inicializa o select com o primeiro valor disponível se houver
  useEffect(() => {
    if (activeNaturezas.length > 0 && !formData.natureza) {
       setFormData(prev => ({ 
           ...prev, 
           natureza: `${activeNaturezas[0].natureza} (${activeNaturezas[0].pontos} pts)` 
       }));
    }
  }, [activeNaturezas]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    let { name, value } = e.target;

    // Restrição para apenas números e máximo de 8 dígitos no campo RAI
    if (name === 'raiNumber') {
      value = value.replace(/\D/g, '').slice(0, 8);
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dateInputRef.current) {
      if ('showPicker' in HTMLInputElement.prototype) {
        try {
          dateInputRef.current.showPicker();
        } catch (error) {
          console.warn('showPicker error:', error);
          dateInputRef.current.focus();
        }
      } else {
        dateInputRef.current.focus();
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.raiNumber.length !== 8) {
      alert("O número do RAI deve conter exatamente 8 dígitos.");
      return;
    }
    if (!formData.dataOcorrencia) {
      alert("Selecione a data da ocorrência.");
      return;
    }
    
    // Extrair os pontos da string da natureza selecionada
    // Formato esperado: "Nome da Natureza (XX pts)"
    const selectedNaturezaObj = activeNaturezas.find(
        n => `${n.natureza} (${n.pontos} pts)` === formData.natureza
    );
    
    const pontos = selectedNaturezaObj ? selectedNaturezaObj.pontos : 0;

    // Atualiza a pontuação global
    setUserPoints(prev => prev + pontos);

    // Simulação de envio
    alert(`RAI ${formData.raiNumber} registrado com sucesso! +${pontos} pontos adicionados.`);
    
    // Reset form
    setFormData({
      raiNumber: '',
      dataOcorrencia: '',
      natureza: activeNaturezas.length > 0 ? `${activeNaturezas[0].natureza} (${activeNaturezas[0].pontos} pts)` : '',
      obs: ''
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-blue-600 p-6 flex items-center gap-4 text-white">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <span className="material-icons-round text-2xl">add_task</span>
          </div>
          <div>
            <h2 className="text-xl font-bold">Novo Registro de RAI</h2>
            <p className="text-blue-100 text-sm opacity-90">Preencha as informações da ocorrência</p>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
            <span className="material-icons-round text-amber-600 shrink-0">warning_amber</span>
            <div className="text-sm text-amber-800 leading-relaxed">
              <span className="font-bold">Atenção:</span> Pontos disponíveis imediatamente para RAIs dentro do prazo. 
              RAIs com mais de 90 dias exigem liberação da administração.
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Número do RAI (8 dígitos)</label>
                <div className="relative">
                  <span className="material-icons-round absolute left-3 top-3 text-slate-400 text-lg">search</span>
                  <input 
                    name="raiNumber"
                    value={formData.raiNumber}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all text-sm" 
                    placeholder="00000000" 
                    type="text"
                    maxLength={8}
                    inputMode="numeric"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Data da Ocorrência</label>
                <div className="relative group">
                  <style>
                    {`
                      input[type="date"]::-webkit-calendar-picker-indicator {
                        opacity: 0;
                        width: 100%;
                        height: 100%;
                        position: absolute;
                        top: 0;
                        left: 0;
                        cursor: pointer;
                      }
                    `}
                  </style>
                  <input 
                    ref={dateInputRef}
                    name="dataOcorrencia"
                    value={formData.dataOcorrencia}
                    onChange={handleChange}
                    className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all text-sm cursor-pointer" 
                    type="date"
                    style={{ colorScheme: 'light' }}
                    onClick={handleDateClick}
                  />
                  <div 
                    onClick={handleDateClick}
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer p-1 rounded-full hover:bg-slate-200 transition-colors z-20"
                  >
                    <span className="material-icons-round text-slate-400 text-2xl hover:text-blue-600">
                      calendar_month
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Natureza da Ocorrência</label>
              <div className="relative">
                <select 
                  name="natureza"
                  value={formData.natureza}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all text-sm appearance-none"
                >
                  {activeNaturezas.map(natureza => (
                      <option key={natureza.id} value={`${natureza.natureza} (${natureza.pontos} pts)`}>
                          {natureza.natureza} ({natureza.pontos} pts)
                      </option>
                  ))}
                  {activeNaturezas.length === 0 && <option value="">Nenhuma natureza disponível</option>}
                </select>
                <span className="material-icons-round absolute right-3 top-3 text-slate-400">expand_more</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Observações (Opcional)</label>
              <textarea 
                name="obs"
                value={formData.obs}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all text-sm resize-none" 
                placeholder="Descreva detalhes relevantes..." 
                rows={3}
              ></textarea>
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2">
              <span className="material-icons-round text-lg">check</span>
              Salvar Registro
            </button>
          </form>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mt-6">
        <div className="flex items-center gap-2 text-blue-800 mb-4">
          <span className="material-icons-round text-lg">info</span>
          <h3 className="font-bold text-sm uppercase tracking-wide">Regras de Validação</h3>
        </div>
        <ul className="space-y-2 text-xs text-blue-700 list-disc list-inside">
          <li><span className="font-bold">Limite de Uso:</span> Cada RAI pode ser compartilhado por até 3 policiais.</li>
          <li><span className="font-bold">Registro Único:</span> É proibido registrar o mesmo RAI mais de uma vez.</li>
          <li><span className="font-bold">Prazo de 90 Dias:</span> RAIs com mais de 90 dias não computam pontos automaticamente.</li>
        </ul>
      </div>
    </div>
  );
};

export default RegisterRAI;