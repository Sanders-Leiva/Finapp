import { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, Type, CheckCircle, Repeat, ChevronDown } from 'lucide-react';
import { useModal } from '../../context/ModalContext';
import { useStore } from '../../store/useStore';
import { api } from '../../services/api';
import clsx from 'clsx';
import { hapticFeedback } from '../../utils/haptics';

export const ReminderModal = () => {
  const { isReminderModalOpen, closeReminderModal, editingReminder } = useModal();
  const { user, refreshData } = useStore();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    currency: 'NIO',
    due_date: new Date().toISOString().split('T')[0],
    is_paid: false,
    frequency: 'none' as 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly',
  });

  useEffect(() => {
    if (isReminderModalOpen) {
      if (editingReminder) {
        setFormData({
          title: editingReminder.title,
          amount: editingReminder.amount.toString(),
          currency: editingReminder.currency,
          due_date: editingReminder.due_date,
          is_paid: editingReminder.frequency === 'none' 
            ? editingReminder.is_paid 
            : (editingReminder.paid_dates?.includes((editingReminder as any).displayDate) || false),
          frequency: editingReminder.frequency || 'none',
        });
      } else {
        setFormData({
          title: '',
          amount: '',
          currency: 'NIO',
          due_date: new Date().toISOString().split('T')[0],
          is_paid: false,
          frequency: 'none',
        });
      }
    }
  }, [isReminderModalOpen, editingReminder]);

  if (!isReminderModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      let newPaidDates = editingReminder?.paid_dates || [];
      if (formData.frequency !== 'none' && (editingReminder as any)?.displayDate) {
        const dDate = (editingReminder as any).displayDate;
        if (formData.is_paid) {
          if (!newPaidDates.includes(dDate)) newPaidDates = [...newPaidDates, dDate];
        } else {
          newPaidDates = newPaidDates.filter(d => d !== dDate);
        }
      }

      const data = {
        user_id: user.id,
        title: formData.title,
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        due_date: formData.due_date,
        is_paid: formData.frequency === 'none' ? formData.is_paid : (editingReminder?.is_paid || false),
        paid_dates: newPaidDates,
        frequency: formData.frequency,
      };

      if (editingReminder) {
        await api.updateReminder(editingReminder.id, data);
      } else {
        await api.createReminder(data);
      }

      await refreshData();
      hapticFeedback.success();
      closeReminderModal();
    } catch (error) {
      console.error('Error saving reminder:', error);
      hapticFeedback.heavy();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!editingReminder) return;
    if (confirm('¿Estás seguro de que deseas eliminar este recordatorio?')) {
      setIsSubmitting(true);
      try {
        await api.deleteReminder(editingReminder.id);
        await refreshData();
        hapticFeedback.success();
        closeReminderModal();
      } catch (error) {
        console.error('Error deleting reminder:', error);
        hapticFeedback.heavy();
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-0">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={closeReminderModal}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {editingReminder ? 'Editar Recordatorio' : 'Nuevo Recordatorio'}
          </h2>
          <button
            onClick={closeReminderModal}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Título del Pago</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Type className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="block w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-0 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-brand focus:bg-white dark:focus:bg-gray-900 transition-all sm:text-sm"
                placeholder="Ej. Alquiler, Internet, etc."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Monto</label>
            <div className="relative flex items-stretch h-[3.25rem]">
              <div className="relative">
                <select 
                  value={formData.currency}
                  onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                  className="appearance-none h-full py-0 pl-4 pr-8 bg-gray-100 dark:bg-gray-700 border-0 rounded-l-xl text-gray-700 dark:text-gray-200 font-bold focus:ring-2 focus:ring-brand cursor-pointer focus:z-10 relative transition-all"
                >
                  <option value="NIO">C$</option>
                  <option value="USD">$</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 dark:text-gray-400 z-10">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                className="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-0 text-brand dark:text-brand rounded-r-xl focus:ring-2 focus:ring-brand focus:bg-white dark:focus:bg-gray-900 transition-all text-lg font-bold"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Fecha de Vencimiento</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  required
                  value={formData.due_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                  className="block w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-0 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-brand focus:bg-white dark:focus:bg-gray-900 transition-all sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Repetir</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Repeat className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value as any }))}
                  className="block w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-0 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-brand focus:bg-white dark:focus:bg-gray-900 transition-all sm:text-sm"
                >
                  <option value="none">Nunca (Pago único)</option>
                  <option value="daily">Diariamente</option>
                  <option value="weekly">Semanalmente</option>
                  <option value="monthly">Mensualmente</option>
                  <option value="yearly">Anualmente</option>
                </select>
              </div>
            </div>
          </div>

          <label className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl cursor-pointer select-none">
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                checked={formData.is_paid}
                onChange={(e) => setFormData(prev => ({ ...prev, is_paid: e.target.checked }))}
                className="peer sr-only"
              />
              <div className={clsx(
                "w-6 h-6 rounded border-2 flex items-center justify-center transition-colors",
                formData.is_paid 
                  ? "bg-brand border-brand text-white" 
                  : "border-gray-300 dark:border-gray-600 text-transparent"
              )}>
                <CheckCircle className="w-4 h-4" strokeWidth={3} />
              </div>
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white text-sm">Marcar como pagado</p>
              <p className="text-xs text-gray-500">¿Ya realizaste este pago?</p>
            </div>
          </label>

          <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            {editingReminder && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting}
                className="px-6 py-3 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-500/10 rounded-xl hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors disabled:opacity-50"
              >
                Eliminar
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 text-sm font-medium text-white bg-brand rounded-xl hover:bg-brand-600 shadow-lg shadow-brand/25 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isSubmitting ? 'Guardando...' : editingReminder ? 'Guardar Cambios' : 'Crear Recordatorio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
