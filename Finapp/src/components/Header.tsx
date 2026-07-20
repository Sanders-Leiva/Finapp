import { Bell, LogOut, Palette, Plus } from 'lucide-react';
import { useState } from 'react';
import { useModal } from '../context/ModalContext';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabase';

// Props interface removed as no longer needed

export const Header = () => {
  const { openTransactionModal } = useModal();
  const { profile, setProfile } = useStore();
  const [isThemeOpen, setIsThemeOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const changeTheme = async (theme: 'green' | 'pink' | 'dark' | 'dark-pink') => {
    if (!profile) return;
    
    // Optimizacion optimista
    setProfile({ ...profile, theme });
    setIsThemeOpen(false);

    // Guardar en Supabase
    await supabase
      .from('profiles')
      .update({ theme })
      .eq('id', profile.id);
  };

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-6 sticky top-0 z-10 transition-colors duration-500">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Hola, {profile?.name || "Usuario"} 👋
        </h1>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Quick Add Button */}
        <button 
          onClick={() => openTransactionModal()}
          className="hidden sm:flex items-center gap-2 bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Añadir Transacción
        </button>
        
        {/* Mobile Add Button */}
        <button 
          onClick={() => openTransactionModal()}
          className="sm:hidden flex items-center justify-center bg-brand hover:bg-brand-dark text-white w-10 h-10 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <button className="relative p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors hidden sm:block">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand rounded-full border-2 border-white dark:border-gray-900"></span>
        </button>

        {/* Theme Selector */}
        <div className="relative">
          <button 
            onClick={() => setIsThemeOpen(!isThemeOpen)}
            className="p-2 text-gray-400 hover:text-brand hover:bg-brand-light rounded-full transition-colors"
            title="Cambiar Tema"
          >
            <Palette className="w-5 h-5" />
          </button>
          
          {isThemeOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 py-2 z-50">
              <button onClick={() => changeTheme('green')} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-400 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div> Verde Claro
              </button>
              <button onClick={() => changeTheme('pink')} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:text-pink-700 dark:hover:text-pink-400 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-pink-500"></div> Rosa Claro
              </button>
              <button onClick={() => changeTheme('dark')} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-900 dark:bg-white border border-gray-200 dark:border-gray-700"></div> Verde Oscuro
              </button>
              <button onClick={() => changeTheme('dark-pink')} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-pink-900 dark:bg-pink-300 border border-gray-200 dark:border-gray-700"></div> Rosa Oscuro
              </button>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="p-2 text-gray-400 hover:text-expense hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-colors ml-2"
          title="Cerrar Sesión"
        >
          <LogOut className="w-5 h-5" />
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-brand-light flex items-center justify-center border border-brand/20 cursor-pointer">
          <span className="text-brand font-bold text-sm">US</span>
        </div>
      </div>
    </header>
  );
};
