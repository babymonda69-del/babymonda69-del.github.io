
import React, { useState, useEffect } from 'react';
import { UserProfile, Role } from '../../types';
import { UserPlus, UserCheck, Mail, Key, Shield, Trash2, Search } from 'lucide-react';

export const TeamManagement: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'worker' as Role
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [team, setTeam] = useState<UserProfile[]>([]);

  // Cargar equipo desde la "DB" local al montar
  useEffect(() => {
    loadTeam();
  }, []);

  const loadTeam = () => {
    const dbRaw = localStorage.getItem('thk_users_db');
    if (dbRaw) {
      setTeam(JSON.parse(dbRaw));
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simular retraso de red
    setTimeout(() => {
      const dbRaw = localStorage.getItem('thk_users_db');
      const currentUsers = dbRaw ? JSON.parse(dbRaw) : [];

      // Verificar si el correo ya existe
      if (currentUsers.some((u: any) => u.email === formData.email)) {
        alert('Este correo ya está registrado.');
        setLoading(false);
        return;
      }

      const newUser = {
        uid: `u-${Math.random().toString(36).substr(2, 9)}`,
        email: formData.email,
        password: formData.password, // Guardamos password para el login simulado
        displayName: formData.name,
        role: formData.role,
        createdAt: Date.now()
      };

      const updatedUsers = [...currentUsers, newUser];
      localStorage.setItem('thk_users_db', JSON.stringify(updatedUsers));
      
      setTeam(updatedUsers);
      setLoading(false);
      setSuccess(true);
      setFormData({ name: '', email: '', password: '', role: 'worker' });
      
      setTimeout(() => {
        setSuccess(false);
        setShowForm(false);
      }, 1500);
    }, 1000);
  };

  const deleteUser = (uid: string) => {
    if (window.confirm('¿Estás seguro de eliminar a este miembro?')) {
      const updatedUsers = team.filter(u => u.uid !== uid);
      localStorage.setItem('thk_users_db', JSON.stringify(updatedUsers));
      setTeam(updatedUsers);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nombre o correo..." 
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-100"
        >
          <UserPlus size={18} />
          Nuevo Usuario
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl animate-in fade-in zoom-in duration-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <UserPlus className="text-indigo-600" size={20} />
            Añadir Miembro al Equipo
          </h3>
          
          <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Nombre Completo</label>
              <div className="relative">
                <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  required
                  type="text"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Correo Electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  required
                  type="email"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Contraseña Temporal</label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  required
                  type="password"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Rol</label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <select
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 appearance-none"
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value as Role})}
                >
                  <option value="worker">Trabajador</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
            </div>

            <div className="md:col-span-2 flex justify-end gap-3 mt-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 text-sm font-bold text-slate-500">Cancelar</button>
              <button 
                type="submit" 
                disabled={loading}
                className={`px-8 py-2.5 rounded-xl font-bold text-white transition-all ${success ? 'bg-emerald-500' : 'bg-indigo-600'}`}
              >
                {loading ? 'Creando...' : success ? '¡Listo!' : 'Registrar'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-widest font-bold border-b border-slate-100">
              <th className="px-6 py-4">Usuario</th>
              <th className="px-6 py-4">Rol</th>
              <th className="px-6 py-4">Fecha Alta</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {team.map((member) => (
              <tr key={member.uid} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs shrink-0">
                      {member.displayName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{member.displayName}</p>
                      <p className="text-xs text-slate-500">{member.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                    member.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {member.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-slate-500">
                  {new Date(member.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => deleteUser(member.uid)}
                    className="p-2 text-slate-300 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
