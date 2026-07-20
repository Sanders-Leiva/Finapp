import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { Transactions } from './pages/Transactions';
import { Accounts } from './pages/Accounts';
import { Budgets } from './pages/Budgets';
import { Goals } from './pages/Goals';
import { Reports } from './pages/Reports';
import { Auth } from './pages/Auth';
import { ModalProvider } from './context/ModalContext';
import { useStore } from './store/useStore';
import { supabase } from './lib/supabase';
import { api } from './services/api';

import { Loader2 } from 'lucide-react';

function App() {
  const { user, profile, setUser, setProfile, isAppLoading, setIsAppLoading } = useStore();

  useEffect(() => {
    let mounted = true;

    const fetchProfile = async (userId: string) => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (data && mounted) {
        setProfile(data);
      }
    };

    const fetchAppData = async (userId: string) => {
      try {
        const [accs, txs, bdgts, gls] = await Promise.all([
          api.getAccounts(userId),
          api.getTransactions(userId),
          api.getBudgets(userId),
          api.getGoals(userId)
        ]);
        if (mounted) {
          useStore.getState().setAccounts(accs);
          useStore.getState().setTransactions(txs);
          useStore.getState().setBudgets(bdgts);
          useStore.getState().setGoals(gls);
        }
      } catch (error) {
        console.error("Error fetching app data:", error);
      }
    };

    const initializeApp = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!mounted) return;
      
      setUser(session?.user ?? null);
      if (session?.user) {
        await Promise.all([
          fetchProfile(session.user.id),
          fetchAppData(session.user.id)
        ]);
      }
      
      if (mounted) {
        setIsAppLoading(false);
      }
    };

    initializeApp();

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
        fetchAppData(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [setUser, setProfile, setIsAppLoading]);



  // Theme injection
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-pink', 'dark');
    
    if (profile?.theme === 'pink') {
      root.classList.add('theme-pink');
    } else if (profile?.theme === 'dark') {
      root.classList.add('dark');
    } else if (profile?.theme === 'dark-pink') {
      root.classList.add('dark', 'theme-pink');
    }
  }, [profile]);

  if (isAppLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-brand rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-brand/20 animate-bounce">
          <span className="text-4xl text-white font-bold">F</span>
        </div>
        <div className="flex items-center gap-3 text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="font-medium tracking-wide">Cargando FinApp...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <ModalProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="accounts" element={<Accounts />} />
            <Route path="budgets" element={<Budgets />} />
            <Route path="goals" element={<Goals />} />
            <Route path="reports" element={<Reports />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ModalProvider>
  );
}

export default App;
