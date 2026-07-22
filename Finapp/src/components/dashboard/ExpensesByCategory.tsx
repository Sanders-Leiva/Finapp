import { useStore } from '../../store/useStore';
import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export const ExpensesByCategory = () => {
  const { transactions, profile } = useStore();
  const isDark = profile?.theme?.startsWith('dark');
  const data = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const expenses = transactions.filter(tx => {
      const txDate = new Date(tx.date);
      return tx.type === 'expense' && tx.category !== 'transfer' && txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
    });
    
    // Agrupar por categoría
    const grouped = expenses.reduce((acc, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
      return acc;
    }, {} as Record<string, number>);

    const categoryMap: Record<string, { name: string, color: string, icon: string }> = {
      food: { name: 'Comida', color: '#EC4899', icon: '🍔' }, // pink-500
      transport: { name: 'Transporte', color: '#F472B6', icon: '🚗' }, // pink-400
      utilities: { name: 'Servicios', color: '#FBCFE8', icon: '💡' }, // pink-200
      shopping: { name: 'Compras', color: '#BE185D', icon: '🛍️' }, // pink-700
      entertainment: { name: 'Ocio', color: '#831843', icon: '🎉' }, // pink-900
      rent: { name: 'Alquiler', color: '#FDA4AF', icon: '🏠' }, // rose-300
      health: { name: 'Salud', color: '#E11D48', icon: '💊' }, // rose-600
      education: { name: 'Educación', color: '#F43F5E', icon: '📚' }, // rose-500
      other_expense: { name: 'Otros', color: '#9CA3AF', icon: '💸' }, // gray-400
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
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 flex flex-col h-full items-center justify-center min-h-[300px] transition-colors duration-500">
        <h3 className="text-lg font-bold text-gray-400 dark:text-gray-500 mb-2">Gastos por Categoría</h3>
        <p className="text-gray-400 dark:text-gray-600">No hay gastos registrados aún</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 flex flex-col h-full transition-colors duration-500">
      <h3 className="text-lg font-bold text-brand-dark dark:text-white mb-6">Gastos por Categoría</h3>
      
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
                stroke={isDark ? '#111827' : '#ffffff'}
                strokeWidth={2}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any) => [`C$${Number(value).toLocaleString('es-NI')}`, undefined]}
                contentStyle={{ 
                  borderRadius: '8px', 
                  border: 'none', 
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  backgroundColor: isDark ? '#111827' : '#ffffff',
                  color: isDark ? '#F9FAFB' : '#111827'
                }}
                itemStyle={{ color: isDark ? '#D1D5DB' : '#374151' }}
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
                  <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">{category.name}</span>
                </div>
                <span className="text-sm font-bold text-brand-dark dark:text-white">
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
