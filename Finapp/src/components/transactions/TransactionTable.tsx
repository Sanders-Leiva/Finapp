import { Edit2, Trash2, Loader2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useModal } from '../../context/ModalContext';
import { api } from '../../services/api';
import { useState } from 'react';
import { formatCurrency } from '../../utils/currency';
import type { Currency } from '../../utils/currency';
import clsx from 'clsx';
import Swal from 'sweetalert2';

export const TransactionTable = () => {
  const { transactions, setTransactions, accounts, setAccounts } = useStore();
  const { openTransactionModal } = useModal();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: '¿Eliminar transacción?',
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
      const txToDelete = transactions.find(t => t.id === id);
      
      if (txToDelete) {
        const account = accounts.find(a => a.id === txToDelete.account_id);
        if (account) {
          const newBalance = txToDelete.type === 'income' 
            ? account.balance - txToDelete.amount 
            : account.balance + txToDelete.amount;
            
          await api.updateAccount(account.id, { balance: newBalance });
          setAccounts(accounts.map(a => a.id === account.id ? { ...a, balance: newBalance } : a));
        }
      }

      await api.deleteTransaction(id);
      setTransactions(transactions.filter(t => t.id !== id));
      Swal.fire({
        title: '¡Eliminada!',
        text: 'La transacción ha sido eliminada.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error deleting transaction', error);
      Swal.fire('Error', 'Hubo un error al eliminar la transacción.', 'error');
    } finally {
      setIsDeleting(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-US', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
  };

  return (
    <>
      {/* 📱 Mobile View (Cards) */}
      <div className="md:hidden space-y-3">
        {transactions.map((tx) => (
          <div key={tx.id} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 transition-all duration-300 active:scale-[0.98]">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center text-2xl shrink-0">
                  {tx.category === 'food' ? '🛒' : tx.category === 'transport' ? '🚗' : tx.category === 'salary' ? '💰' : '📝'}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white line-clamp-1">{tx.title}</h4>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{formatDate(tx.date)} • {tx.account?.name || 'Cuenta'}</p>
                </div>
              </div>
              <div className="text-right shrink-0 ml-2">
                <p className={clsx(
                  "font-bold text-lg",
                  tx.type === 'income' ? 'text-brand' : 'text-gray-900 dark:text-white'
                )}>
                  {tx.type === 'income' ? '+' : ''}
                  {formatCurrency(Math.abs(tx.amount), tx.currency as Currency)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-gray-50 dark:border-gray-800 pt-3 mt-1">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-brand-50 dark:bg-pink-900/40 text-brand-dark dark:text-pink-200">
                {tx.category}
              </span>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => openTransactionModal(tx)}
                  className="p-2 text-gray-400 hover:text-brand bg-gray-50 hover:bg-brand-50 dark:bg-gray-800 dark:hover:bg-brand-900/20 rounded-lg transition-colors" 
                  title="Editar"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(tx.id)}
                  disabled={isDeleting === tx.id}
                  className="p-2 text-gray-400 hover:text-expense bg-gray-50 hover:bg-red-50 dark:bg-gray-800 dark:hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50" 
                  title="Borrar"
                >
                  {isDeleting === tx.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        ))}
        {transactions.length === 0 && (
          <div className="text-center py-10 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
            <p className="text-gray-500 dark:text-gray-400">No hay transacciones aún.</p>
          </div>
        )}
      </div>

      {/* 💻 Desktop View (Table) */}
      <div className="hidden md:block bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors duration-500">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Detalle</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Categoría</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cuenta</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Monto</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {transactions.map((tx) => (
                <tr key={tx.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                  
                  {/* 1. Icon & Detail */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-brand-light dark:bg-brand-900/20 flex items-center justify-center text-xl shrink-0">
                        {tx.category === 'food' ? '🛒' : tx.category === 'transport' ? '🚗' : tx.category === 'salary' ? '💰' : '📝'}
                      </div>
                      <div>
                        <p className="font-semibold text-brand-dark dark:text-white">{tx.title}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{formatDate(tx.date)}</p>
                      </div>
                    </div>
                  </td>

                  {/* 2. Category Badge */}
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-brand-light dark:bg-pink-900/40 text-brand-dark dark:text-pink-200">
                      {tx.category}
                    </span>
                  </td>

                  {/* 3. Account */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span>{tx.account?.icon || '🏦'}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">{tx.account?.name || 'Cuenta'}</span>
                    </div>
                  </td>

                  {/* 4. Amount */}
                  <td className="py-4 px-6 text-right">
                    <div className={clsx(
                      "text-sm font-bold",
                      tx.type === 'income' ? 'text-brand' : 'text-gray-900 dark:text-white'
                    )}>
                      {tx.type === 'income' ? '+' : ''}
                      {formatCurrency(Math.abs(tx.amount), tx.currency as Currency)}
                    </div>
                  </td>

                  {/* 5. Actions (Hover Magic) */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openTransactionModal(tx)}
                        className="p-2 text-gray-400 hover:text-brand hover:bg-brand-light dark:hover:bg-brand-900/20 rounded-lg transition-colors" 
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(tx.id)}
                        disabled={isDeleting === tx.id}
                        className="p-2 text-gray-400 hover:text-expense hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50" 
                        title="Borrar"
                      >
                        {isDeleting === tx.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500 dark:text-gray-400">
                    No hay transacciones aún.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
