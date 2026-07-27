import { LayoutDashboard, ArrowRightLeft, CalendarDays, Plus, Wallet } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { hapticFeedback } from '../utils/haptics';
import { useModal } from '../context/ModalContext';

export const BottomNav = () => {
  const { openTransactionModal } = useModal();

  const leftNavItems = [
    { icon: LayoutDashboard, label: 'Inicio', path: '/home' },
    { icon: ArrowRightLeft, label: 'Historial', path: '/transactions' },
  ];

  const rightNavItems = [
    { icon: CalendarDays, label: 'Calendario', path: '/calendar' },
    { icon: Wallet, label: 'Cuentas', path: '/accounts' },
  ];

  interface NavItemData {
    icon: React.ElementType;
    label: string;
    path: string;
  }

  const NavItem = ({ item }: { item: NavItemData }) => (
    <NavLink
      to={item.path}
      onClick={() => hapticFeedback.light()}
      className={({ isActive }) => clsx(
        "flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300 relative group",
        isActive ? "text-brand" : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
      )}
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <div className="absolute top-0 w-8 h-1 bg-brand rounded-b-full shadow-[0_2px_8px_rgba(16,185,129,0.5)]" />
          )}
          <item.icon className={clsx(
            "w-6 h-6 transition-transform duration-300",
            isActive ? "-translate-y-1" : "group-hover:scale-110"
          )} />
          <span className={clsx(
            "text-[10px] font-medium transition-all duration-300",
            isActive ? "opacity-100 translate-y-0" : "opacity-70 group-hover:opacity-100"
          )}>
            {item.label}
          </span>
        </>
      )}
    </NavLink>
  );

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-100 dark:border-gray-800 pb-safe z-50 transition-colors duration-500">
      <div className="flex justify-between items-center h-16 px-2 relative">
        
        {/* Left Items */}
        <div className="flex flex-1 justify-around h-full">
          {leftNavItems.map(item => <NavItem key={item.path} item={item} />)}
        </div>

        {/* Center FAB Button */}
        <div className="relative -top-5 mx-2">
          <button
            onClick={() => {
              hapticFeedback.medium();
              openTransactionModal();
            }}
            className="w-14 h-14 bg-brand hover:bg-brand-600 active:scale-95 text-white rounded-full flex items-center justify-center shadow-lg shadow-brand/30 transition-all duration-300 group z-50"
            aria-label="Agregar Transacción"
          >
            <Plus className="w-7 h-7 transition-transform duration-300 group-hover:rotate-90" />
          </button>
        </div>

        {/* Right Items */}
        <div className="flex flex-1 justify-around h-full">
          {rightNavItems.map(item => <NavItem key={item.path} item={item} />)}
        </div>

      </div>
    </nav>
  );
};
