import { LayoutDashboard, ArrowRightLeft, Wallet, Target } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

export const BottomNav = () => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Inicio', path: '/' },
    { icon: ArrowRightLeft, label: 'Movimientos', path: '/transactions' },
    { icon: Wallet, label: 'Cuentas', path: '/accounts' },
    { icon: Target, label: 'Metas', path: '/goals' },
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 pb-safe z-50 transition-colors duration-500">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => clsx(
              "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
              isActive ? "text-brand" : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
            )}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
