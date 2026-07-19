import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { formatCurrency } from '../../utils/currency';

export const KPICards = () => {
  const { accounts, transactions } = useStore();

  // Calcular balance total
  const totalBalance = accounts.reduce((acc, account) => acc + account.balance, 0);

  // Calcular ingresos y gastos del mes actual
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const currentMonthName = monthNames[currentMonth];

  const monthlyTransactions = transactions.filter(tx => {
    const txDate = new Date(tx.date);
    return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
  });

  const monthlyIncome = monthlyTransactions
    .filter(tx => tx.type === 'income')
    .reduce((acc, tx) => acc + tx.amount, 0);

  const monthlyExpense = monthlyTransactions
    .filter(tx => tx.type === 'expense')
    .reduce((acc, tx) => acc + tx.amount, 0);

  const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpense) / monthlyIncome) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Card 1: Saldo Total */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
          <p className="text-sm font-medium text-gray-500">Saldo Total</p>
          <div className="p-2 bg-brand-light rounded-lg">
            <Wallet className="w-5 h-5 text-brand" />
          </div>
        </div>
        <h3 className="text-3xl font-bold text-brand-dark">{formatCurrency(totalBalance)}</h3>
      </div>

      {/* Card 2: Ingresos Mes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
          <p className="text-sm font-medium text-gray-500">Ingresos ({currentMonthName})</p>
          <div className="p-1 bg-brand-light rounded-full">
            <TrendingUp className="w-4 h-4 text-brand" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-brand">+{formatCurrency(monthlyIncome)}</h3>
      </div>

      {/* Card 3: Gastos Mes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
          <p className="text-sm font-medium text-gray-500">Gastos ({currentMonthName})</p>
          <div className="p-1 bg-red-50 rounded-full">
            <TrendingDown className="w-4 h-4 text-expense" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-expense">-{formatCurrency(monthlyExpense)}</h3>
      </div>

      {/* Card 4: Margen de Ahorro */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-2">Margen de Ahorro</p>
          <h3 className="text-2xl font-bold text-gray-900">{savingsRate.toFixed(1)}%</h3>
        </div>
        <div className="relative w-14 h-14 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-gray-100"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="text-brand"
              strokeDasharray={`${Math.min(savingsRate, 100)}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
