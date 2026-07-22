import { useState, useEffect } from 'react';
import { useModal } from '../../context/ModalContext';
import { useStore } from '../../store/useStore';
import { api } from '../../services/api';
import { X, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import Swal from 'sweetalert2';
import type { Currency } from '../../utils/currency';

const CATEGORIES = ['Comida', 'Transporte', 'Servicios', 'Compras', 'Ocio', 'Salud', 'Educación', 'Otros'];
const ICONS = ['🍔', '🚗', '💡', '🛍️', '🎉', '💊', '📚', '💰'];

export const BudgetModal = () => {
  const { isBudgetModalOpen, closeBudgetModal, editingBudget } = useModal();
  const { user, budgets, setBudgets } = useStore();
  
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<Currency>('NIO');
  const [icon, setIcon] = useState(ICONS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingBudget) {
      setCategory(editingBudget.category);
      setAmount(editingBudget.total_amount.toString());
      setCurrency((editingBudget.currency as Currency) || 'NIO');
      setIcon(editingBudget.icon || ICONS[CATEGORIES.indexOf(editingBudget.category)] || '💰');
    } else {
      setCategory(CATEGORIES[0]);
      setAmount('');
      setCurrency('NIO');
      setIcon(ICONS[0]);
    }
  }, [editingBudget, isBudgetModalOpen]);

  if (!isBudgetModalOpen || !user) return null;

  const handleCategorySelect = (cat: string, idx: number) => {
    setCategory(cat);
    setIcon(ICONS[idx]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    
    setIsSubmitting(true);
    try {
      const payload = {
        user_id: user.id,
        category,
        total_amount: parseFloat(amount),
        spent_amount: editingBudget ? editingBudget.spent_amount : 0,
        currency,
        icon
      };

      if (editingBudget) {
        const updated = await api.updateBudget(editingBudget.id, payload);
        setBudgets(budgets.map(b => b.id === editingBudget.id ? updated : b));
      } else {
        const newBudget = await api.createBudget(payload);
        setBudgets([...budgets, newBudget]);
      }
      
      closeBudgetModal();
      Swal.fire({
        title: editingBudget ? '¡Actualizado!' : '¡Creado!',
        text: 'El presupuesto ha sido guardado.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error: any) {
      console.error("Error saving budget", error);
      Swal.fire('Error', 'No se pudo guardar el presupuesto: ' + (error.message || "Desconocido"), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="absolute inset-0"
        onClick={closeBudgetModal}
      ></div>
      
      <div className="bg-white dark:bg-gray-900 w-full max-w-lg overflow-hidden rounded-t-3xl sm:rounded-2xl border-t sm:border border-gray-100 dark:border-gray-800 shadow-2xl relative flex flex-col animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-300 max-h-[90vh]">
        
        {/* Mobile handle */}
        <div className="w-full flex justify-center pt-3 pb-1 sm:hidden shrink-0">
          <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        </div>

        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-brand-dark">
            {editingBudget ? 'Editar Presupuesto' : 'Crear Presupuesto'}
          </h2>
          <button 
            onClick={closeBudgetModal}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form id="budgetForm" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Category Grid */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <div className="grid grid-cols-4 gap-2">
                {CATEGORIES.map((cat, idx) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategorySelect(cat, idx)}
                    className={clsx(
                      "flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-colors",
                      category === cat ? "border-brand bg-brand-light/30 text-brand" : "border-gray-100 bg-white text-gray-500 hover:bg-gray-50"
                    )}
                  >
                    <span className="text-2xl mb-1">{ICONS[idx]}</span>
                    <span className="font-medium text-[10px] leading-tight text-center">{cat}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount & Currency */}
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Límite Mensual
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
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
            
          </form>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 sm:rounded-b-3xl pb-safe">
          <div className="flex flex-col-reverse sm:flex-row gap-3">
            <button
              type="button"
              onClick={closeBudgetModal}
              className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-200 bg-gray-100 rounded-xl transition-colors sm:w-1/3"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="budgetForm"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-sm font-medium text-white bg-brand hover:bg-brand-dark rounded-xl transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 flex-1"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {editingBudget ? 'Actualizar' : 'Guardar'} Presupuesto
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
