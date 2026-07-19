import { useStore } from '../../store/useStore';
import clsx from 'clsx';

export const RecentTransactions = () => {
  const { transactions } = useStore();
  const recentTxs = transactions.slice(0, 4);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-brand-dark">Últimos Movimientos</h3>
        <button className="text-sm font-medium text-brand hover:text-brand-dark transition-colors">
          Ver todas
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <ul className="space-y-4">
          {recentTxs.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-lg shadow-sm border border-gray-100">
                {tx.account?.icon || '💰'}
              </div>
              <div>
                <p className="font-bold text-gray-900">{tx.title}</p>
                <p className="text-sm text-gray-500">{new Date(tx.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}</p>
              </div>
            </div>
            <div className={clsx(
              "font-bold",
              tx.type === 'income' ? "text-brand" : "text-gray-900"
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
