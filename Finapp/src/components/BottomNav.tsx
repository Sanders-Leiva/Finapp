import { LayoutDashboard, ArrowRightLeft, Wallet, Target } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { hapticFeedback } from '../utils/haptics';

export const BottomNav = () => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Inicio', path: '/home' },
    { icon: ArrowRightLeft, label: 'Movimientos', path: '/transactions' },
    { icon: Wallet, label: 'Cuentas', path: '/accounts' },
    { icon: Target, label: 'Metas', path: '/goals' },
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-100 dark:border-gray-800 pb-safe z-50 transition-colors duration-500">
      <div className="flex justify-around items-center h-16 relative">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
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
        ))}
      </div>
    </nav>
  );
};
