import { useStore } from '../../store/useStore';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { getAccountIcon } from '../../utils/icons';

export const RecentTransactions = () => {
  const { transactions } = useStore();
  const recentTxs = transactions.slice(0, 4);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 flex flex-col h-full transition-colors duration-500">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-brand-dark dark:text-white">Últimos Movimientos</h3>
        <Link to="/transactions" className="text-sm font-medium text-brand hover:text-brand-dark dark:hover:text-brand-light transition-colors">
          Ver todas
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto">
        <ul className="space-y-4">
          {recentTxs.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-700">
                {(() => {
                  const AccIcon = getAccountIcon(tx.account?.icon);
                  return <AccIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />;
                })()}
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white">{tx.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(tx.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}</p>
              </div>
            </div>
            <div className={clsx(
              "font-bold",
              tx.type === 'income' ? "text-brand" : "text-gray-900 dark:text-gray-100"
            )}>
              {tx.type === 'income' ? '+' : '-'}C${tx.amount.toLocaleString('es-NI', { minimumFractionDigits: 2 })}
            </div>
          </div>
        ))}
        {recentTxs.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            No hay transacciones recientes
          </div>
        )}
        </ul>
      </div>
    </div>
  );
};
