import { supabase } from '../lib/supabase';
import { 
  accountsData, 
  budgetsData, 
  goalsData, 
  fullTransactionsData 
} from '../data/mockData';

// TIPOS
export type Transaction = {
  id: string;
  account_id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  currency: string;
  date: string;
  account?: {
    name: string;
    icon: string;
    color: string;
  };
};

export interface Account {
  id: string;
  user_id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
  icon: string;
  color: string;
  created_at: string;
}

export interface Budget {
  id: string;
  user_id: string;
  category: string;
  total_amount: number;
  spent_amount: number;
  currency: string;
  icon: string;
  period: string;
  created_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
  currency: string;
  icon: string;
  color: string;
  created_at: string;
}
// SERVICIO API
export const api = {
  // --- CONSULTAS ---

  async getAccounts(userId: string) {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data as Account[];
  },

  async createAccount(accountData: any) {
    const { data, error } = await supabase
      .from('accounts')
      .insert([accountData])
      .select('*')
      .single();
    if (error) throw error;
    return data as Account;
  },

  async updateAccount(id: string, accountData: any) {
    const { data, error } = await supabase
      .from('accounts')
      .update(accountData)
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    return data as Account;
  },

  async deleteAccount(id: string) {
    const { error } = await supabase
      .from('accounts')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  },

  async getTransactions(userId: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*, account:accounts(name, icon, color)')
      .eq('user_id', userId)
      .order('date', { ascending: false });
    if (error) throw error;
    return data;
  },

  async createTransaction(txData: any) {
    const { data, error } = await supabase
      .from('transactions')
      .insert([txData])
      .select('*, account:accounts(name, icon, color)')
      .single();
    if (error) throw error;
    return data;
  },

  async updateTransaction(id: string, txData: any) {
    const { data, error } = await supabase
      .from('transactions')
      .update(txData)
      .eq('id', id)
      .select('*, account:accounts(name, icon, color)')
      .single();
    if (error) throw error;
    return data;
  },

  async deleteTransaction(id: string) {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  },

  // --- BUDGETS ---
  async getBudgets(userId: string) {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data;
  },

  async createBudget(budgetData: any) {
    const { data, error } = await supabase
      .from('budgets')
      .insert([budgetData])
      .select('*')
      .single();
    if (error) throw error;
    return data;
  },

  async updateBudget(id: string, budgetData: any) {
    const { data, error } = await supabase
      .from('budgets')
      .update(budgetData)
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    return data;
  },

  async deleteBudget(id: string) {
    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  },

  // --- GOALS ---
  async getGoals(userId: string) {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data;
  },

  async createGoal(goalData: any) {
    const { data, error } = await supabase
      .from('goals')
      .insert([goalData])
      .select('*')
      .single();
    if (error) throw error;
    return data;
  },

  async updateGoal(id: string, goalData: any) {
    const { data, error } = await supabase
      .from('goals')
      .update(goalData)
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    return data;
  },

  async deleteGoal(id: string) {
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  },

  // --- SEED (Inyección de Datos de Prueba) ---

  async seedMockData(userId: string) {
    // 1. Insertar Cuentas
    const { data: accounts, error: accError } = await supabase
      .from('accounts')
      .insert(
        accountsData.map(a => ({
          user_id: userId,
          name: a.name,
          type: a.type,
          balance: a.balance,
          currency: a.currency,
          icon: a.icon,
          color: a.color
        }))
      )
      .select();
    if (accError) throw accError;

    if (!accounts || accounts.length === 0) return;

    const accountBankId = accounts.find(a => a.type === 'bank')?.id || accounts[0].id;
    const accountCashId = accounts.find(a => a.type === 'cash')?.id || accounts[0].id;

    // 2. Insertar Transacciones (usando los IDs reales recién creados)
    const txToInsert = fullTransactionsData.map(tx => ({
      user_id: userId,
      account_id: tx.category === 'Food' || tx.category === 'Transport' ? accountCashId : accountBankId,
      title: tx.name,
      amount: tx.amount,
      type: tx.type,
      category: tx.category,
      currency: tx.currency,
      date: tx.date
    }));

    const { error: txError } = await supabase
      .from('transactions')
      .insert(txToInsert);
    if (txError) throw txError;

    // 3. Insertar Presupuestos
    const { error: bgError } = await supabase
      .from('budgets')
      .insert(
        budgetsData.map(b => ({
          user_id: userId,
          category: b.category,
          total_amount: b.total,
          spent_amount: b.spent,
          currency: b.currency,
          icon: b.icon
        }))
      );
    if (bgError) throw bgError;

    // 4. Insertar Metas
    const { error: goalError } = await supabase
      .from('goals')
      .insert(
        goalsData.map(g => ({
          user_id: userId,
          name: g.name,
          target_amount: g.targetAmount,
          current_amount: g.currentAmount,
          target_date: g.date,
          currency: g.currency,
          icon: g.icon
        }))
      );
    if (goalError) throw goalError;

    return true;
  }
};
