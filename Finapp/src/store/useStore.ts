import { create } from 'zustand';
import type { User } from '@supabase/supabase-js';

import type { Account, Transaction, Budget, Goal } from '../services/api';

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  theme: 'green' | 'pink' | 'dark';
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
  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setAccounts: (accounts: Account[]) => void;
  setTransactions: (transactions: Transaction[]) => void;
  setBudgets: (budgets: Budget[]) => void;
  setGoals: (goals: Goal[]) => void;
}

export const useStore = create<AppState>((set) => ({
  isAppLoading: true,
  setIsAppLoading: (loading) => set({ isAppLoading: loading }),
  
  user: null,
  profile: null,
  accounts: [],
  transactions: [],
  budgets: [],
  goals: [],
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setAccounts: (accounts) => set({ accounts }),
  setTransactions: (transactions) => set({ transactions }),
  setBudgets: (budgets) => set({ budgets }),
  setGoals: (goals) => set({ goals }),
}));
      

