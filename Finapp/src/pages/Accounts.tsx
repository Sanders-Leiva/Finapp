import { Plus, Edit2, Trash2, Loader2, CreditCard as CreditCardIcon, CheckCircle2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useModal } from '../context/ModalContext';
import { api } from '../services/api';
import { useState } from 'react';
import { formatCurrency } from '../utils/currency';
import type { Currency } from '../utils/currency';
import clsx from 'clsx';
import Swal from 'sweetalert2';
import { getAccountIcon } from '../utils/icons';

export const Accounts = () => {
  const { accounts, setAccounts } = useStore();
  const { openAccountModal } = useModal();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Local state to track if a card was paid this month
  const [paidMonths, setPaidMonths] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('finapp_paid_months');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const togglePaidStatus = (accountId: string) => {
    const currentMonth = new Date().toISOString().slice(0, 7); // e.g., "2026-07"
    const newPaid = { ...paidMonths };
    
    if (newPaid[accountId] === currentMonth) {
      delete newPaid[accountId]; // Undo
    } else {
      newPaid[accountId] = currentMonth;
    }
    
    setPaidMonths(newPaid);
    localStorage.setItem('finapp_paid_months', JSON.stringify(newPaid));
  };

  const getNextDate = (day: number | null | undefined) => {
    if (!day) return '--';
    const now = new Date();
    let targetMonth = now.getMonth();
    
    // Si el día ya pasó este mes, el próximo evento es el siguiente mes
    if (now.getDate() > day) {
      targetMonth = (targetMonth + 1) % 12;
    }
    
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${day} de ${monthNames[targetMonth]}`;
  };

  const regularAccounts = accounts.filter(a => a.type !== 'credit');
  const creditCards = accounts.filter(a => a.type === 'credit');

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
        <h2 className="text-2xl font-bold text-brand-dark dark:text-white">Mis Cuentas</h2>
        <button 
          onClick={() => openAccountModal()}
          className="flex items-center justify-center gap-2 bg-brand hover:bg-brand-dark text-white w-10 h-10 sm:w-auto sm:h-auto sm:px-4 sm:py-2 rounded-lg font-medium transition-colors text-sm"
        >
          <Plus className="w-5 h-5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Nueva Cuenta</span>
        </button>
      </div>

      {/* Tarjetas de Crédito */}
      {creditCards.length > 0 && (
        <div className="mb-10">
          <h3 className="text-xl font-bold text-brand-dark dark:text-white mb-4 flex items-center gap-2">
            <CreditCardIcon className="w-5 h-5 text-brand" />
            Tarjetas de Crédito
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {creditCards.map((card) => {
              const limit = card.credit_limit || 0;
              // Balance is usually negative representing debt. Available credit is limit + balance (balance is negative).
              const availableCredit = limit + (card.balance > 0 ? -card.balance : card.balance);
              const debt = Math.abs(card.balance);
              const progressPercentage = limit > 0 ? (debt / limit) * 100 : 0;
              
              // Define gradient based on color
              let gradient = 'from-gray-700 to-gray-900';
              if (card.color.includes('blue')) gradient = 'from-blue-600 to-blue-800';
              else if (card.color.includes('purple')) gradient = 'from-purple-600 to-purple-800';
              else if (card.color.includes('brand') || card.color.includes('green')) gradient = 'from-emerald-600 to-teal-800';
              else if (card.color.includes('orange')) gradient = 'from-orange-500 to-red-600';
              else if (card.color.includes('red')) gradient = 'from-red-600 to-rose-900';
              else if (card.color.includes('yellow')) gradient = 'from-yellow-500 to-amber-700';
              else if (card.color.includes('indigo')) gradient = 'from-indigo-600 to-blue-900';

              return (
                <div key={card.id} className="relative group">
                  {/* Glassmorphism Card */}
                  <div className={clsx(
                    "relative overflow-hidden rounded-2xl shadow-lg p-6 text-white transition-transform duration-300 hover:-translate-y-1 bg-gradient-to-br",
                    gradient
                  )}>
                    {/* Glossy overlay */}
                    <div className="absolute top-0 left-0 right-0 h-32 bg-white opacity-5 -skew-y-12 transform origin-top-left"></div>
                    
                    {/* Chip & Brand */}
                    <div className="flex justify-between items-start mb-6 relative z-10">
                      <div className="w-10 h-8 rounded bg-yellow-400/80 border border-yellow-300/50 flex flex-col justify-between p-1 opacity-80">
                        <div className="w-full h-[1px] bg-black/20"></div>
                        <div className="w-full h-[1px] bg-black/20"></div>
                        <div className="w-full h-[1px] bg-black/20"></div>
                      </div>
                      <div className="font-bold tracking-widest text-white/80">
                        {card.name.toUpperCase()}
                      </div>
                    </div>

                    {/* Balance */}
                    <div className="mb-6 relative z-10">
                      <p className="text-xs text-white/70 mb-1 uppercase tracking-wider">Deuda Actual</p>
                      <h3 className="text-3xl font-bold font-mono tracking-tight shadow-sm">
                        {formatCurrency(debt, card.currency as Currency)}
                      </h3>
                    </div>

                    {/* Progress Bar & Available */}
                    <div className="mb-6 relative z-10">
                      <div className="flex justify-between text-xs text-white/80 mb-2">
                        <span>Límite: {formatCurrency(limit, card.currency as Currency)}</span>
                        <span>Disponible: {formatCurrency(availableCredit, card.currency as Currency)}</span>
                      </div>
                      <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={clsx("h-full rounded-full", progressPercentage > 85 ? "bg-red-400" : progressPercentage > 60 ? "bg-yellow-400" : "bg-emerald-400")}
                          style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Dates & Paid Toggle */}
                    <div className="flex justify-between items-center text-xs text-white/70 relative z-10">
                      {paidMonths[card.id] === new Date().toISOString().slice(0, 7) ? (
                        <button 
                          onClick={() => togglePaidStatus(card.id)}
                          className="flex items-center gap-2 text-emerald-300 font-medium bg-emerald-900/50 w-full justify-center px-3 py-2 rounded-xl border border-emerald-500/30 hover:bg-emerald-900/70 transition-colors"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>¡Pagado este mes! (Tocar para deshacer)</span>
                        </button>
                      ) : (
                        <div className="w-full flex justify-between items-end">
                          <div className="flex flex-col gap-1">
                            <div>Próx. Corte: <span className="text-white font-medium">{getNextDate(card.cutoff_date)}</span></div>
                            <div>Pago Límite: <span className="text-white font-medium">{getNextDate(card.payment_date)}</span></div>
                          </div>
                          <button 
                            onClick={() => togglePaidStatus(card.id)}
                            className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg transition-colors font-semibold"
                          >
                            ¿Ya pagaste?
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions (Hidden by default, show on hover or always at bottom) */}
                  <div className="mt-3 flex gap-2">
                    <button 
                      onClick={() => openAccountModal(card)}
                      className="flex-1 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-brand bg-white dark:bg-gray-800 hover:bg-brand-light/30 border border-gray-100 dark:border-gray-700 rounded-lg transition-colors flex justify-center items-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" /> Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(card.id)}
                      disabled={isDeleting === card.id}
                      className="flex-1 py-2 text-sm font-semibold text-expense bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-lg transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                    >
                      {isDeleting === card.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} Borrar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Cuentas de Efectivo y Banco */}
      <div>
        <h3 className="text-xl font-bold text-brand-dark dark:text-white mb-4">
          Cuentas y Efectivo
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularAccounts.map((account) => (
            <div key={account.id} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
              {/* Background Decoration */}
              <div className={clsx(
                "absolute -right-8 -top-8 w-24 h-24 rounded-full opacity-10 transition-transform group-hover:scale-110",
                account.color.split(' ')[0]
              )}></div>

              <div className="flex items-start justify-between mb-8 relative z-10">
                <div className={clsx("w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm border border-black/5 dark:border-white/5", account.color)}>
                  {(() => {
                    const AccIcon = getAccountIcon(account.icon);
                    return <AccIcon className="w-6 h-6" />;
                  })()}
                </div>
                <span className="px-3 py-1 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full text-xs font-semibold capitalize">
                  {account.type === 'bank' ? 'Banco' : 'Efectivo'}
                </span>
              </div>

              <div className="relative z-10">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{account.name}</p>
                <h3 className={clsx(
                  "text-2xl font-bold",
                  account.balance < 0 ? "text-expense" : "text-brand-dark dark:text-white"
                )}>
                  {formatCurrency(account.balance, account.currency as Currency)}
                </h3>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-50 dark:border-gray-800 flex gap-2 relative z-10">
                <button 
                  onClick={() => openAccountModal(account)}
                  className="flex-1 py-2 text-sm font-semibold text-brand bg-brand-light/50 dark:bg-brand/10 hover:bg-brand-light dark:hover:bg-brand/20 rounded-lg transition-colors flex justify-center items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" /> Editar
                </button>
                <button 
                  onClick={() => handleDelete(account.id)}
                  disabled={isDeleting === account.id}
                  className="flex-1 py-2 text-sm font-semibold text-expense bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {isDeleting === account.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} Borrar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
