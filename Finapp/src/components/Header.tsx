import { useState, useRef, useEffect, useMemo } from 'react';
import { Bell, LogOut, Plus, Sun, Moon, Target, PieChart, Clock, AlertTriangle, CheckCircle2, Calendar as CalendarIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../context/ModalContext';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabase';
import { hapticFeedback } from '../utils/haptics';
import Swal from 'sweetalert2';

export const Header = () => {
  const { openTransactionModal } = useModal();
  const { profile, isDarkMode, toggleDarkMode, reminders, budgets, goals } = useStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsMenuOpen(false);
    const result = await Swal.fire({
      title: '¿Cerrar Sesión?',
      text: "Tendrás que volver a ingresar con tus credenciales.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#9ca3af',
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      await supabase.auth.signOut();
    }
  };

  const handleAddClick = () => {
    setIsMenuOpen(false);
    hapticFeedback.medium();
    openTransactionModal();
  };

  const handleThemeToggle = () => {
    setIsMenuOpen(false);
    hapticFeedback.light();
    toggleDarkMode();
  };

  const getInitials = (name: string | undefined | null) => {
    if (!name) return 'US';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const isRecurringOnDate = (reminder: any, targetDateStr: string) => {
    if (reminder.due_date === targetDateStr) return true;
    if (!reminder.frequency || reminder.frequency === 'none') return false;
    const targetDate = new Date(`${targetDateStr}T00:00:00`);
    const startDate = new Date(`${reminder.due_date}T00:00:00`);
    if (targetDate < startDate) return false;
    switch (reminder.frequency) {
      case 'daily': return true;
      case 'weekly': return targetDate.getDay() === startDate.getDay();
      case 'monthly': return targetDate.getDate() === startDate.getDate();
      case 'yearly': return targetDate.getDate() === startDate.getDate() && targetDate.getMonth() === startDate.getMonth();
      default: return false;
    }
  };

  const notifications = useMemo(() => {
    const notifs: any[] = [];
    
    // 1. Reminders (Due today or tomorrow)
    if (reminders && reminders.length > 0) {
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
      
      reminders.forEach(r => {
        // Today
        if (isRecurringOnDate(r, todayStr)) {
          const isPaidForThisDate = r.paid_dates?.includes(todayStr) || (r.frequency === 'none' && r.is_paid);
          if (!isPaidForThisDate) {
            notifs.push({
              id: `rem-${r.id}-today`,
              type: 'reminder',
              title: 'Pago vence hoy',
              message: `Recuerda pagar ${r.title} por ${r.currency} ${r.amount}`,
              icon: Clock,
              color: 'text-orange-500',
              bgColor: 'bg-orange-100 dark:bg-orange-500/20'
            });
          }
        }
        // Tomorrow
        if (isRecurringOnDate(r, tomorrowStr)) {
          const isPaidForThisDate = r.paid_dates?.includes(tomorrowStr) || (r.frequency === 'none' && r.is_paid);
          if (!isPaidForThisDate) {
            notifs.push({
              id: `rem-${r.id}-tomorrow`,
              type: 'reminder',
              title: 'Pago vence mañana',
              message: `Preparate para pagar ${r.title} por ${r.currency} ${r.amount}`,
              icon: CalendarIcon,
              color: 'text-blue-500',
              bgColor: 'bg-blue-100 dark:bg-blue-500/20'
            });
          }
        }
      });
    }

    // 2. Budgets (Near limit > 85%)
    if (budgets && budgets.length > 0) {
      budgets.forEach(b => {
        const percentage = (b.spent_amount / b.total_amount) * 100;
        if (percentage >= 85 && percentage < 100) {
          notifs.push({
            id: `budg-${b.id}`,
            type: 'budget',
            title: 'Presupuesto al límite',
            message: `Has gastado el ${Math.round(percentage)}% de tu presupuesto para ${b.category}.`,
            icon: AlertTriangle,
            color: 'text-red-500',
            bgColor: 'bg-red-100 dark:bg-red-500/20'
          });
        }
      });
    }

    // 3. Goals (Near completion > 90%)
    if (goals && goals.length > 0) {
      goals.forEach(g => {
        const percentage = (g.current_amount / g.target_amount) * 100;
        if (percentage >= 90 && percentage < 100) {
          notifs.push({
            id: `goal-${g.id}`,
            type: 'goal',
            title: '¡Meta casi cumplida!',
            message: `Estás al ${Math.round(percentage)}% de alcanzar tu meta: ${g.name}.`,
            icon: CheckCircle2,
            color: 'text-green-500',
            bgColor: 'bg-green-100 dark:bg-green-500/20'
          });
        }
      });
    }

    return notifs;
  }, [reminders, budgets, goals]);

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-6 sticky top-0 z-40 transition-colors duration-500">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Hola, {profile?.name || "Usuario"} 👋
        </h1>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <h3 className="font-bold text-gray-900 dark:text-white">Notificaciones</h3>
                <span className="text-xs bg-brand-50 text-brand px-2 py-0.5 rounded-full font-medium">
                  {notifications.length} nuevas
                </span>
              </div>
              
              <div className="max-h-80 overflow-y-auto hide-scrollbar">
                {notifications.length > 0 ? (
                  notifications.map(n => (
                    <div key={n.id} className="px-4 py-3 border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors flex gap-3">
                      <div className={`mt-0.5 p-2 rounded-full h-fit flex-shrink-0 ${n.bgColor}`}>
                        <n.icon className={`w-4 h-4 ${n.color}`} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{n.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">{n.message}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center">
                    <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle2 className="w-6 h-6 text-gray-300 dark:text-gray-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Todo al día</p>
                    <p className="text-xs text-gray-500 mt-1">No tienes nuevas notificaciones.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-10 h-10 rounded-full bg-brand-50 dark:bg-brand-900/20 text-brand flex items-center justify-center font-bold text-sm border border-brand/20 hover:bg-brand-100 dark:hover:bg-brand-900/40 transition-colors focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            {getInitials(profile?.name)}
          </button>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{profile?.name || "Usuario"}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Mi Perfil</p>
              </div>
              
              <div className="py-2">
                <button 
                  onClick={handleAddClick}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
                >
                  <Plus className="w-4 h-4 text-brand" />
                  Añadir Transacción
                </button>

                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate('/goals');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
                >
                  <Target className="w-4 h-4 text-indigo-500" />
                  Mis Metas
                </button>
                
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate('/budgets');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
                >
                  <PieChart className="w-4 h-4 text-orange-500" />
                  Presupuestos
                </button>
                
                <button 
                  onClick={handleThemeToggle}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    {isDarkMode ? <Sun className="w-4 h-4 text-orange-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
                    <span>Modo {isDarkMode ? 'Claro' : 'Oscuro'}</span>
                  </div>
                </button>
              </div>
              
              <div className="border-t border-gray-100 dark:border-gray-700 py-2">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
