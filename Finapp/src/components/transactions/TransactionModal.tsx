import { useState, useEffect } from 'react';
import { useModal } from '../../context/ModalContext';
import { useStore } from '../../store/useStore';
import { api } from '../../services/api';
import { X, ChevronDown, Loader2, Sparkles } from 'lucide-react';
import clsx from 'clsx';
import Swal from 'sweetalert2';
import { GoogleGenAI } from '@google/genai';
import type { Currency } from '../../utils/currency';
import { getSubCategoryLabel } from '../../utils/icons';

const SUB_CATEGORIES: Record<string, string[]> = {
  food: ['supermarket', 'restaurants', 'delivery', 'coffee'],
  transport: ['fuel', 'uber_taxi', 'public_transport', 'maintenance'],
  utilities: ['electricity', 'water', 'internet', 'phone'],
  shopping: ['clothing', 'electronics', 'gifts'],
  health: ['pharmacy', 'doctor', 'insurance']
};

export const TransactionModal = () => {
  const { isTransactionModalOpen, closeTransactionModal, editingTransaction } = useModal();
  const { user, accounts, setAccounts, transactions, setTransactions } = useStore();
  
  const [type, setType] = useState<'income' | 'expense' | 'transfer'>('expense');
  const [currency, setCurrency] = useState<Currency>('NIO');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [accountId, setAccountId] = useState('');
  const [destinationAccountId, setDestinationAccountId] = useState('');
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [isParsingAI, setIsParsingAI] = useState(false);

  // Pre-fill if editing or set defaults
  useEffect(() => {
    if (isTransactionModalOpen) {
      if (editingTransaction) {
        setType(editingTransaction.type as 'income' | 'expense' | 'transfer');
        setCurrency(editingTransaction.currency as Currency);
        setAmount(editingTransaction.amount.toString());
        setDate(editingTransaction.date.split('T')[0]);
        const parts = editingTransaction.category.split(':');
        setCategory(parts[0]);
        setSubCategory(parts[1] || '');
        setAccountId(editingTransaction.account_id);
        setTitle(editingTransaction.title);
      } else {
        setAmount('');
        setTitle('');
        setDate(new Date().toISOString().split('T')[0]);
        
        // Ensure defaults are set
        if (accounts.length > 0) {
          setAccountId(accounts[0].id);
          if (accounts.length > 1) {
            setDestinationAccountId(accounts[1].id);
          } else {
            setDestinationAccountId(accounts[0].id);
          }
        }
        const defaultCat = type === 'expense' ? 'food' : (type === 'income' ? 'salary' : 'transfer');
        setCategory(defaultCat);
        setSubCategory('');
      }
    }
  }, [editingTransaction, isTransactionModalOpen, accounts]);

  if (!isTransactionModalOpen) return null;

  const handleAIParse = async () => {
    if (!aiInput.trim()) return;
    setIsParsingAI(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error("API Key faltante");
      
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
        Analiza el siguiente texto y extrae los datos para una transacción financiera.
        Texto: "${aiInput}"
        
        Devuelve SOLO un objeto JSON válido con las siguientes claves y nada más:
        - "amount": número (el monto).
        - "type": "income" o "expense" o "transfer".
        - "category": una categoría principal válida (food, transport, utilities, shopping, health, education, rent, entertainment, salary, freelance, other, transfer).
        - "subCategory": una sub-categoría válida si aplica (supermarket, restaurants, delivery, coffee, fuel, uber_taxi, public_transport, maintenance, electricity, water, internet, phone, clothing, electronics, gifts, pharmacy, doctor, insurance). Déjalo vacío "" si no aplica.
        - "title": un título corto y descriptivo (ej. "McDonalds").
        - "currency": "NIO" o "USD". Asume "NIO" por defecto si no se menciona dólares o $.
        
        No incluyas markdown como \`\`\`json, devuelve únicamente el JSON raw.
      `;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt
      });
      
      let text = response.text || '';
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      
      const data = JSON.parse(text);
      
      if (data.amount) setAmount(data.amount.toString());
      if (data.type) setType(data.type as any);
      if (data.category) setCategory(data.category);
      if (data.subCategory) setSubCategory(data.subCategory);
      if (data.title) setTitle(data.title);
      if (data.currency) setCurrency(data.currency as any);
      
      setAiInput('');
      Swal.fire({
        title: '¡Magia!',
        text: 'Formulario autocompletado.',
        icon: 'success',
        timer: 1000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No pude entender el texto o falló la IA. Intenta ser más claro.', 'error');
    } finally {
      setIsParsingAI(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !amount || !title) return;
    
    setIsSubmitting(true);
    try {
      const numericAmount = parseFloat(amount);
      const finalCategory = subCategory ? `${category}:${subCategory}` : category;
      const basePayload = {
        user_id: user.id,
        title,
        amount: numericAmount,
        category: finalCategory,
        currency,
        date
      };

      const account = accounts.find(a => a.id === accountId);

      if (editingTransaction) {
        // ... omitted update logic for brevity, transferring editing is hard if it was a double entry. 
        // For simplicity, we just allow updating the single transaction as usual.
        const newAccounts = [...accounts];
        
        // --- 1. REVERSE OLD TRANSACTION EFFECT ---
        const oldAccIndex = newAccounts.findIndex(a => a.id === editingTransaction.account_id);
        if (oldAccIndex !== -1) {
          if (editingTransaction.type === 'income') {
            newAccounts[oldAccIndex] = { ...newAccounts[oldAccIndex], balance: newAccounts[oldAccIndex].balance - editingTransaction.amount };
          } else {
            newAccounts[oldAccIndex] = { ...newAccounts[oldAccIndex], balance: newAccounts[oldAccIndex].balance + editingTransaction.amount };
          }
        }

        // --- 2. APPLY NEW TRANSACTION EFFECT ---
        const newAccIndex = newAccounts.findIndex(a => a.id === accountId);
        if (newAccIndex !== -1) {
          if (type === 'income') {
            newAccounts[newAccIndex] = { ...newAccounts[newAccIndex], balance: newAccounts[newAccIndex].balance + numericAmount };
          } else {
            newAccounts[newAccIndex] = { ...newAccounts[newAccIndex], balance: newAccounts[newAccIndex].balance - numericAmount };
          }
        }

        // --- 3. UPDATE DB FOR CHANGED ACCOUNTS ---
        const accountsToUpdate = new Set([editingTransaction.account_id, accountId]);
        for (const id of accountsToUpdate) {
          const accToUpdate = newAccounts.find(a => a.id === id);
          if (accToUpdate) {
            await api.updateAccount(id, { balance: accToUpdate.balance });
          }
        }

        // --- 4. UPDATE TRANSACTION ---
        const updatedTx = await api.updateTransaction(editingTransaction.id, {
          ...basePayload,
          account_id: accountId,
          type: type as 'income' | 'expense'
        });
        setAccounts(newAccounts);
        setTransactions(transactions.map(t => t.id === editingTransaction.id ? (updatedTx as import('../../services/api').Transaction) : t));
      } else {
        if (type === 'transfer') {
          // Double entry for transfer
          const sourceAccount = accounts.find(a => a.id === accountId);
          const destAccount = accounts.find(a => a.id === destinationAccountId);
          
          if (sourceAccount && destAccount) {
            // Expense from source
            const sourceNewBalance = sourceAccount.balance - numericAmount;
            await api.updateAccount(accountId, { balance: sourceNewBalance });
            
            // Income to dest
            const destNewBalance = destAccount.balance + numericAmount;
            await api.updateAccount(destinationAccountId, { balance: destNewBalance });

            const newAccountsState = accounts.map(a => {
              if (a.id === accountId) return { ...a, balance: sourceNewBalance };
              if (a.id === destinationAccountId) return { ...a, balance: destNewBalance };
              return a;
            });
            setAccounts(newAccountsState);

            const txExpense = await api.createTransaction({
              ...basePayload,
              account_id: accountId,
              type: 'expense',
              category: 'transfer'
            });
            
            const txIncome = await api.createTransaction({
              ...basePayload,
              account_id: destinationAccountId,
              type: 'income',
              category: 'transfer'
            });

            setTransactions([txIncome as import('../../services/api').Transaction, txExpense as import('../../services/api').Transaction, ...transactions]);
          }
        } else {
          // Normal income/expense
          if (account) {
            const newBalance = type === 'income' 
              ? account.balance + numericAmount 
              : account.balance - numericAmount;
              
            await api.updateAccount(accountId, { balance: newBalance });
            setAccounts(accounts.map(a => a.id === accountId ? { ...a, balance: newBalance } : a));
          }

          const newTx = await api.createTransaction({
            ...basePayload,
            account_id: accountId,
            type: type as 'income' | 'expense'
          });
          setTransactions([newTx as import('../../services/api').Transaction, ...transactions]);
        }
      }
      
      closeTransactionModal();
      Swal.fire({
        title: editingTransaction ? '¡Actualizada!' : '¡Creada!',
        text: 'La transacción ha sido guardada.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error: unknown) {
      console.error("Error creating transaction", error);
      Swal.fire('Error', 'Hubo un error al guardar la transacción.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 w-full max-w-lg overflow-hidden rounded-t-3xl sm:rounded-2xl border-t sm:border border-gray-100 dark:border-gray-800 shadow-2xl animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-300">
        
        {/* Mobile handle */}
        <div className="w-full flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        </div>

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
          {accounts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">🏦</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">¡Casi listo!</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Para registrar tus movimientos, primero necesitas crear una cuenta (efectivo, banco, etc).
              </p>
              <button
                type="button"
                onClick={closeTransactionModal}
                className="px-6 py-2.5 text-sm font-medium text-white bg-brand hover:bg-brand-dark rounded-xl transition-colors shadow-sm"
              >
                Entendido
              </button>
            </div>
          ) : (
            <>
              {/* AI Quick Entry */}
              {!editingTransaction && (
                <div className="mb-6 relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-brand to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                  <div className="relative flex items-center bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-1 shadow-sm">
                    <div className="pl-3 pr-2 text-brand">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAIParse();
                        }
                      }}
                      placeholder="Ej: Gasté 200 en McDonald's..."
                      className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 py-3"
                    />
                    <button
                      type="button"
                      onClick={handleAIParse}
                      disabled={isParsingAI || !aiInput.trim()}
                      className="ml-2 mr-1 px-4 py-2 bg-brand/10 hover:bg-brand/20 text-brand font-semibold text-xs rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
                    >
                      {isParsingAI ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Autocompletar'}
                    </button>
                  </div>
                </div>
              )}

              {/* Type Toggle */}
              <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-6">
                <button
                  onClick={() => { setType('income'); setCategory('salary'); setSubCategory(''); }}
                  className={clsx(
                    "flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all",
                    type === 'income' ? "bg-white dark:bg-gray-700 text-brand shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  )}
                >
                  INGRESO
                </button>
                <button
                  onClick={() => { setType('expense'); setCategory('food'); setSubCategory(''); }}
                  className={clsx(
                    "flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all",
                    type === 'expense' ? "bg-white dark:bg-gray-700 text-expense shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  )}
                >
                  GASTO
                </button>
                {!editingTransaction && (
                  <button
                    onClick={() => { setType('transfer'); setCategory('transfer'); setSubCategory(''); }}
                    className={clsx(
                      "flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all",
                      type === 'transfer' ? "bg-white dark:bg-gray-700 text-blue-500 shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    )}
                  >
                    TRASPASO
                  </button>
                )}
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
                        onChange={(e) => {
                          setCategory(e.target.value);
                          setSubCategory('');
                        }}
                        className="appearance-none block w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-colors cursor-pointer"
                      >
                        {type === 'expense' ? (
                          <>
                            <option value="food">Comida</option>
                            <option value="transport">Transporte</option>
                            <option value="utilities">Servicios</option>
                            <option value="shopping">Compras</option>
                            <option value="entertainment">Ocio</option>
                            <option value="rent">Alquiler</option>
                            <option value="health">Salud</option>
                            <option value="education">Educación</option>
                            <option value="other_expense">Otros Gastos</option>
                          </>
                        ) : type === 'income' ? (
                          <>
                            <option value="salary">Salario</option>
                            <option value="freelance">Freelance</option>
                            <option value="other">Otros</option>
                          </>
                        ) : (
                          <>
                            <option value="transfer">Transferencia / Pago</option>
                          </>
                        )}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Sub-Category (Only if available) */}
                  {SUB_CATEGORIES[category] && SUB_CATEGORIES[category].length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sub-Categoría</label>
                      <div className="relative">
                        <select 
                          value={subCategory}
                          onChange={(e) => setSubCategory(e.target.value)}
                          className="appearance-none block w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-colors cursor-pointer"
                        >
                          <option value="">General</option>
                          {SUB_CATEGORIES[category].map(sub => (
                            <option key={sub} value={sub}>
                              {getSubCategoryLabel(sub)}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400">
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Account */}
                  <div className={type === 'transfer' ? 'col-span-2 grid grid-cols-2 gap-4' : 'col-span-2 sm:col-span-1'}>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {type === 'transfer' ? 'Desde (Cuenta Origen)' : 'Cuenta'}
                      </label>
                      <div className="relative">
                        <select 
                          value={accountId}
                          onChange={(e) => setAccountId(e.target.value)}
                          className="appearance-none block w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-colors cursor-pointer"
                          required
                        >
                          {accounts.map(acc => (
                            <option key={acc.id} value={acc.id}>{acc.name}</option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400">
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    {type === 'transfer' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Hacia (Cuenta Destino)
                        </label>
                        <div className="relative">
                          <select 
                            value={destinationAccountId}
                            onChange={(e) => setDestinationAccountId(e.target.value)}
                            className="appearance-none block w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-colors cursor-pointer"
                            required
                          >
                            {accounts.map(acc => (
                              <option key={`dest-${acc.id}`} value={acc.id}>{acc.name}</option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400">
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    )}
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
          </>
        )}
        </div>
      </div>
    </div>
  );
};
