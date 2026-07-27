import { KPICards } from '../components/dashboard/KPICards';
import { CashFlowChart } from '../components/dashboard/CashFlowChart';
import { ExpensesByCategory } from '../components/dashboard/ExpensesByCategory';
import { RecentTransactions } from '../components/dashboard/RecentTransactions';
import { AIInsightsWidget } from '../components/dashboard/AIInsightsWidget';
import { PullToRefresh } from '../components/PullToRefresh';
import { useStore } from '../store/useStore';
import { GlobalAIInput } from '../components/dashboard/GlobalAIInput';

export const Dashboard = () => {
  const { refreshData } = useStore();

  return (
    <PullToRefresh onRefresh={refreshData}>
      <div className="animate-in fade-in duration-500 pb-20 lg:pb-6">
        <GlobalAIInput />
        
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <KPICards />
          </div>
          <div className="col-span-12">
            <AIInsightsWidget />
          </div>
          <div className="col-span-12">
            <CashFlowChart />
          </div>
          <div className="col-span-12 lg:col-span-6">
            <ExpensesByCategory />
          </div>
          <div className="col-span-12 lg:col-span-6">
            <RecentTransactions />
          </div>
        </div>
      </div>
    </PullToRefresh>
  );
};
