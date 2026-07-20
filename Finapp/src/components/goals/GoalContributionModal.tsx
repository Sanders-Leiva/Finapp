import { useState, useEffect } from 'react';
import { useModal } from '../../context/ModalContext';
import { useStore } from '../../store/useStore';
import { api } from '../../services/api';
import { X, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { formatCurrency } from '../../utils/currency';
import type { Currency } from '../../utils/currency';

export const GoalContributionModal = () => {
  const { isGoalContributionModalOpen, closeGoalContributionModal, contributingGoal } = useModal();
  const { goals, setGoals } = useStore();
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isGoalContributionModalOpen) {
      setAmount('');
    }
  }, [isGoalContributionModalOpen]);

  if (!isGoalContributionModalOpen || !contributingGoal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

    setIsSubmitting(true);
    try {
      const newAmount = contributingGoal.current_amount + parseFloat(amount);
      await api.updateGoal(contributingGoal.id, { current_amount: newAmount });
      
      setGoals(goals.map(g => g.id === contributingGoal.id ? { ...g, current_amount: newAmount } : g));
      
      closeGoalContributionModal();
      Swal.fire({
        title: '¡Aporte exitoso!',
        text: `Has aportado ${formatCurrency(parseFloat(amount), (contributingGoal.currency || 'NIO') as Currency)} a tu meta.`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error contributing to goal', error);
      Swal.fire('Error', 'Hubo un error al guardar el aporte.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-800">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex flex-col-reverse items-center justify-between">
          <h2 className="text-xl font-bold text-brand-dark dark:text-white">
            Aportar a Meta
          </h2>
          <button 
            onClick={closeGoalContributionModal}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-brand-light dark:bg-brand-900/20 text-brand text-3xl flex items-center justify-center mx-auto mb-4">
              {contributingGoal.icon}
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white">{contributingGoal.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Progreso actual: {formatCurrency(contributingGoal.current_amount, (contributingGoal.currency || 'NIO') as Currency)}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Monto a aportar</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
                  {contributingGoal.currency === 'USD' ? '$' : 'C$'}
                </span>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-lg font-bold focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-colors"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={closeGoalContributionModal}
                className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !amount}
                className="px-5 py-2.5 text-sm font-medium text-white bg-brand hover:bg-brand-dark rounded-xl transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Aportar Dinero
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
