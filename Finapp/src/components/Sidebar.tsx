import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ArrowRightLeft, 
  Wallet, 
  PieChart, 
  Target, 
  BarChart3, 
  Leaf
} from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Transacciones', path: '/transactions', icon: ArrowRightLeft },
  { name: 'Cuentas', path: '/accounts', icon: Wallet },
  { name: 'Presupuestos', path: '/budgets', icon: PieChart },
  { name: 'Metas', path: '/goals', icon: Target },
  { name: 'Reportes', path: '/reports', icon: BarChart3 },
];

export const Sidebar = () => {
  return (
    <aside className="hidden sm:flex w-64 bg-white border-r border-gray-100 flex-col h-full">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <div className="flex items-center gap-2 text-brand font-bold text-xl">
          <div className="bg-brand-light p-1.5 rounded-lg">
            <Leaf className="w-6 h-6 text-brand" />
          </div>
          FinApp
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => clsx(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative font-medium",
              isActive 
                ? "text-brand bg-brand-light" 
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-brand rounded-r-full" />
                )}
                <item.icon className={clsx("w-5 h-5", isActive ? "text-brand" : "text-gray-400")} />
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
