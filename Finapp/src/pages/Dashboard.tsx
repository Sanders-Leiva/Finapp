import { KPICards } from '../components/dashboard/KPICards';
import { CashFlowChart } from '../components/dashboard/CashFlowChart';
import { ExpensesByCategory } from '../components/dashboard/ExpensesByCategory';
import { RecentTransactions } from '../components/dashboard/RecentTransactions';
import { PullToRefresh } from '../components/PullToRefresh';
import { useStore } from '../store/useStore';

export const Dashboard = () => {
  const { refreshData } = useStore();

  return (
    <PullToRefresh onRefresh={refreshData}>
      <div className="animate-in fade-in duration-500">
        {/* Fila 1: KPIs */}
        <KPICards />

        {/* Fila 2: Gráfico Principal */}
        <CashFlowChart />

        {/* Fila 3: Resumen Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ExpensesByCategory />
          <RecentTransactions />
        </div>
      </div>
    </PullToRefresh>
  );
};
