import React, { useState } from 'react';

const RegisterRAI = () => {
  const [formData, setFormData] = useState({
    raiNumber: '',
    dataOcorrencia: '',
    natureza: 'Prisão em flagrante – homicídio/latrocínio (50 pts)',
    obs: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.raiNumber.length < 8) {
      alert("O número do RAI deve conter pelo menos 8 dígitos.");
      return;
    }
    if (!formData.dataOcorrencia) {
      alert("Selecione a data da ocorrência.");
      return;
    }
    
    // Simulação de envio
    alert(`RAI ${formData.raiNumber} registrado com sucesso!`);
    
    // Reset form
    setFormData({
      raiNumber: '',
      dataOcorrencia: '',
      natureza: 'Prisão em flagrante – homicídio/latrocínio (50 pts)',
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
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Data da Ocorrência</label>
                <input 
                  name="dataOcorrencia"
                  value={formData.dataOcorrencia}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all text-sm" 
                  type="date" 
                />
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
                  <option>Prisão em flagrante – homicídio/latrocínio (50 pts)</option>
                  <option>Apreensão de armas de fogo (30 pts)</option>
                  <option>Recuperação de veículo roubado (20 pts)</option>
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