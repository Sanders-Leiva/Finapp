import { useState, useEffect } from 'react';
import { useModal } from '../../context/ModalContext';
import { useStore } from '../../store/useStore';
import { api } from '../../services/api';
import { X, ChevronDown, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import Swal from 'sweetalert2';
import type { Currency } from '../../utils/currency';

export const TransactionModal = () => {
  const { isTransactionModalOpen, closeTransactionModal, editingTransaction } = useModal();
  const { user, accounts, setAccounts, transactions, setTransactions } = useStore();
  
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [currency, setCurrency] = useState<Currency>('NIO');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('');
  const [accountId, setAccountId] = useState('');
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill if editing
  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setCurrency(editingTransaction.currency as Currency);
      setAmount(editingTransaction.amount.toString());
      setDate(editingTransaction.date.split('T')[0]);
      setCategory(editingTransaction.category);
      setAccountId(editingTransaction.account_id);
      setTitle(editingTransaction.title);
    } else {
      setAmount('');
      setTitle('');
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [editingTransaction, isTransactionModalOpen]);

  // Set default account and category when modal opens
  if (isTransactionModalOpen && accounts.length > 0 && !accountId) {
    setAccountId(accounts[0].id);
  }
  if (isTransactionModalOpen && !category) {
    setCategory(type === 'expense' ? 'food' : 'salary');
  }

  if (!isTransactionModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !amount || !title) return;
    
    setIsSubmitting(true);
    try {
      const numericAmount = parseFloat(amount);
      const payload = {
        user_id: user.id,
        account_id: accountId,
        title,
        amount: numericAmount,
        type,
        category,
        currency,
        date
      };

      const account = accounts.find(a => a.id === accountId);

      if (editingTransaction) {
        // Reverse old transaction effect
        let newBalance = account ? account.balance : 0;
        if (account) {
          newBalance = editingTransaction.type === 'income' 
            ? newBalance - editingTransaction.amount 
            : newBalance + editingTransaction.amount;
            
          // Apply new transaction effect
          newBalance = type === 'income' 
            ? newBalance + numericAmount 
            : newBalance - numericAmount;

          await api.updateAccount(accountId, { balance: newBalance });
          setAccounts(accounts.map(a => a.id === accountId ? { ...a, balance: newBalance } : a));
        }

        const updatedTx = await api.updateTransaction(editingTransaction.id, payload);
        setTransactions(transactions.map(t => t.id === editingTransaction.id ? (updatedTx as import('../../services/api').Transaction) : t));
      } else {
        if (account) {
          const newBalance = type === 'income' 
            ? account.balance + numericAmount 
            : account.balance - numericAmount;
            
          await api.updateAccount(accountId, { balance: newBalance });
          setAccounts(accounts.map(a => a.id === accountId ? { ...a, balance: newBalance } : a));
        }

        const newTx = await api.createTransaction(payload);
        setTransactions([newTx as import('../../services/api').Transaction, ...transactions]);
      }
      
      closeTransactionModal();
      Swal.fire({
        title: editingTransaction ? '¡Actualizada!' : '¡Creada!',
        text: 'La transacción ha sido guardada.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error: any) {
      console.error("Error creating transaction", error);
      Swal.fire('Error', 'Hubo un error al guardar la transacción.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-800">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-brand-dark dark:text-white">
            {editingTransaction ? 'Editar Transacción' : 'Nueva Transacción'}
          </h2>
          <button 
            onClick={closeTransactionModal}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Type Toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-6">
            <button
              onClick={() => setType('income')}
              className={clsx(
                "flex-1 py-2 text-sm font-semibold rounded-lg transition-all",
                type === 'income' ? "bg-white dark:bg-gray-700 text-brand shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              )}
            >
              INGRESO
            </button>
            <button
              onClick={() => setType('expense')}
              className={clsx(
                "flex-1 py-2 text-sm font-semibold rounded-lg transition-all",
                type === 'expense' ? "bg-white dark:bg-gray-700 text-expense shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              )}
            >
              GASTO
            </button>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-colors"
                placeholder="Ej. Compra en el súper..."
                required
              />
            </div>

            {/* Amount & Currency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Monto</label>
              <div className="relative flex items-stretch">
                <div className="relative">
                  <select 
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as Currency)}
                    className="appearance-none h-full py-0 pl-4 pr-8 bg-gray-50 dark:bg-gray-700 border border-r-0 border-gray-200 dark:border-gray-600 rounded-l-xl text-gray-700 dark:text-gray-200 font-bold focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand cursor-pointer"
                  >
                    <option value="NIO">C$</option>
                    <option value="USD">$</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 dark:text-gray-400">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={clsx(
                    "block w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-r-xl text-lg font-bold bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-colors",
                    type === 'income' ? 'text-brand' : 'text-expense'
                  )}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="block w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-colors"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoría</label>
                <div className="relative">
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="appearance-none block w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-colors cursor-pointer"
                  >
                    {type === 'expense' ? (
                      <>
                        <option value="food">Comida 🍔</option>
                        <option value="transport">Transporte 🚗</option>
                        <option value="utilities">Servicios 💡</option>
                        <option value="shopping">Compras 🛍️</option>
                        <option value="entertainment">Ocio 🎉</option>
                        <option value="rent">Alquiler 🏠</option>
                        <option value="health">Salud 💊</option>
                        <option value="education">Educación 📚</option>
                        <option value="other_expense">Otros Gastos 💸</option>
                      </>
                    ) : (
                      <>
                        <option value="salary">Salario 💼</option>
                        <option value="freelance">Freelance 💻</option>
                        <option value="other">Otros 💰</option>
                      </>
                    )}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Account */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cuenta</label>
                <div className="relative">
                  <select 
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                    className="appearance-none block w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-colors cursor-pointer"
                    required
                  >
                    {accounts.map(acc => (
                      <option key={acc.id} value={acc.id}>{acc.name} {acc.icon}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Note */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nota (Opcional)</label>
              <textarea
                rows={2}
                className="block w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-colors resize-none"
                placeholder="Detalles de la transacción..."
              />
            </div>

            {/* Actions */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={closeTransactionModal}
                className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 text-sm font-medium text-white bg-brand hover:bg-brand-dark rounded-xl transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {editingTransaction ? 'Actualizar' : 'Guardar'} Transacción
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};
