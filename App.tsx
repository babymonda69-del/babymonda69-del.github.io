
import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { WorkerDashboard } from './components/Worker/WorkerDashboard';
import { AuthState, UserProfile } from './types';
import { ShieldCheck, LogOut } from 'lucide-react';

const App: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // 1. Inicializar "Base de Datos" local si no existe
    const db = localStorage.getItem('thk_users_db');
    if (!db) {
      const initialUsers = [
        {
          uid: 'admin-1',
          email: 'admin@thk.com',
          password: 'admin123',
          displayName: 'Administrador THK',
          role: 'admin',
          createdAt: Date.now()
        },
        {
          uid: 'worker-1',
          email: 'trabajador@thk.com',
          password: 'worker123',
          displayName: 'Juan Pérez',
          role: 'worker',
          createdAt: Date.now()
        }
      ];
      localStorage.setItem('thk_users_db', JSON.stringify(initialUsers));
    }

    // 2. Verificar sesión persistente
    const savedUser = localStorage.getItem('thk_user');
    if (savedUser) {
      setAuthState({ user: JSON.parse(savedUser), loading: false, error: null });
    } else {
      setAuthState({ user: null, loading: false, error: null });
    }
  }, []);

  const handleLogin = (user: UserProfile) => {
    localStorage.setItem('thk_user', JSON.stringify(user));
    setAuthState({ user, loading: false, error: null });
  };

  const handleLogout = () => {
    localStorage.removeItem('thk_user');
    setAuthState({ user: null, loading: false, error: null });
  };

  if (authState.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!authState.user) {
    return <Login onLogin={handleLogin} />;
  }

  const DashboardWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="font-bold text-slate-800 tracking-tight text-sm md:text-base">THK MARKETING</h1>
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">
              Portal {authState.user?.role}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900">{authState.user?.displayName}</p>
            <p className="text-xs text-slate-500">{authState.user?.email}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Cerrar Sesión</span>
          </button>
        </div>
      </header>
      <main className="flex-1 bg-slate-50 p-4 md:p-8">
        {children}
      </main>
    </div>
  );

  return (
    <DashboardWrapper>
      {authState.user.role === 'admin' ? (
        <AdminDashboard currentUser={authState.user} />
      ) : (
        <WorkerDashboard currentUser={authState.user} />
      )}
    </DashboardWrapper>
  );
};

export default App;
