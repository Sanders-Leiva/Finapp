export const kpiData = {
  totalBalance: 25250.00, // Cordobas
  incomeMonth: 30000.00, // Cordobas
  expenseMonth: 12500.00, // Cordobas
  savingsMargin: 58.3, // %
};

export const cashFlowData = [
  { name: 'Sem 1', ingresos: 8000, gastos: 4500 },
  { name: 'Sem 2', ingresos: 12000, gastos: 6000 },
  { name: 'Sem 3', ingresos: 5000, gastos: 3000 },
  { name: 'Sem 4', ingresos: 5000, gastos: 4000 },
];

export const expensesByCategoryData = [
  { name: 'Comida', value: 6500, color: '#10B981', icon: '🍔' }, // brand
  { name: 'Transporte', value: 3000, color: '#34D399', icon: '🚗' }, // emerald-400
  { name: 'Servicios', value: 4000, color: '#6EE7B7', icon: '💡' }, // emerald-300
  { name: 'Ocio', value: 4000, color: '#A7F3D0', icon: '🎉' }, // emerald-200
];

export const recentTransactionsData = [
  { id: 1, name: 'Supermercado La Colonia', date: '24 Abr 2024', amount: -2500.50, currency: 'NIO', type: 'expense', categoryIcon: '🍔' },
  { id: 2, name: 'Sueldo Quincenal', date: '22 Abr 2024', amount: 15000.00, currency: 'NIO', type: 'income', categoryIcon: '💼' },
  { id: 3, name: 'Gasolina Uno', date: '20 Abr 2024', amount: -1200.00, currency: 'NIO', type: 'expense', categoryIcon: '🚗' },
  { id: 4, name: 'Suscripción Software', date: '18 Abr 2024', amount: -25.00, currency: 'USD', type: 'expense', categoryIcon: '💻' },
  { id: 5, name: 'Restaurante', date: '15 Abr 2024', amount: -850.00, currency: 'NIO', type: 'expense', categoryIcon: '🍔' },
];

export const fullTransactionsData: Array<{
  id: number;
  name: string;
  date: string;
  time: string;
  category: string;
  categoryIcon: string;
  account: string;
  amount: number;
  currency: string;
  type: string;
}> = [];

export const accountsData = [
  { id: 1, name: 'Cuenta Principal BAC', type: 'Débito', balance: 0, currency: 'NIO', icon: '🏦', color: 'bg-red-50 text-red-600' },
  { id: 2, name: 'Ahorro Banpro', type: 'Ahorro', balance: 0, currency: 'NIO', icon: '🐖', color: 'bg-green-50 text-green-600' },
  { id: 3, name: 'Tarjeta Ficohsa', type: 'Crédito', balance: 0, currency: 'USD', icon: '💳', color: 'bg-blue-50 text-blue-600' },
  { id: 4, name: 'Billetera Efectivo', type: 'Efectivo', balance: 0, currency: 'NIO', icon: '💵', color: 'bg-yellow-50 text-yellow-600' },
];

export const budgetsData: Array<{
  id: number;
  category: string;
  spent: number;
  total: number;
  currency: string;
  icon: string;
}> = [];

export const goalsData: Array<{
  id: number;
  name: string;
  currentAmount: number;
  targetAmount: number;
  currency: string;
  icon: string;
  date: string;
}> = [];

export const reportsChartData = [
  { month: 'Nov', balance: 18000, expenses: 14000 },
  { month: 'Dic', balance: 22000, expenses: 16000 },
  { month: 'Ene', balance: 20000, expenses: 15500 },
  { month: 'Feb', balance: 24000, expenses: 13000 },
  { month: 'Mar', balance: 23500, expenses: 14500 },
  { month: 'Abr', balance: 25250, expenses: 12500 },
];
