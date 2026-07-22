import { Bell, LogOut, Plus, Sun, Moon } from 'lucide-react';
import { useModal } from '../context/ModalContext';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabase';
import { hapticFeedback } from '../utils/haptics';

// Props interface removed as no longer needed

export const Header = () => {
  const { openTransactionModal } = useModal();
  const { profile, isDarkMode, toggleDarkMode } = useStore();
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleAddClick = () => {
    hapticFeedback.medium();
    openTransactionModal();
  };

  const handleThemeToggle = () => {
    hapticFeedback.light();
    toggleDarkMode();
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
          onClick={handleAddClick}
          className="hidden sm:flex items-center gap-2 bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Añadir Transacción
        </button>
        
        {/* Mobile Add Button */}
        <button 
          onClick={handleAddClick}
          className="sm:hidden flex items-center justify-center bg-brand hover:bg-brand-dark text-white w-10 h-10 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>

        {/* Theme Toggle */}
        <button 
          onClick={handleThemeToggle}
          className="p-2 text-gray-400 hover:text-brand hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          title={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <button className="relative p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors hidden sm:block">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand rounded-full border-2 border-white dark:border-gray-900"></span>
        </button>

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
