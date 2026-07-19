import { Plus, Edit2, Trash2, Loader2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useModal } from '../context/ModalContext';
import { api } from '../services/api';
import { useState } from 'react';
import { formatCurrency } from '../utils/currency';
import type { Currency } from '../utils/currency';
import clsx from 'clsx';
import Swal from 'sweetalert2';

export const Budgets = () => {
  const { budgets, setBudgets, transactions } = useStore();
  const { openBudgetModal } = useModal();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: '¿Eliminar presupuesto?',
      text: "No podrás revertir esta acción.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;
    
    setIsDeleting(id);
    try {
      await api.deleteBudget(id);
      setBudgets(budgets.filter(b => b.id !== id));
      Swal.fire('¡Eliminado!', 'El presupuesto ha sido eliminado.', 'success');
    } catch (error) {
      console.error('Error deleting budget', error);
      Swal.fire('Error', 'Hubo un error al eliminar el presupuesto.', 'error');
    } finally {
      setIsDeleting(null);
    }
  };

  const categoryIconMap: Record<string, string> = {
    food: '🍔',
    transport: '🚗',
    utilities: '💡',
    shopping: '🛍️',
    entertainment: '🎉',
    Comida: '🍔',
    Transporte: '🚗',
    Servicios: '💡',
    Compras: '🛍️',
    Ocio: '🎉'
  };

  const getEnglishCategory = (spanishCategory: string) => {
    const map: Record<string, string> = {
      'Comida': 'food',
      'Transporte': 'transport',
      'Servicios': 'utilities',
      'Compras': 'shopping',
      'Ocio': 'entertainment',
      'Salud': 'health',
      'Educación': 'education',
      'Otros': 'other'
    };
    return map[spanishCategory] || 'other';
  };

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).getTime();

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-brand-dark">Presupuestos</h2>
        <button 
          onClick={() => openBudgetModal()}
          className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Crear Presupuesto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {budgets.map((budget) => {
          const engCategory = getEnglishCategory(budget.category);
          
          const currentMonthSpent = transactions
            .filter(t => t.type === 'expense' && t.category === engCategory)
            .filter(t => {
               const tTime = new Date(t.date).getTime();
               return tTime >= startOfMonth && tTime <= endOfMonth;
            })
            .reduce((sum, t) => sum + t.amount, 0);

          const percentage = Math.min((currentMonthSpent / budget.total_amount) * 100, 100);
          
          let statusColor = "bg-brand";
          if (percentage >= 100) statusColor = "bg-expense";
          else if (percentage >= 80) statusColor = "bg-yellow-400";

          return (
            <div key={budget.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-2xl">
                    {categoryIconMap[budget.category] || budget.icon || '💰'}
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-dark">{budget.category}</h3>
                    <p className="text-xs text-gray-500">Mensual</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(currentMonthSpent, (budget.currency || 'NIO') as Currency)}
                  </span>
                  <span className="text-sm text-gray-400"> / {formatCurrency(budget.total_amount, (budget.currency || 'NIO') as Currency)}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={clsx("h-full rounded-full transition-all duration-1000 ease-out", statusColor)}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              
              <div className="mt-3 text-xs font-medium flex justify-between">
                <span className={percentage >= 100 ? "text-expense" : "text-gray-500"}>
                  {percentage.toFixed(0)}% gastado
                </span>
                <span className="text-gray-400">
                  {formatCurrency(Math.max(budget.total_amount - currentMonthSpent, 0), (budget.currency || 'NIO') as Currency)} restantes
                </span>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-50 flex gap-2">
                <button 
                  onClick={() => openBudgetModal(budget)}
                  className="flex-1 py-2 text-sm font-semibold text-brand bg-brand-light hover:bg-brand-light/80 rounded-lg transition-colors flex justify-center items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" /> Editar
                </button>
                <button 
                  onClick={() => handleDelete(budget.id)}
                  disabled={isDeleting === budget.id}
                  className="flex-1 py-2 text-sm font-semibold text-expense bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {isDeleting === budget.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} Borrar
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
