import { useStore } from '../../store/useStore';
import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export const CashFlowChart = () => {
  const { transactions } = useStore();

  const data = useMemo(() => {
    // Tomamos los últimos 6 meses basados en la fecha actual (o las fechas de las txs)
    // Para simplificar y asegurar que se vea algo con los datos de prueba, agrupamos por mes
    const monthlyData: Record<string, { name: string; ingresos: number; gastos: number }> = {};
    
    // Nombres de los meses
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    transactions.forEach(tx => {
      const date = new Date(tx.date);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      
      if (!monthlyData[key]) {
        monthlyData[key] = {
          name: `${monthNames[date.getMonth()]} ${date.getFullYear().toString().slice(2)}`,
          ingresos: 0,
          gastos: 0
        };
      }
      
      if (tx.type === 'income') {
        monthlyData[key].ingresos += tx.amount;
      } else {
        monthlyData[key].gastos += tx.amount;
      }
    });

    // Convertimos a array y ordenamos por fecha (las keys son YYYY-M)
    return Object.entries(monthlyData)
      .sort((a, b) => {
        const [yearA, monthA] = a[0].split('-').map(Number);
        const [yearB, monthB] = b[0].split('-').map(Number);
        if (yearA !== yearB) return yearA - yearB;
        return monthA - monthB;
      })
      .slice(-6) // Mostrar máximo 6 meses
      .map(entry => entry[1]);
  }, [transactions]);

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 flex flex-col h-[300px] items-center justify-center">
        <h3 className="text-lg font-bold text-gray-400 mb-2">Flujo de Efectivo</h3>
        <p className="text-gray-400">No hay datos suficientes para la gráfica</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <h3 className="text-lg font-bold text-brand-dark mb-6">Flujo de Efectivo (Ingresos vs Gastos)</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 0, left: -20, bottom: 5 }}
            barSize={32}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              tickFormatter={(value) => `C$${value}`}
            />
            <Tooltip
              cursor={{ fill: '#F9FAFB' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              formatter={(value: number) => [`C$${value.toLocaleString('es-NI')}`, undefined]}
            />
            <Legend 
              iconType="circle" 
              wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
            />
            <Bar dataKey="ingresos" name="Ingresos" fill="#10B981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="gastos" name="Gastos" fill="#064E3B" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
