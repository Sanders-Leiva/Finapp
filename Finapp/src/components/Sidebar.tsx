import { NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ArrowRightLeft, 
  Wallet, 
  PieChart, 
  Target
} from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { name: 'Dashboard', path: '/home', icon: LayoutDashboard },
  { name: 'Transacciones', path: '/transactions', icon: ArrowRightLeft },
  { name: 'Cuentas', path: '/accounts', icon: Wallet },
  { name: 'Presupuestos', path: '/budgets', icon: PieChart },
  { name: 'Metas', path: '/goals', icon: Target },
];

export const Sidebar = () => {
  return (
    <aside className="hidden sm:flex w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex-col h-full transition-colors duration-500">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-gray-800 shrink-0">
        <Link to="/home" className="flex items-center gap-3 text-gray-900 dark:text-white font-bold text-xl hover:opacity-80 transition-opacity cursor-pointer">
          <img src="/favicon.svg" alt="FinApp Logo" className="w-8 h-8 drop-shadow-sm" />
          <span className="tracking-tight">FinApp</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 flex flex-col gap-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => clsx(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative font-medium group",
              isActive 
                ? "text-brand bg-brand-50 dark:bg-brand-900/10" 
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-100"
            )}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-brand rounded-r-full shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                )}
                <item.icon className={clsx(
                  "w-5 h-5 transition-transform duration-200 group-hover:scale-110", 
                  isActive ? "text-brand" : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                )} />
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
