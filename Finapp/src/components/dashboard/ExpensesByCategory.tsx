import { useStore } from '../../store/useStore';
import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export const ExpensesByCategory = () => {
  const { transactions } = useStore();

  const data = useMemo(() => {
    const expenses = transactions.filter(tx => tx.type === 'expense');
    
    // Agrupar por categoría
    const grouped = expenses.reduce((acc, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
      return acc;
    }, {} as Record<string, number>);

    // Mapear colores y nombres
    const categoryMap: Record<string, { name: string, color: string, icon: string }> = {
      food: { name: 'Comida', color: '#10B981', icon: '🍔' },
      transport: { name: 'Transporte', color: '#F59E0B', icon: '🚗' },
      utilities: { name: 'Servicios', color: '#3B82F6', icon: '⚡' },
      shopping: { name: 'Compras', color: '#EC4899', icon: '🛍️' },
      entertainment: { name: 'Ocio', color: '#8B5CF6', icon: '🎮' },
    };

    return Object.entries(grouped).map(([key, value]) => ({
      name: categoryMap[key]?.name || key,
      value: value,
      color: categoryMap[key]?.color || '#9CA3AF',
      icon: categoryMap[key]?.icon || '💰'
    })).sort((a, b) => b.value - a.value);

  }, [transactions]);

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-full items-center justify-center min-h-[300px]">
        <h3 className="text-lg font-bold text-gray-400 mb-2">Gastos por Categoría</h3>
        <p className="text-gray-400">No hay gastos registrados aún</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
      <h3 className="text-lg font-bold text-brand-dark mb-6">Gastos por Categoría</h3>
      
      <div className="flex-1 flex items-center justify-between">
        {/* Chart */}
        <div className="w-1/2 h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`C$${value.toLocaleString('es-NI')}`, undefined]}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="w-1/2 pl-4">
          <ul className="space-y-4">
            {data.map((category) => (
              <li key={category.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl" role="img" aria-label={category.name}>
                    {category.icon}
                  </span>
                  <span className="text-sm text-gray-600 font-medium">{category.name}</span>
                </div>
                <span className="text-sm font-bold text-brand-dark">
                  C${category.value.toLocaleString('es-NI', { minimumFractionDigits: 2 })}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
