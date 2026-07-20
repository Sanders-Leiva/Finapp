import { useState, useEffect } from 'react';
import { useModal } from '../../context/ModalContext';
import { useStore } from '../../store/useStore';
import { api } from '../../services/api';
import { X, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import Swal from 'sweetalert2';
import type { Currency } from '../../utils/currency';

const ICONS = ['🎯', '✈️', '🏠', '🚗', '🎓', '💍', '💻', '🏥'];
const COLORS = [
  'text-brand bg-brand-light', 
  'text-blue-500 bg-blue-50', 
  'text-purple-500 bg-purple-50', 
  'text-orange-500 bg-orange-50',
  'text-expense bg-red-50',
  'text-yellow-500 bg-yellow-50',
  'text-indigo-500 bg-indigo-50'
];

export const GoalModal = () => {
  const { isGoalModalOpen, closeGoalModal, editingGoal } = useModal();
  const { user, goals, setGoals } = useStore();
  
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [currency, setCurrency] = useState<Currency>('NIO');
  const [icon, setIcon] = useState(ICONS[0]);
  const [color, setColor] = useState(COLORS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingGoal) {
      setName(editingGoal.name);
      setTargetAmount(editingGoal.target_amount.toString());
      setTargetDate(editingGoal.target_date.split('T')[0]); // YYYY-MM-DD
      setCurrency((editingGoal.currency as Currency) || 'NIO');
      setIcon(editingGoal.icon || ICONS[0]);
      setColor(editingGoal.color || COLORS[0]);
    } else {
      setName('');
      setTargetAmount('');
      setTargetDate('');
      setCurrency('NIO');
      setIcon(ICONS[0]);
      setColor(COLORS[0]);
    }
  }, [editingGoal, isGoalModalOpen]);

  if (!isGoalModalOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetAmount || !targetDate) return;
    
    setIsSubmitting(true);
    try {
      const payload = {
        user_id: user.id,
        name,
        target_amount: parseFloat(targetAmount),
        current_amount: editingGoal ? editingGoal.current_amount : 0,
        target_date: new Date(targetDate).toISOString(),
        currency,
        icon
      };

      if (editingGoal) {
        const updated = await api.updateGoal(editingGoal.id, payload);
        setGoals(goals.map(g => g.id === editingGoal.id ? updated : g));
      } else {
        const newGoal = await api.createGoal(payload);
        setGoals([...goals, newGoal]);
      }
      
      closeGoalModal();
      Swal.fire({
        title: editingGoal ? '¡Actualizada!' : '¡Creada!',
        text: 'La meta ha sido guardada.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error: any) {
      console.error("Error saving goal", error);
      Swal.fire('Error', 'No se pudo guardar la meta: ' + (error.message || "Desconocido"), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center sm:p-4 animate-in fade-in duration-200">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={closeGoalModal}
      ></div>
      
      <div className="bg-white w-full h-full sm:h-auto sm:max-h-[90vh] sm:w-[500px] sm:rounded-3xl shadow-2xl relative flex flex-col animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-4 duration-300">
        
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-brand-dark">
            {editingGoal ? 'Editar Meta' : 'Nueva Meta'}
          </h2>
          <button 
            onClick={closeGoalModal}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form id="goalForm" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título de la Meta
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Viaje a Europa"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all text-gray-900"
              />
            </div>

            {/* Target Amount & Currency */}
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Objetivo de Ahorro
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all text-gray-900"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Moneda
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as Currency)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all text-gray-900 appearance-none"
                >
                  <option value="NIO">NIO (C$)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </div>
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha Límite
              </label>
              <input
                type="date"
                required
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all text-gray-900"
              />
            </div>

            {/* Icon & Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Personalización
              </label>
              
              <div className="space-y-4">
                {/* Icons */}
                <div className="flex flex-wrap gap-2">
                  {ICONS.map((i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setIcon(i)}
                      className={clsx(
                        "w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all",
                        icon === i ? "ring-2 ring-brand ring-offset-2 bg-gray-100 scale-110" : "hover:bg-gray-50 opacity-70 hover:opacity-100"
                      )}
                    >
                      {i}
                    </button>
                  ))}
                </div>
                
                {/* Colors */}
                <div className="flex flex-wrap gap-3 mt-4">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={clsx(
                        "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                        c.split(' ')[1] // Use bg color for button
                      )}
                      style={{ border: color === c ? '2px solid #000' : 'none', transform: color === c ? 'scale(1.1)' : 'scale(1)' }}
                    >
                      {color === c && <div className="w-3 h-3 bg-black rounded-full opacity-30"></div>}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </form>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 sm:rounded-b-3xl">
          <div className="flex flex-col-reverse sm:flex-row gap-3">
            <button
              type="button"
              onClick={closeGoalModal}
              className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-200 bg-gray-100 rounded-xl transition-colors sm:w-1/3"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="goalForm"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-sm font-medium text-white bg-brand hover:bg-brand-dark rounded-xl transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 flex-1"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {editingGoal ? 'Actualizar' : 'Crear'} Meta
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
