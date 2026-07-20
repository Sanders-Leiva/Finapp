import { reportsChartData } from '../data/mockData';
import { formatCurrency } from '../utils/currency';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Download, Filter } from 'lucide-react';

import { useStore } from '../store/useStore';

export const Reports = () => {
  const { profile } = useStore();
  const isDark = profile?.theme?.startsWith('dark');
  const balanceColor = '#EC4899'; // pink-500

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-brand-dark">Reportes</h2>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <select className="appearance-none bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand text-sm cursor-pointer transition-colors">
              <option>Últimos 6 Meses</option>
              <option>Este Año</option>
              <option>Año Pasado</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 dark:text-gray-400">
              <Filter className="w-4 h-4" />
            </div>
          </div>
          
          <button className="flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium transition-colors text-sm">
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 mb-6 transition-colors duration-500">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Evolución del Patrimonio</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Comportamiento de tu dinero en los últimos 6 meses</p>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={reportsChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={balanceColor} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={balanceColor} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#374151' : '#F3F4F6'} />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9CA3AF', fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                tickFormatter={(value) => `C$${value / 1000}k`}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  backgroundColor: isDark ? '#111827' : '#ffffff',
                  color: isDark ? '#F9FAFB' : '#111827'
                }}
                formatter={(value: any) => [formatCurrency(Number(value), 'NIO'), '']}
              />
              <Area 
                type="monotone" 
                dataKey="balance" 
                name="Patrimonio"
                stroke={balanceColor} 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorBalance)" 
              />
              <Area 
                type="monotone" 
                dataKey="expenses" 
                name="Gastos Acumulados"
                stroke="#EF4444" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorExpenses)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Resumen Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 transition-colors duration-500">
           <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Mejor Mes</p>
           <h4 className="text-xl font-bold text-brand-dark dark:text-white mb-1">Abril 2024</h4>
           <p className="text-sm text-brand font-medium">Crecimiento del 12%</p>
         </div>
         <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 transition-colors duration-500">
           <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Peor Mes</p>
           <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Enero 2024</h4>
           <p className="text-sm text-expense font-medium">Descenso del 4%</p>
         </div>
         <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 transition-colors duration-500">
           <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Categoría de Mayor Gasto</p>
           <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Comida 🍔</h4>
           <p className="text-sm text-gray-400 dark:text-gray-500">Representa el 45% de gastos</p>
         </div>
      </div>

    </div>
  );
};
