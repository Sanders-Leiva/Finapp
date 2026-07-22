import { create } from 'zustand';
import type { User } from '@supabase/supabase-js';

import type { Account, Transaction, Budget, Goal } from '../services/api';
import { api } from '../services/api';

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  theme: 'green' | 'pink' | 'dark' | 'dark-pink';
}

interface AppState {
  isAppLoading: boolean;
  setIsAppLoading: (loading: boolean) => void;
  
  user: User | null;
  profile: UserProfile | null;
  accounts: Account[];
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  initTheme: () => void;
  refreshData: () => Promise<void>;

  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setAccounts: (accounts: Account[]) => void;
  setTransactions: (transactions: Transaction[]) => void;
  setBudgets: (budgets: Budget[]) => void;
  setGoals: (goals: Goal[]) => void;
}

export const useStore = create<AppState>((set, get) => ({
  isAppLoading: true,
  setIsAppLoading: (loading) => set({ isAppLoading: loading }),
  
  user: null,
  profile: null,
  accounts: [],
  transactions: [],
  budgets: [],
  goals: [],
  
  isDarkMode: localStorage.getItem('finapp-theme') === 'dark',
  toggleDarkMode: () => {
    const isDark = !get().isDarkMode;
    localStorage.setItem('finapp-theme', isDark ? 'dark' : 'light');
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ isDarkMode: isDark });
  },
  initTheme: () => {
    const isDark = get().isDarkMode;
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  refreshData: async () => {
    const userId = get().user?.id;
    if (!userId) return;
    try {
      const [accs, txs, bdgts, gls] = await Promise.all([
        api.getAccounts(userId),
        api.getTransactions(userId),
        api.getBudgets(userId),
        api.getGoals(userId)
      ]);
      set({ accounts: accs, transactions: txs, budgets: bdgts, goals: gls });
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  },

  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setAccounts: (accounts) => set({ accounts }),
  setTransactions: (transactions) => set({ transactions }),
  setBudgets: (budgets) => set({ budgets }),
  setGoals: (goals) => set({ goals }),
}));
      

