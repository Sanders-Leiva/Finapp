import { Plus, Edit2, Trash2, Loader2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useModal } from '../context/ModalContext';
import { api } from '../services/api';
import { useState } from 'react';
import { formatCurrency } from '../utils/currency';
import type { Currency } from '../utils/currency';
import clsx from 'clsx';
import Swal from 'sweetalert2';

export const Accounts = () => {
  const { accounts, setAccounts } = useStore();
  const { openAccountModal } = useModal();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: '¿Eliminar cuenta?',
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
      await api.deleteAccount(id);
      setAccounts(accounts.filter(a => a.id !== id));
      Swal.fire('¡Eliminada!', 'La cuenta ha sido eliminada.', 'success');
    } catch (error) {
      console.error('Error deleting account', error);
      Swal.fire('Error', 'Hubo un error al eliminar la cuenta.', 'error');
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-brand-dark">Mis Cuentas</h2>
        <button 
          onClick={() => openAccountModal()}
          className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Nueva Cuenta
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <div key={account.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
            {/* Background Decoration */}
            <div className={clsx(
              "absolute -right-8 -top-8 w-24 h-24 rounded-full opacity-10 transition-transform group-hover:scale-110",
              account.color.split(' ')[0]
            )}></div>

            <div className="flex items-start justify-between mb-8 relative z-10">
              <div className={clsx("w-12 h-12 rounded-xl flex items-center justify-center text-2xl", account.color)}>
                {account.icon}
              </div>
              <span className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-xs font-semibold capitalize">
                {account.type === 'bank' ? 'Banco' : 'Efectivo'}
              </span>
            </div>

            <div className="relative z-10">
              <p className="text-sm font-medium text-gray-500 mb-1">{account.name}</p>
              <h3 className={clsx(
                "text-2xl font-bold",
                account.balance < 0 ? "text-expense" : "text-brand-dark"
              )}>
                {formatCurrency(account.balance, account.currency as Currency)}
              </h3>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-50 flex gap-2 relative z-10">
              <button 
                onClick={() => openAccountModal(account)}
                className="flex-1 py-2 text-sm font-semibold text-brand bg-brand-light hover:bg-brand-light/80 rounded-lg transition-colors flex justify-center items-center gap-2"
              >
                <Edit2 className="w-4 h-4" /> Editar
              </button>
              <button 
                onClick={() => handleDelete(account.id)}
                disabled={isDeleting === account.id}
                className="flex-1 py-2 text-sm font-semibold text-expense bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {isDeleting === account.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} Borrar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
