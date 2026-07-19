import { TransactionToolbar } from '../components/transactions/TransactionToolbar';
import { TransactionTable } from '../components/transactions/TransactionTable';

export const Transactions = () => {
  return (
    <div className="animate-in fade-in duration-500">
      <TransactionToolbar />
      <TransactionTable />
    </div>
  );
};
