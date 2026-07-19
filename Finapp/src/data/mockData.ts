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

export const fullTransactionsData = [
  { id: 101, name: 'Sueldo Quincenal', date: '2024-04-15', time: '08:00 AM', category: 'Trabajo', categoryIcon: '💼', account: 'BAC Credomatic', amount: 15000.00, currency: 'NIO', type: 'income' },
  { id: 102, name: 'Supermercado La Colonia', date: '2024-04-16', time: '10:30 AM', category: 'Comida', categoryIcon: '🍔', account: 'Tarjeta BAC', amount: -2500.50, currency: 'NIO', type: 'expense' },
  { id: 103, name: 'Gasolina Uno', date: '2024-04-17', time: '06:15 PM', category: 'Transporte', categoryIcon: '🚗', account: 'Tarjeta Banpro', amount: -1200.00, currency: 'NIO', type: 'expense' },
  { id: 104, name: 'Pago de Internet Claro', date: '2024-04-18', time: '09:00 AM', category: 'Servicios', categoryIcon: '💡', account: 'Banpro', amount: -45.00, currency: 'USD', type: 'expense' },
  { id: 105, name: 'Cena con amigos', date: '2024-04-19', time: '08:45 PM', category: 'Ocio', categoryIcon: '🎉', account: 'Efectivo', amount: -850.00, currency: 'NIO', type: 'expense' },
  { id: 106, name: 'Venta de artículo', date: '2024-04-20', time: '02:00 PM', category: 'Ventas', categoryIcon: '📦', account: 'BAC Credomatic', amount: 50.00, currency: 'USD', type: 'income' },
  { id: 107, name: 'Mantenimiento Vehículo', date: '2024-04-21', time: '11:00 AM', category: 'Transporte', categoryIcon: '🚗', account: 'Tarjeta BAC', amount: -4500.00, currency: 'NIO', type: 'expense' },
  { id: 108, name: 'Suscripción Netflix', date: '2024-04-22', time: '10:00 AM', category: 'Ocio', categoryIcon: '🎬', account: 'Tarjeta Banpro', amount: -15.99, currency: 'USD', type: 'expense' },
  { id: 109, name: 'Recibo de Luz', date: '2024-04-23', time: '03:30 PM', category: 'Servicios', categoryIcon: '💡', account: 'Ficohsa', amount: -1250.50, currency: 'NIO', type: 'expense' },
  { id: 110, name: 'Sueldo Quincenal', date: '2024-04-30', time: '08:00 AM', category: 'Trabajo', categoryIcon: '💼', account: 'BAC Credomatic', amount: 15000.00, currency: 'NIO', type: 'income' },
];

export const accountsData = [
  { id: 1, name: 'Cuenta Principal BAC', type: 'Débito', balance: 18500.00, currency: 'NIO', icon: '🏦', color: 'bg-red-50 text-red-600' },
  { id: 2, name: 'Ahorro Banpro', type: 'Ahorro', balance: 5000.00, currency: 'NIO', icon: '🐖', color: 'bg-green-50 text-green-600' },
  { id: 3, name: 'Tarjeta Ficohsa', type: 'Crédito', balance: -150.00, currency: 'USD', icon: '💳', color: 'bg-blue-50 text-blue-600' },
  { id: 4, name: 'Billetera Efectivo', type: 'Efectivo', balance: 2500.00, currency: 'NIO', icon: '💵', color: 'bg-yellow-50 text-yellow-600' },
];

export const budgetsData = [
  { id: 1, category: 'Comida', spent: 6500, total: 8000, currency: 'NIO', icon: '🍔' },
  { id: 2, category: 'Transporte', spent: 3000, total: 3000, currency: 'NIO', icon: '🚗' },
  { id: 3, category: 'Servicios', spent: 4000, total: 4500, currency: 'NIO', icon: '💡' },
  { id: 4, category: 'Ocio', spent: 4000, total: 3500, currency: 'NIO', icon: '🎉' },
];

export const goalsData = [
  { id: 1, name: 'Fondo de Emergencia', currentAmount: 15000, targetAmount: 30000, currency: 'NIO', icon: '🛡️', date: 'Dic 2024' },
  { id: 2, name: 'Viaje a Corn Island', currentAmount: 350, targetAmount: 800, currency: 'USD', icon: '🌴', date: 'Ago 2024' },
  { id: 3, name: 'Nuevo Teléfono', currentAmount: 4000, targetAmount: 12000, currency: 'NIO', icon: '📱', date: 'Oct 2024' },
];

export const reportsChartData = [
  { month: 'Nov', balance: 18000, expenses: 14000 },
  { month: 'Dic', balance: 22000, expenses: 16000 },
  { month: 'Ene', balance: 20000, expenses: 15500 },
  { month: 'Feb', balance: 24000, expenses: 13000 },
  { month: 'Mar', balance: 23500, expenses: 14500 },
  { month: 'Abr', balance: 25250, expenses: 12500 },
];
