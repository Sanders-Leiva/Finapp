import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Plus } from 'lucide-react';
import clsx from 'clsx';

export const Profiles = () => {
  const { profiles, setActiveProfile, addProfile, removeProfile } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileTheme, setNewProfileTheme] = useState<'green' | 'pink'>('green');

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProfileName.trim()) {
      addProfile({
        name: newProfileName.trim(),
        avatar: '👤', // Default avatar
        theme: newProfileTheme,
      });
      setNewProfileName('');
      setIsAdding(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">¿Quién está usando FinApp?</h1>
        <p className="text-gray-500">Selecciona tu perfil para continuar</p>
      </div>

      <div className="flex flex-wrap justify-center gap-8 max-w-4xl">
        {/* Existing Profiles */}
        {profiles.map((profile) => (
          <div key={profile.id} className="flex flex-col items-center group relative">
            <button
              onClick={() => setActiveProfile(profile.id)}
              className={clsx(
                "w-32 h-32 rounded-2xl flex items-center justify-center text-4xl shadow-sm transition-all transform group-hover:scale-105 border-4",
                profile.theme === 'pink' 
                  ? "bg-pink-100 border-pink-100 group-hover:border-pink-300 text-pink-600" 
                  : "bg-brand-light border-brand-light group-hover:border-brand text-brand-dark"
              )}
            >
              {profile.avatar}
            </button>
            <p className="mt-4 font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
              {profile.name}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if(confirm('¿Eliminar este perfil?')) removeProfile(profile.id);
              }}
              className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200"
            >
              ✕
            </button>
          </div>
        ))}

        {/* Add Profile Button */}
        {!isAdding ? (
          <div className="flex flex-col items-center group">
            <button
              onClick={() => setIsAdding(true)}
              className="w-32 h-32 rounded-2xl flex items-center justify-center text-gray-400 bg-gray-100 border-4 border-transparent hover:border-gray-200 hover:text-gray-600 hover:bg-gray-200 transition-all transform group-hover:scale-105 shadow-sm"
            >
              <Plus className="w-12 h-12" />
            </button>
            <p className="mt-4 font-medium text-gray-500 group-hover:text-gray-700">
              Nuevo Perfil
            </p>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-2xl shadow-xl w-72 animate-in zoom-in-95 duration-200">
            <h3 className="font-bold text-gray-900 mb-4">Crear Perfil</h3>
            <form onSubmit={handleCreateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Nombre</label>
                <input
                  type="text"
                  autoFocus
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                  placeholder="Ej. Sanders"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Color Favorito</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setNewProfileTheme('green')}
                    className={clsx(
                      "flex-1 py-2 rounded-lg text-sm font-medium border-2 transition-colors",
                      newProfileTheme === 'green' ? "border-brand bg-brand-light text-brand-dark" : "border-gray-100 bg-gray-50 text-gray-500"
                    )}
                  >
                    Verde
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewProfileTheme('pink')}
                    className={clsx(
                      "flex-1 py-2 rounded-lg text-sm font-medium border-2 transition-colors",
                      newProfileTheme === 'pink' ? "border-pink-500 bg-pink-50 text-pink-700" : "border-gray-100 bg-gray-50 text-gray-500"
                    )}
                  >
                    Rosa
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="flex-1 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!newProfileName.trim()}
                  className="flex-1 py-2 text-sm font-medium text-white bg-brand hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  Crear
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
