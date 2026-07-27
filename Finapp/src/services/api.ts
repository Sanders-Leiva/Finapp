import { supabase } from '../lib/supabase';
import Swal from 'sweetalert2';
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
  type: string; // 'bank', 'cash', 'credit'
  balance: number;
  currency: string;
  icon: string;
  color: string;
  created_at: string;
  credit_limit?: number;
  cutoff_date?: number;
  payment_date?: number;
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

export interface Reminder {
  id: string;
  user_id: string;
  title: string;
  amount: number;
  currency: string;
  due_date: string;
  is_paid: boolean;
  paid_dates?: string[];
  frequency: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  created_at: string;
}

// DTOs
export type CreateAccountDTO = Omit<Account, 'id' | 'created_at'>;
export type UpdateAccountDTO = Partial<CreateAccountDTO>;

export type CreateTransactionDTO = Omit<Transaction, 'id' | 'account'>;
export type UpdateTransactionDTO = Partial<CreateTransactionDTO>;

export type CreateBudgetDTO = Omit<Budget, 'id' | 'created_at'>;
export type UpdateBudgetDTO = Partial<CreateBudgetDTO>;

export type CreateGoalDTO = Omit<Goal, 'id' | 'created_at'>;
export type UpdateGoalDTO = Partial<CreateGoalDTO>;

// MANEJO DE ERRORES CENTRALIZADO
const handleApiError = (error: any, context: string) => {
  console.error(`Error en ${context}:`, error);
  Swal.fire({
    title: 'Error de Conexión',
    text: `Ocurrió un problema: ${error?.message || 'Error desconocido'}`,
    icon: 'error',
    confirmButtonColor: '#14b8a6',
    confirmButtonText: 'Entendido'
  });
  throw error;
};

// SERVICIO API
export const api = {
  // --- CONSULTAS ---

  async getAccounts(userId: string) {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });
    if (error) handleApiError(error, 'getAccounts');
    return data as Account[];
  },

  async createAccount(accountData: CreateAccountDTO) {
    const { data, error } = await supabase
      .from('accounts')
      .insert([accountData])
      .select('*')
      .single();
    if (error) handleApiError(error, 'createAccount');
    return data as Account;
  },

  async updateAccount(id: string, accountData: UpdateAccountDTO) {
    const { data, error } = await supabase
      .from('accounts')
      .update(accountData)
      .eq('id', id)
      .select('*')
      .single();
    if (error) handleApiError(error, 'updateAccount');
    return data as Account;
  },

  async deleteAccount(id: string) {
    const { error } = await supabase
      .from('accounts')
      .delete()
      .eq('id', id);
    if (error) handleApiError(error, 'deleteAccount');
    return true;
  },

  async getTransactions(userId: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*, account:accounts(name, icon, color)')
      .eq('user_id', userId)
      .order('date', { ascending: false });
    if (error) handleApiError(error, 'getTransactions');
    return data as Transaction[];
  },

  async createTransaction(txData: CreateTransactionDTO) {
    const { data, error } = await supabase
      .from('transactions')
      .insert([txData])
      .select('*, account:accounts(name, icon, color)')
      .single();
    if (error) handleApiError(error, 'createTransaction');
    return data as Transaction;
  },

  async updateTransaction(id: string, txData: UpdateTransactionDTO) {
    const { data, error } = await supabase
      .from('transactions')
      .update(txData)
      .eq('id', id)
      .select('*, account:accounts(name, icon, color)')
      .single();
    if (error) handleApiError(error, 'updateTransaction');
    return data as Transaction;
  },

  async deleteTransaction(id: string) {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);
    if (error) handleApiError(error, 'deleteTransaction');
    return true;
  },

  // --- BUDGETS ---
  async getBudgets(userId: string) {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });
    if (error) handleApiError(error, 'getBudgets');
    return data as Budget[];
  },

  async createBudget(budgetData: CreateBudgetDTO) {
    const { data, error } = await supabase
      .from('budgets')
      .insert([budgetData])
      .select('*')
      .single();
    if (error) handleApiError(error, 'createBudget');
    return data as Budget;
  },

  async updateBudget(id: string, budgetData: UpdateBudgetDTO) {
    const { data, error } = await supabase
      .from('budgets')
      .update(budgetData)
      .eq('id', id)
      .select('*')
      .single();
    if (error) handleApiError(error, 'updateBudget');
    return data as Budget;
  },

  async deleteBudget(id: string) {
    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id);
    if (error) handleApiError(error, 'deleteBudget');
    return true;
  },

  // --- GOALS ---
  async getGoals(userId: string) {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });
    if (error) handleApiError(error, 'getGoals');
    return data as Goal[];
  },

  async createGoal(goalData: CreateGoalDTO) {
    const { data, error } = await supabase
      .from('goals')
      .insert([goalData])
      .select('*')
      .single();
    if (error) handleApiError(error, 'createGoal');
    return data as Goal;
  },

  async updateGoal(id: string, goalData: UpdateGoalDTO) {
    const { data, error } = await supabase
      .from('goals')
      .update(goalData)
      .eq('id', id)
      .select('*')
      .single();
    if (error) handleApiError(error, 'updateGoal');
    return data as Goal;
  },

  async deleteGoal(id: string) {
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', id);
    if (error) handleApiError(error, 'deleteGoal');
    return true;
  },

  // --- REMINDERS ---
  async getReminders(userId: string) {
    const { data, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('user_id', userId)
      .order('due_date', { ascending: true });
    if (error) handleApiError(error, 'getReminders');
    return data as Reminder[];
  },

  async createReminder(reminderData: Omit<Reminder, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('reminders')
      .insert([reminderData])
      .select('*')
      .single();
    if (error) handleApiError(error, 'createReminder');
    return data as Reminder;
  },

  async updateReminder(id: string, reminderData: Partial<Reminder>) {
    const { data, error } = await supabase
      .from('reminders')
      .update(reminderData)
      .eq('id', id)
      .select('*')
      .single();
    if (error) handleApiError(error, 'updateReminder');
    return data as Reminder;
  },

  async deleteReminder(id: string) {
    const { error } = await supabase
      .from('reminders')
      .delete()
      .eq('id', id);
    if (error) handleApiError(error, 'deleteReminder');
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
    if (accError) handleApiError(accError, 'seedMockData (accounts)');

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
    if (txError) handleApiError(txError, 'seedMockData (transactions)');

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
    if (bgError) handleApiError(bgError, 'seedMockData (budgets)');

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
    if (goalError) handleApiError(goalError, 'seedMockData (goals)');

    return true;
  }
};
