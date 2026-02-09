import React, { useState } from 'react';

const AdminLiberacoes = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    rai: '',
    data: '',
    matricula: '',
    novaValidade: '',
    motivo: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { placeholder, value, type } = e.target;
    // Map inputs loosely for demo simplicity or add names to inputs
    // Adding names to inputs below
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const { name, value } = e.target;
     setFormData(prev => ({...prev, [name]: value}));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Liberação registrada com sucesso!");
    setShowModal(false);
    setFormData({ rai: '', data: '', matricula: '', novaValidade: '', motivo: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gestão de Liberações</h2>
          <p className="text-slate-500 text-sm mt-1">Controle institucional de exceções e revalidação de RAIs.</p>
        </div>
        <button onClick={() => setShowModal(!showModal)} className="px-5 py-2 text-sm font-bold rounded-md bg-blue-600 text-white hover:bg-blue-700 transition">
          {showModal ? 'Ver Lista' : 'Nova Liberação'}
        </button>
      </div>

      {showModal ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-icons-round text-blue-600 text-2xl">add_circle</span>
            <h3 className="text-lg font-bold text-blue-900">Liberar RAI Expirado</h3>
          </div>
          <form className="grid grid-cols-1 md:grid-cols-4 gap-6" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase">Nº RAI</label>
              <input 
                name="rai"
                value={formData.rai}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm" 
                placeholder="00000000" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase">Data RAI</label>
              <input 
                name="data"
                value={formData.data}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm" 
                type="date" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase">Matrícula</label>
              <input 
                name="matricula"
                value={formData.matricula}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm" 
                placeholder="Digite a matrícula" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase">Nova Validade</label>
              <input 
                name="novaValidade"
                value={formData.novaValidade}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm" 
                type="date" 
              />
            </div>
            <div className="md:col-span-3 space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase">Motivo</label>
              <input 
                name="motivo"
                value={formData.motivo}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm" 
                placeholder="Justificativa..." 
              />
            </div>
            <div className="flex items-end">
              <button type="submit" className="w-full bg-green-600 text-white font-bold py-2 rounded-lg hover:bg-green-700">Confirmar</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-bold text-blue-900">Solicitações Aguardando Revalidação</h3>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-100 text-xs text-slate-500 uppercase">
              <tr>
                <th className="px-6 py-3">Policial</th>
                <th className="px-6 py-3">RAI</th>
                <th className="px-6 py-3">Motivo</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <tr>
                <td className="px-6 py-4 font-bold">CB Ricardo Mendes</td>
                <td className="px-6 py-4 font-mono text-blue-600">2024.1120.44</td>
                <td className="px-6 py-4 text-slate-600">Inconsistência no sistema...</td>
                <td className="px-6 py-4"><span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded-full border border-blue-100">EM ANÁLISE</span></td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => alert("Solicitação avaliada.")} className="text-blue-600 hover:bg-blue-50 p-1 rounded font-bold text-xs mr-2">Avaliar</button>
                  <button onClick={() => alert("Solicitação excluída.")} className="text-red-600 hover:bg-red-50 p-1 rounded font-bold text-xs">Deletar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminLiberacoes;