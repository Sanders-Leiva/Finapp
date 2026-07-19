import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { TransactionModal } from '../components/transactions/TransactionModal';
import { AccountModal } from '../components/accounts/AccountModal';
import { BudgetModal } from '../components/budgets/BudgetModal';
import { GoalModal } from '../components/goals/GoalModal';

export const MainLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <Sidebar />
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        
        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-20 sm:pb-6">
          <div className="max-w-6xl mx-auto">
            {/* The Outlet renders the child routes (Dashboard, Transactions, etc.) */}
            <Outlet />
          </div>
        </main>
        
        {/* Global Modals & Mobile Nav */}
        <TransactionModal />
        <AccountModal />
        <BudgetModal />
        <GoalModal />
        <BottomNav />
      </div>
    </div>
  );
};
