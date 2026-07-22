import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { formatCurrency } from '../../utils/currency';
import clsx from 'clsx';

export const KPICards = () => {
  const { accounts, transactions } = useStore();

  // Calcular balance total
  const totalBalance = accounts.reduce((acc, account) => acc + account.balance, 0);

  // Calcular ingresos y gastos del mes actual
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyTransactions = transactions.filter(tx => {
    const txDate = new Date(tx.date);
    return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
  });

  const monthlyIncome = monthlyTransactions
    .filter(tx => tx.type === 'income' && tx.category !== 'transfer')
    .reduce((acc, tx) => acc + tx.amount, 0);

  const monthlyExpense = monthlyTransactions
    .filter(tx => tx.type === 'expense' && tx.category !== 'transfer')
    .reduce((acc, tx) => acc + tx.amount, 0);

  const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpense) / monthlyIncome) * 100 : (monthlyExpense > 0 ? -100 : 0);

  // Lógica para consejos dinámicos
  let adviceText;
  let adviceIcon;

  if (monthlyIncome === 0 && monthlyExpense === 0) {
    adviceText = 'Aún no tienes movimientos este mes. ¡Registra tus ingresos para empezar!';
    adviceIcon = '👋';
  } else if (savingsRate >= 50) {
    adviceText = '¡Increíble! Estás ahorrando la mitad de tus ingresos o más. Tienes un control maestro de tus finanzas.';
    adviceIcon = '👑';
  } else if (savingsRate >= 20) {
    adviceText = 'Excelente margen. Estás construyendo un buen colchón financiero para el futuro.';
    adviceIcon = '🚀';
  } else if (savingsRate > 0) {
    adviceText = 'Estás ahorrando, ¡bien hecho! Intenta reducir "gastos hormiga" para optimizar tu margen.';
    adviceIcon = '👍';
  } else if (savingsRate === 0 && monthlyExpense > 0) {
    adviceText = 'Tus gastos igualan tus ingresos. Ten cuidado, no tienes margen para imprevistos.';
    adviceIcon = '⚖️';
  } else {
    adviceText = '¡Alerta! Estás gastando más de lo que ingresas este mes. Revisa tus presupuestos con urgencia.';
    adviceIcon = '⚠️';
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-800 mb-8 transition-colors duration-500">
      
      <div className="flex flex-col md:flex-row md:items-stretch justify-between gap-6 md:gap-8">
        
        {/* Lado izquierdo: Saldo y Desglose */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-brand-light dark:bg-brand-900/20 rounded-xl">
                <Wallet className="w-5 h-5 text-brand" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">Saldo Total</p>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 text-brand-dark dark:text-white">
              {formatCurrency(totalBalance)}
            </h2>
          </div>
          
          <div className="grid grid-cols-2 gap-3 md:gap-4 mt-auto">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 transition-colors duration-500">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1 bg-brand-light dark:bg-brand-900/20 rounded-full">
                  <TrendingUp className="w-3 h-3 text-brand" />
                </div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ingresos</p>
              </div>
              <p className="text-lg md:text-xl font-bold text-brand">+{formatCurrency(monthlyIncome)}</p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 transition-colors duration-500">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1 bg-red-50 dark:bg-red-500/10 rounded-full">
                  <TrendingDown className="w-3 h-3 text-expense" />
                </div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Gastos</p>
              </div>
              <p className="text-lg md:text-xl font-bold text-expense">-{formatCurrency(monthlyExpense)}</p>
            </div>
          </div>
        </div>

        {/* Separador en Desktop */}
        <div className="hidden md:block w-px bg-gray-100 dark:bg-gray-800 my-2"></div>

        {/* Lado derecho: Margen de Ahorro y Consejo */}
        <div className="w-full md:w-80 flex flex-col justify-center">
          <div className="bg-brand-light/30 dark:bg-brand-900/10 rounded-2xl p-6 border border-brand-light/50 dark:border-brand-900/20 h-full flex flex-col">
            
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-brand-dark dark:text-brand-light">Margen de Ahorro</p>
              <span className={clsx("font-bold text-2xl", savingsRate >= 0 ? "text-brand" : "text-expense")}>
                {savingsRate.toFixed(1)}%
              </span>
            </div>
            
            <div className="w-full h-2.5 bg-white dark:bg-gray-800 rounded-full overflow-hidden mb-6 shadow-inner border border-gray-100 dark:border-gray-700">
              <div 
                className={clsx("h-full rounded-full transition-all duration-1000 ease-out", savingsRate >= 0 ? "bg-brand" : "bg-expense")} 
                style={{ width: `${Math.max(0, Math.min(savingsRate, 100))}%` }}
              ></div>
            </div>
            
            <div className="mt-auto bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-500">
              <div className="flex items-start gap-3">
                <span className="text-2xl leading-none">{adviceIcon}</span>
                <p className="text-xs text-gray-800 dark:text-gray-100 font-medium leading-relaxed">
                  {adviceText}
                </p>
              </div>
            </div>
            
          </div>
        </div>
        
      </div>
    </div>
  );
};
