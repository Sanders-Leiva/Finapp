import { Search, Plus, Filter } from 'lucide-react';
import { useModal } from '../../context/ModalContext';

export const TransactionToolbar = () => {
  const { openTransactionModal } = useModal();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      {/* Search Bar */}
      <div className="relative w-full lg:w-96">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand focus:border-brand sm:text-sm transition-colors"
          placeholder="Buscar transacciones..."
        />
      </div>

      {/* Filters and Add Button */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Category Filter */}
        <div className="relative">
          <select className="appearance-none bg-white border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand text-sm cursor-pointer">
            <option>Todas las Categorías</option>
            <option>Comida</option>
            <option>Transporte</option>
            <option>Servicios</option>
            <option>Trabajo</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
            <Filter className="w-4 h-4" />
          </div>
        </div>

        {/* Account Filter */}
        <div className="relative">
          <select className="appearance-none bg-white border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand text-sm cursor-pointer">
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
        <div className="relative">
          <select className="appearance-none bg-white border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand text-sm cursor-pointer">
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
          className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm ml-auto lg:ml-2"
        >
          <Plus className="w-4 h-4" />
          Nueva Transacción
        </button>
      </div>
    </div>
  );
};
