
import React from 'react';
import { UserProfile } from '../../types';
import { TaskBoard } from '../Shared/TaskBoard';
import { Target, Activity, Trophy } from 'lucide-react';

interface WorkerDashboardProps {
  currentUser: UserProfile;
}

export const WorkerDashboard: React.FC<WorkerDashboardProps> = ({ currentUser }) => {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome & Stats Row */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-3xl text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">¡Hola, {currentUser.displayName.split(' ')[0]}!</h2>
            <p className="text-indigo-100 opacity-90 max-w-md">
              Tienes 2 tareas prioritarias pendientes para hoy. Mantén el enfoque en los objetivos de marketing.
            </p>
          </div>
          <Target className="absolute right-[-20px] bottom-[-20px] text-white opacity-10 w-48 h-48" />
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
           <div>
             <div className="flex items-center gap-2 mb-4">
               <Trophy className="text-amber-500" size={20} />
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rendimiento</span>
             </div>
             <p className="text-4xl font-black text-slate-900">85%</p>
             <p className="text-sm text-slate-500 mt-1">Tareas completadas este mes</p>
           </div>
           <div className="w-full bg-slate-100 rounded-full h-2 mt-6">
             <div className="bg-emerald-500 h-2 rounded-full w-[85%]"></div>
           </div>
        </div>
      </section>

      {/* Task List Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
           <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
             <Activity className="text-indigo-600" size={24} />
             Mis Tareas Asignadas
           </h3>
           <div className="flex gap-2">
             <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-500 cursor-pointer hover:bg-slate-50">Todas</span>
             <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-semibold cursor-pointer">Pendientes</span>
           </div>
        </div>
        
        <TaskBoard isAdmin={false} currentUser={currentUser} />
      </section>
    </div>
  );
};
