import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, Link, Outlet } from 'react-router-dom';
import { 
  Login, 
  Register, 
  UserDashboard, 
  RegisterRAI, 
  UserHistory, 
  UserCalendar,
  AdminDashboard,
  AdminDispensas,
  AdminEscala,
  AdminAuditoria,
  AdminNatureza,
  AdminLiberacoes,
  AdminGestaoPoliciais,
  AdminAlmanaque,
  AdminRanking,
  AdminBancoDados,
  AdminConfiguracoes
} from './pages/index.ts';

// --- Components ---

const SidebarItem = ({ icon, label, to, active }: { icon: string; label: string; to: string; active?: boolean }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
      active 
        ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`}
  >
    <span className="material-icons-round text-[20px]">{icon}</span>
    <span>{label}</span>
  </Link>
);

const AdminLayout = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <span className="material-icons-round text-xl">shield</span>
          </div>
          <div>
            <h1 className="font-bold text-slate-900 leading-tight">RAI ENVIOS</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">BPM Terminal</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 space-y-1 py-4">
          <SidebarItem icon="grid_view" label="Painel Geral" to="/admin/dashboard" active={isActive('/admin/dashboard')} />
          <SidebarItem icon="event_busy" label="Dispensas" to="/admin/dispensas" active={isActive('/admin/dispensas')} />
          <SidebarItem icon="calendar_month" label="Escala & Calendário" to="/admin/escala" active={isActive('/admin/escala')} />
          <SidebarItem icon="verified_user" label="Auditoria Produtividade" to="/admin/auditoria" active={isActive('/admin/auditoria')} />
          <SidebarItem icon="description" label="Registrar Natureza" to="/admin/natureza" active={isActive('/admin/natureza')} />
          <SidebarItem icon="lock_open" label="Liberações" to="/admin/liberacoes" active={isActive('/admin/liberacoes')} />
          <SidebarItem icon="groups" label="Gestão de Policiais" to="/admin/policiais" active={isActive('/admin/policiais')} />
          <SidebarItem icon="menu_book" label="Almanaque" to="/admin/almanaque" active={isActive('/admin/almanaque')} />
          <SidebarItem icon="military_tech" label="Ranking Resultados" to="/admin/ranking" active={isActive('/admin/ranking')} />
          <SidebarItem icon="storage" label="Banco de Dados" to="/admin/db" active={isActive('/admin/db')} />
          <SidebarItem icon="settings" label="Configurações" to="/admin/config" active={isActive('/admin/config')} />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <Link to="/" className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <span className="material-icons-round">logout</span>
            Sair
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 flex-shrink-0">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span className="material-icons-round text-lg">menu</span>
            Gestão Administrativa
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-bold text-slate-900">Maj. Anderson Silva</p>
              <p className="text-[10px] text-slate-500 uppercase">Comandante</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-blue-600 text-xs">AS</div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const UserLayout = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <span className="material-icons-round text-xl">verified_user</span>
          </div>
          <div>
            <h1 className="font-bold text-slate-900 leading-tight">RAI ENVIOS</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Operacional</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 space-y-1 py-4">
          <div className="px-4 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Operacional</div>
          <SidebarItem icon="grid_view" label="Dashboard" to="/user/dashboard" active={isActive('/user/dashboard')} />
          <SidebarItem icon="calendar_month" label="Calendário" to="/user/calendario" active={isActive('/user/calendario')} />
          <SidebarItem icon="description" label="Registrar RAI" to="/user/registro" active={isActive('/user/registro')} />
          <SidebarItem icon="history" label="Meu Histórico" to="/user/historico" active={isActive('/user/historico')} />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <Link to="/" className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <span className="material-icons-round">logout</span>
            Sair
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 flex-shrink-0">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span className="material-icons-round text-lg">chrome_reader_mode</span>
            Terminal BPM - Operacional
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Saldo Atual</p>
              <p className="text-lg font-bold text-blue-600 leading-none">0 <span className="text-xs">PTS</span></p>
            </div>
            <button className="relative">
              <span className="material-icons-round text-slate-400">notifications</span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User Routes */}
        <Route path="/user" element={<UserLayout />}>
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="registro" element={<RegisterRAI />} />
          <Route path="historico" element={<UserHistory />} />
          <Route path="calendario" element={<UserCalendar />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="dispensas" element={<AdminDispensas />} />
          <Route path="escala" element={<AdminEscala />} />
          <Route path="auditoria" element={<AdminAuditoria />} />
          <Route path="natureza" element={<AdminNatureza />} />
          <Route path="liberacoes" element={<AdminLiberacoes />} />
          <Route path="policiais" element={<AdminGestaoPoliciais />} />
          <Route path="almanaque" element={<AdminAlmanaque />} />
          <Route path="ranking" element={<AdminRanking />} />
          <Route path="db" element={<AdminBancoDados />} />
          <Route path="config" element={<AdminConfiguracoes />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}