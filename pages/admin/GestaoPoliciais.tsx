import React, { useState, useRef } from 'react';

// Mock inicial de dados
const initialPoliciais = [
  { id: 1, nome: '1º Sgt S. Junior', matricula: '37123', equipe: 'Alpha', aniversario: '12/05', telefone: '(62) 99988-7766', email: 's.junior@pm.go.gov.br' },
  { id: 2, nome: 'Sd Almeida', matricula: '37124', equipe: 'Bravo', aniversario: '28/09', telefone: '(62) 98877-1122', email: 'almeida@pm.go.gov.br' },
  { id: 3, nome: 'Cb Soares', matricula: '37000', equipe: 'Charlie', aniversario: '15/03', telefone: '(62) 99111-2233', email: 'soares@pm.go.gov.br' },
  { id: 4, nome: 'Sub Ten Marcelo', matricula: '33000', equipe: 'Delta', aniversario: '01/01', telefone: '(62) 99888-0000', email: 'marcelo@pm.go.gov.br' },
  { id: 5, nome: 'Sd Silva', matricula: '37100', equipe: 'Alpha', aniversario: '10/10', telefone: '(62) 99777-6655', email: 'silva@pm.go.gov.br' },
];

const AdminGestaoPoliciais = () => {
  const [policiais, setPoliciais] = useState(initialPoliciais);
  const [search, setSearch] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lógica de filtragem baseada no estado atual
  const filteredPoliciais = policiais.filter((policial) => 
    policial.nome.toLowerCase().includes(search.toLowerCase()) ||
    policial.matricula.includes(search)
  );

  const getEquipeColor = (equipe: string) => {
    switch(equipe.toUpperCase()) {
      case 'ALPHA': return 'bg-blue-100 text-blue-700';
      case 'BRAVO': return 'bg-green-100 text-green-700';
      case 'CHARLIE': return 'bg-orange-100 text-orange-700';
      case 'DELTA': return 'bg-purple-100 text-purple-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  // Manipulador do clique no botão de importar
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  // Manipulador da seleção do arquivo
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulação de processamento de arquivo
      // Aqui você integraria com uma biblioteca como 'xlsx' ou 'papaparse'
      
      const fileName = file.name.toLowerCase();
      if (!fileName.endsWith('.csv') && !fileName.endsWith('.xlsx') && !fileName.endsWith('.xls')) {
        alert("Formato inválido. Por favor, selecione um arquivo Excel (.xlsx, .xls) ou CSV.");
        return;
      }

      // Simulando delay de leitura e adição de dados
      setTimeout(() => {
        const novosDadosSimulados = [
            { id: Date.now(), nome: 'Sd Importado 01', matricula: '99001', equipe: 'Alpha', aniversario: '01/01', telefone: '(62) 0000-0000', email: 'importado1@pm.go.gov.br' },
            { id: Date.now() + 1, nome: 'Cb Importado 02', matricula: '99002', equipe: 'Bravo', aniversario: '02/02', telefone: '(62) 1111-1111', email: 'importado2@pm.go.gov.br' }
        ];
        
        setPoliciais(prev => [...prev, ...novosDadosSimulados]);
        alert(`Arquivo "${file.name}" processado com sucesso! ${novosDadosSimulados.length} policiais adicionados.`);
        
        // Limpa o input para permitir selecionar o mesmo arquivo novamente se necessário
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
      }, 1000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Gestão de Policiais</h2>
      </div>

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

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex gap-4">
        <div className="flex-1 relative">
          <span className="material-icons-round absolute left-3 top-2.5 text-slate-400">search</span>
          <input 
            className="w-full h-10 bg-white border border-slate-200 rounded-lg pl-10 pr-4 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400" 
            placeholder="Pesquisar por Nome ou Matrícula..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        {/* Input Oculto para Arquivo */}
        <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        />

        {/* Botão Importar Excel */}
        <button 
            onClick={handleImportClick}
            className="bg-green-600 text-white px-4 h-10 rounded-lg font-bold text-xs uppercase hover:bg-green-700 transition-colors shadow-sm shadow-green-200 flex items-center gap-2"
        >
            <span className="material-icons-round text-sm">upload_file</span>
            Importar Excel
        </button>

        <button onClick={() => alert("Novo registro de policial")} className="bg-blue-600 text-white px-6 h-10 rounded-lg font-bold text-xs uppercase hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
          Novo Registro
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredPoliciais.length > 0 ? (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-100 text-xs text-slate-500 uppercase">
              <tr>
                <th className="px-6 py-3 font-bold">Policial</th>
                <th className="px-6 py-3 font-bold">Matrícula</th>
                <th className="px-6 py-3 font-bold">Equipe</th>
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
                    <span className={`${getEquipeColor(policial.equipe)} px-2 py-1 rounded text-xs font-bold uppercase`}>
                      {policial.equipe}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{policial.aniversario}</td>
                  <td className="px-6 py-4 text-slate-600 text-xs">{policial.telefone}</td>
                  <td className="px-6 py-4 text-slate-500 text-xs">{policial.email}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => alert(`Editar ${policial.nome}`)} className="text-slate-400 hover:text-blue-600 p-1 rounded-full hover:bg-blue-50 transition-colors" title="Editar">
                        <span className="material-icons-round text-lg">edit</span>
                      </button>
                      <button onClick={() => alert(`Excluir ${policial.nome}`)} className="text-slate-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors" title="Excluir">
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
            <p className="text-slate-400 text-xs mt-1">Tente buscar por outro nome ou matrícula.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminGestaoPoliciais;