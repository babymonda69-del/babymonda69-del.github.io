
import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { TeamManagement } from './TeamManagement';
import { TaskBoard } from '../Shared/TaskBoard';
import { Users, LayoutDashboard, Database, ShieldAlert } from 'lucide-react';

interface AdminDashboardProps {
  currentUser: UserProfile;
}

type AdminView = 'tasks' | 'team' | 'security';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentUser }) => {
  const [activeView, setActiveView] = useState<AdminView>('tasks');

  const menuItems = [
    { id: 'tasks', label: 'Dashboard de Tareas', icon: LayoutDashboard },
    { id: 'team', label: 'Gestionar Equipo', icon: Users },
    { id: 'security', label: 'Reglas y Seguridad', icon: ShieldAlert },
  ];

  return (
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 shrink-0">
        <nav className="flex md:flex-col gap-2 p-1 bg-white rounded-2xl shadow-sm border border-slate-200">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as AdminView)}
              className={`flex flex-1 md:flex-none items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                activeView === item.id 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
                : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <item.icon size={20} />
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Quick Stats (Static Demo) */}
        <div className="mt-6 hidden md:block p-6 bg-indigo-900 rounded-2xl text-white shadow-lg">
          <Database className="mb-4 text-indigo-300" />
          <h3 className="text-lg font-bold">Estado Real-Time</h3>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-indigo-200">Usuarios Activos</span>
              <span className="font-mono">14</span>
            </div>
            <div className="w-full bg-indigo-800 rounded-full h-1.5">
              <div className="bg-indigo-400 h-1.5 rounded-full w-3/4"></div>
            </div>
            <p className="text-[10px] text-indigo-300">Firestore sync: OK</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <section className="flex-1">
        {activeView === 'tasks' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <header className="mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Progreso Global de Tareas</h2>
              <p className="text-slate-500">Supervisión en tiempo real de todos los flujos de trabajo.</p>
            </header>
            <TaskBoard isAdmin={true} currentUser={currentUser} />
          </div>
        )}

        {activeView === 'team' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <header className="mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Gestión de Equipo</h2>
              <p className="text-slate-500">Añade nuevos miembros y gestiona sus roles y accesos.</p>
            </header>
            <TeamManagement />
          </div>
        )}

        {activeView === 'security' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
             <h2 className="text-2xl font-bold text-slate-800 mb-4">Configuración de Seguridad</h2>
             <p className="text-slate-600 mb-6">
               Como Arquitecto de Software, aquí definimos las <strong>Security Rules</strong> para Firestore:
             </p>
             <div className="bg-slate-900 text-indigo-300 p-6 rounded-xl font-mono text-sm overflow-x-auto">
               <pre>{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper para verificar rol
    function isAdmin() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if isAdmin(); // Solo admins escriben
    }

    match /tasks/{taskId} {
      allow read: if request.auth != null && 
        (isAdmin() || request.auth.uid in resource.data.assignedTo);
      allow create: if isAdmin();
      allow update, delete: if isAdmin();
    }
  }
}`}</pre>
             </div>
             <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-100">
               <h4 className="font-bold text-amber-800 flex items-center gap-2 mb-2">
                 <ShieldAlert size={18} /> Nota Técnica: Creación de Usuarios
               </h4>
               <p className="text-sm text-amber-900 leading-relaxed">
                 Para evitar que el Administrador sea desconectado al crear un nuevo usuario, implementamos 
                 una <strong>Firebase Cloud Function</strong> o usamos un <strong>SDK Secundario</strong>. 
                 La función de servidor (Node.js Admin SDK) registra al usuario sin afectar la sesión del cliente.
               </p>
             </div>
          </div>
        )}
      </section>
    </div>
  );
};
