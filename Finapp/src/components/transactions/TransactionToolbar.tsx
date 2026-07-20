import { Search, Plus, Filter } from 'lucide-react';
import { useModal } from '../../context/ModalContext';

export const TransactionToolbar = () => {
  const { openTransactionModal } = useModal();

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-colors duration-500">
      {/* Search Bar */}
      <div className="relative w-full lg:w-96">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg leading-5 bg-gray-50 dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-brand focus:border-brand sm:text-sm transition-colors"
          placeholder="Buscar transacciones..."
        />
      </div>

      {/* Filters and Add Button */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Category Filter */}
        <div className="relative w-full sm:w-auto">
          <select className="appearance-none w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand text-sm cursor-pointer">
            <option>Todas las Categorías</option>
            <option>Comida</option>
            <option>Transporte</option>
            <option>Servicios</option>
            <option>Compras</option>
            <option>Ocio</option>
            <option>Alquiler</option>
            <option>Salud</option>
            <option>Educación</option>
            <option>Otros Gastos</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
            <Filter className="w-4 h-4" />
          </div>
        </div>

        {/* Account Filter */}
        <div className="relative w-full sm:w-auto">
          <select className="appearance-none w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand text-sm cursor-pointer">
            <option>Todas las Cuentas</option>
            <option>Banco BFA</option>
            <option>Tarjeta de Crédito</option>
            <option>Efectivo</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
            <Filter className="w-4 h-4" />
          </div>
        </div>
        
        {/* Date Filter */}
        <div className="relative w-full sm:w-auto">
          <select className="appearance-none w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand text-sm cursor-pointer">
            <option>Este Mes</option>
            <option>Últimos 30 días</option>
            <option>Este Año</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
            <Filter className="w-4 h-4" />
          </div>
        </div>

        <button 
          onClick={() => openTransactionModal()}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm lg:ml-2"
        >
          <Plus className="w-4 h-4" />
          Nueva Transacción
        </button>
      </div>
    </div>
  );
};
