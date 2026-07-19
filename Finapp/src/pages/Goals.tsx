import { Plus, Edit2, Trash2, Loader2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useModal } from '../context/ModalContext';
import { api } from '../services/api';
import { useState } from 'react';
import { formatCurrency } from '../utils/currency';
import type { Currency } from '../utils/currency';
import { PieChart, Pie, Cell } from 'recharts';
import clsx from 'clsx';
import Swal from 'sweetalert2';

export const Goals = () => {
  const { goals, setGoals } = useStore();
  const { openGoalModal } = useModal();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: '¿Eliminar meta?',
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
      await api.deleteGoal(id);
      setGoals(goals.filter(g => g.id !== id));
      Swal.fire('¡Eliminada!', 'La meta ha sido eliminada.', 'success');
    } catch (error) {
      console.error('Error deleting goal', error);
      Swal.fire('Error', 'Hubo un error al eliminar la meta.', 'error');
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-brand-dark">Mis Metas</h2>
        <button 
          onClick={() => openGoalModal()}
          className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Nueva Meta
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const percentage = Math.min((goal.current_amount / goal.target_amount) * 100, 100);
          const donutData = [
            { name: 'Completado', value: percentage },
            { name: 'Faltante', value: 100 - percentage },
          ];

          return (
            <div key={goal.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="flex items-start justify-between mb-6 relative z-10">
                <div>
                  <div className={clsx("w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4", goal.color || 'bg-brand-light text-brand')}>
                    {goal.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{goal.name}</h3>
                  <p className="text-xs text-gray-500">Objetivo para {new Date(goal.target_date).toLocaleDateString()}</p>
                </div>
                
                <div className="w-16 h-16 relative">
                  <PieChart width={64} height={64}>
                    <Pie
                      data={donutData}
                      cx={28}
                      cy={28}
                      innerRadius={20}
                      outerRadius={28}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                      stroke="none"
                    >
                      <Cell fill="#10B981" />
                      <Cell fill="#F3F4F6" />
                    </Pie>
                  </PieChart>
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-brand-dark pl-2 pb-2">
                    {percentage.toFixed(0)}%
                  </div>
                </div>
              </div>

              <div className="mb-6 relative z-10">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-2xl font-bold text-brand-dark">
                    {formatCurrency(goal.current_amount, (goal.currency || 'NIO') as Currency)}
                  </span>
                </div>
                <p className="text-sm text-gray-400">
                  de {formatCurrency(goal.target_amount, (goal.currency || 'NIO') as Currency)}
                </p>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => openGoalModal(goal)}
                  className="flex-1 py-2.5 text-sm font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Editar
                </button>
                <button 
                  onClick={() => handleDelete(goal.id)}
                  disabled={isDeleting === goal.id}
                  className="flex-1 py-2.5 text-sm font-semibold text-expense bg-red-50 hover:bg-red-100 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isDeleting === goal.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  Borrar
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
