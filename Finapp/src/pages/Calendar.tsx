import { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { useModal } from '../context/ModalContext';
import clsx from 'clsx';
import { hapticFeedback } from '../utils/haptics';
import { useEffect } from 'react';

export const Calendar = () => {
  const { reminders } = useStore();
  const { openReminderModal } = useModal();
  
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => {
    hapticFeedback.light();
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    hapticFeedback.light();
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const isRecurringOnDate = (reminder: any, targetDateStr: string) => {
    if (reminder.due_date === targetDateStr) return true;
    if (!reminder.frequency || reminder.frequency === 'none') return false;

    // Use local time for correct comparison
    const targetDate = new Date(`${targetDateStr}T00:00:00`);
    const startDate = new Date(`${reminder.due_date}T00:00:00`);

    if (targetDate < startDate) return false;

    switch (reminder.frequency) {
      case 'daily':
        return true;
      case 'weekly':
        return targetDate.getDay() === startDate.getDay();
      case 'monthly':
        return targetDate.getDate() === startDate.getDate();
      case 'yearly':
        return targetDate.getDate() === startDate.getDate() && targetDate.getMonth() === startDate.getMonth();
      default:
        return false;
    }
  };

  const getDayReminders = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return reminders
      .filter(r => isRecurringOnDate(r, dateStr))
      .map(r => ({ ...r, displayDate: dateStr }));
  };

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const renderCalendarGrid = () => {
    const days = [];
    // Espacios vacíos al inicio
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 sm:h-32 border-b border-r border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20" />);
    }
    
    // Días del mes
    for (let d = 1; d <= daysInMonth; d++) {
      const dayReminders = getDayReminders(d);
      const isToday = new Date().getDate() === d && new Date().getMonth() === currentDate.getMonth() && new Date().getFullYear() === currentDate.getFullYear();
      
      days.push(
        <div 
          key={d} 
          onClick={() => {
            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            openReminderModal({ due_date: dateStr } as any);
          }}
          className={clsx(
            "h-24 sm:h-32 p-1 sm:p-2 border-b border-r border-gray-100 dark:border-gray-800 relative group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors",
            isToday && "bg-brand-50/30 dark:bg-brand-900/10"
          )}
        >
          <span className={clsx(
            "inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm font-medium",
            isToday 
              ? "bg-brand text-white shadow-md shadow-brand/30" 
              : "text-gray-700 dark:text-gray-300 group-hover:bg-gray-200 dark:group-hover:bg-gray-700"
          )}>
            {d}
          </span>
          
          <div className="mt-1 flex flex-col gap-1 overflow-y-auto max-h-[4.5rem] sm:max-h-20 hide-scrollbar">
            {dayReminders.map(r => (
              <div 
                key={r.id}
                onClick={(e) => {
                  e.stopPropagation();
                  openReminderModal(r);
                }}
                className={clsx(
                  "text-[10px] sm:text-xs px-1.5 py-1 rounded truncate transition-opacity hover:opacity-80",
                  (r.paid_dates?.includes(r.displayDate) || (r.frequency === 'none' && r.is_paid))
                    ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400" 
                    : "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400"
                )}
              >
                {r.title}
              </div>
            ))}
          </div>
        </div>
      );
    }
    return days;
  };

  const upcomingReminders = useMemo(() => {
    const today = new Date();
    today.setHours(0,0,0,0);
    
    const upcoming: any[] = [];
    
    // Check next 30 days to find upcoming
    for (let i = 0; i < 30; i++) {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + i);
      const targetDateStr = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}-${String(targetDate.getDate()).padStart(2, '0')}`;
      
      const dayRems = reminders.filter(r => {
        if (!isRecurringOnDate(r, targetDateStr)) return false;
        const isPaidForThisDate = r.paid_dates?.includes(targetDateStr) || (r.frequency === 'none' && r.is_paid);
        return !isPaidForThisDate;
      });
      dayRems.forEach(r => {
        upcoming.push({
          ...r,
          displayDate: targetDateStr
        });
      });
      
      if (upcoming.length >= 5) break;
    }
    
    return upcoming.slice(0, 5);
  }, [reminders]);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'granted' && upcomingReminders.length > 0) {
      const todayStr = new Date().toISOString().split('T')[0];
      const lastNotified = localStorage.getItem('last_notified_date');
      
      if (lastNotified !== todayStr) {
        const dueToday = upcomingReminders.filter(r => r.displayDate === todayStr);
        if (dueToday.length > 0) {
          new Notification('¡Pagos vencen hoy! 💸', {
            body: `Tienes ${dueToday.length} recordatorio(s) de pago para el día de hoy.`,
            icon: '/icon512_maskable.png',
            tag: 'finapp-reminders' // Prevents duplicate notifications
          });
          localStorage.setItem('last_notified_date', todayStr);
        }
      }
    }
  }, [upcomingReminders]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-brand" />
            Calendario de Pagos
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Gestiona tus recordatorios y pagos programados
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => openReminderModal()}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand text-white rounded-xl hover:bg-brand-600 transition-colors shadow-lg shadow-brand/20 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Nuevo Recordatorio</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Calendario Principal */}
        <div className="lg:col-span-3 bg-white dark:bg-gray-900 rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white capitalize">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex items-center gap-2">
              <button 
                onClick={prevMonth}
                className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={nextMonth}
                className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="border-l border-t border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-800/50">
              {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                <div key={day} className="py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 border-b border-r border-gray-100 dark:border-gray-800">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 bg-white dark:bg-gray-900">
              {renderCalendarGrid()}
            </div>
          </div>
        </div>

        {/* Panel Lateral: Próximos Pagos */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" />
              Próximos a vencer
            </h3>
            
            <div className="space-y-3">
              {upcomingReminders.length > 0 ? (
                upcomingReminders.map(r => (
                  <div 
                    key={r.id} 
                    onClick={() => openReminderModal(r)}
                    className="p-3 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-brand/30 hover:bg-brand-50/50 dark:hover:bg-brand-900/10 cursor-pointer transition-all group"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm truncate pr-2">{r.title}</p>
                      <p className="font-bold text-brand text-sm">${r.amount} {r.currency}</p>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{new Date(`${r.displayDate}T00:00:00`).toLocaleDateString()} {r.frequency !== 'none' && r.frequency ? '🔁' : ''}</span>
                      <span className="opacity-0 group-hover:opacity-100 text-brand font-medium transition-opacity">Editar</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <CheckCircle className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No tienes pagos pendientes próximos.</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};
