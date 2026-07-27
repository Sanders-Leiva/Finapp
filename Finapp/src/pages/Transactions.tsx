import { useState } from 'react';
import { TransactionToolbar } from '../components/transactions/TransactionToolbar';
import { TransactionTable } from '../components/transactions/TransactionTable';
import { EmptyState } from '../components/EmptyState';
import { Receipt } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useModal } from '../context/ModalContext';

export const Transactions = () => {
  const { transactions } = useStore();
  const { openTransactionModal } = useModal();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [accountFilter, setAccountFilter] = useState('');

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter ? tx.category === categoryFilter : true;
    const matchesAccount = accountFilter ? tx.account_id === accountFilter : true;
    return matchesSearch && matchesCategory && matchesAccount;
  });

  return (
    <div className="animate-in fade-in duration-500">
      <TransactionToolbar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        accountFilter={accountFilter}
        setAccountFilter={setAccountFilter}
      />
      
      {transactions.length === 0 ? (
         <EmptyState
           icon={Receipt}
           title="Sin transacciones"
           description="Aún no has registrado ningún gasto o ingreso. ¡Comienza a llevar el control de tu dinero!"
           actionLabel="Nueva Transacción"
           onAction={() => openTransactionModal()}
         />
      ) : filteredTransactions.length === 0 ? (
         <EmptyState
           icon={Receipt}
           title="No hay resultados"
           description="No se encontraron transacciones con los filtros actuales."
         />
      ) : (
        <TransactionTable transactions={filteredTransactions} />
      )}
    </div>
  );
};
