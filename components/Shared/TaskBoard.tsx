
import React, { useState } from 'react';
import { Task, UserProfile } from '../../types';
import { Plus, CheckCircle2, Clock, AlertCircle, Calendar, User, Tag } from 'lucide-react';

interface TaskBoardProps {
  isAdmin: boolean;
  currentUser: UserProfile;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({ isAdmin, currentUser }) => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 't1',
      title: 'Lanzamiento Campaña Google Ads',
      description: 'Configurar conversiones y subir creatividades para cliente X.',
      status: 'pending',
      assignedTo: ['worker-1', 'worker-2'],
      createdBy: 'admin-1',
      createdAt: Date.now(),
      priority: 'high'
    },
    {
      id: 't2',
      title: 'Revisión SEO Mensual',
      description: 'Analizar backlinks y actualizar meta descripciones.',
      status: 'in-progress',
      assignedTo: ['worker-1'],
      createdBy: 'admin-1',
      createdAt: Date.now() - 86400000,
      priority: 'medium'
    },
    {
      id: 't3',
      title: 'Diseño Landing Page Promocional',
      description: 'Nueva landing para el evento de verano.',
      status: 'completed',
      assignedTo: ['worker-2'],
      createdBy: 'admin-1',
      createdAt: Date.now() - 172800000,
      priority: 'low'
    }
  ]);

  const [showCreate, setShowCreate] = useState(false);

  // Filter tasks based on role
  const filteredTasks = isAdmin 
    ? tasks 
    : tasks.filter(t => t.assignedTo.includes(currentUser.uid));

  const getPriorityColor = (p: string) => {
    switch(p) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-amber-100 text-amber-700';
      default: return 'bg-emerald-100 text-emerald-700';
    }
  };

  const getStatusIcon = (s: string) => {
    switch(s) {
      case 'completed': return <CheckCircle2 className="text-emerald-500" size={18} />;
      case 'in-progress': return <Clock className="text-indigo-500" size={18} />;
      default: return <AlertCircle className="text-slate-400" size={18} />;
    }
  };

  return (
    <div className="space-y-6">
      {isAdmin && (
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200">
           <div className="flex gap-4">
             <div className="text-center px-4 border-r border-slate-100">
               <p className="text-[10px] font-bold text-slate-400 uppercase">Totales</p>
               <p className="text-xl font-bold text-slate-800">{tasks.length}</p>
             </div>
             <div className="text-center px-4">
               <p className="text-[10px] font-bold text-slate-400 uppercase">En Proceso</p>
               <p className="text-xl font-bold text-indigo-600">{tasks.filter(t => t.status === 'in-progress').length}</p>
             </div>
           </div>
           <button 
             onClick={() => setShowCreate(!showCreate)}
             className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
           >
             <Plus size={18} /> Crear Tarea
           </button>
        </div>
      )}

      {/* Creation Modal (Simplified) */}
      {showCreate && (
        <div className="bg-white p-6 rounded-2xl border border-indigo-200 shadow-xl animate-in slide-in-from-top-4 duration-300">
           <h3 className="font-bold text-slate-800 mb-4">Nueva Tarea Estratégica</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <input type="text" placeholder="Título de la tarea" className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:border-indigo-500" />
             <select className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:border-indigo-500">
               <option>Prioridad Alta</option>
               <option>Prioridad Media</option>
               <option>Prioridad Baja</option>
             </select>
             <textarea className="md:col-span-2 w-full p-3 bg-slate-50 border rounded-xl outline-none focus:border-indigo-500 h-24" placeholder="Descripción detallada..."></textarea>
             <div className="md:col-span-2 flex justify-end gap-3">
               <button onClick={() => setShowCreate(false)} className="px-6 py-2 text-slate-400 font-bold">Cancelar</button>
               <button className="bg-indigo-600 text-white px-8 py-2 rounded-xl font-bold">Guardar Tarea</button>
             </div>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.map(task => (
          <div key={task.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col group">
            <div className="flex justify-between items-start mb-3">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
              {getStatusIcon(task.status)}
            </div>
            
            <h4 className="font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
              {task.title}
            </h4>
            <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">
              {task.description}
            </p>

            <div className="pt-4 border-t border-slate-100 mt-auto space-y-3">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-1.5 text-xs text-slate-400">
                   <Calendar size={14} />
                   <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                 </div>
                 <div className="flex -space-x-2">
                   {task.assignedTo.map((id, i) => (
                     <div key={i} className="w-6 h-6 rounded-full bg-indigo-50 border-2 border-white flex items-center justify-center text-[10px] font-bold text-indigo-600">
                        {id.charAt(0).toUpperCase()}
                     </div>
                   ))}
                 </div>
               </div>
               
               {!isAdmin && task.status !== 'completed' && (
                 <button className="w-full py-2 bg-slate-100 hover:bg-emerald-500 hover:text-white rounded-lg text-xs font-bold transition-all text-slate-600 flex items-center justify-center gap-2">
                   <CheckCircle2 size={14} /> Marcar como completada
                 </button>
               )}
            </div>
          </div>
        ))}
        {filteredTasks.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-300">
            <Tag size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-medium">No se encontraron tareas asignadas.</p>
          </div>
        )}
      </div>
    </div>
  );
};
