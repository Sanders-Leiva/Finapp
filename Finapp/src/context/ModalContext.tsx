import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Transaction, Account, Budget, Goal } from '../services/api';

interface ModalContextType {
  isTransactionModalOpen: boolean;
  editingTransaction: Transaction | null;
  openTransactionModal: (tx?: Transaction) => void;
  closeTransactionModal: () => void;
  
  isAccountModalOpen: boolean;
  editingAccount: Account | null;
  openAccountModal: (acc?: Account) => void;
  closeAccountModal: () => void;

  isBudgetModalOpen: boolean;
  editingBudget: Budget | null;
  openBudgetModal: (budget?: Budget) => void;
  closeBudgetModal: () => void;

  isGoalModalOpen: boolean;
  editingGoal: Goal | null;
  openGoalModal: (goal?: Goal) => void;
  closeGoalModal: () => void;

  isGoalContributionModalOpen: boolean;
  contributingGoal: Goal | null;
  openGoalContributionModal: (goal: Goal) => void;
  closeGoalContributionModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const [isGoalContributionModalOpen, setIsGoalContributionModalOpen] = useState(false);
  const [contributingGoal, setContributingGoal] = useState<Goal | null>(null);

  const openTransactionModal = (tx?: Transaction) => {
    if (tx) setEditingTransaction(tx);
    else setEditingTransaction(null);
    setIsTransactionModalOpen(true);
  };
  const closeTransactionModal = () => {
    setIsTransactionModalOpen(false);
    setTimeout(() => setEditingTransaction(null), 200); // clear after animation
  };

  const openAccountModal = (acc?: Account) => {
    if (acc) setEditingAccount(acc);
    else setEditingAccount(null);
    setIsAccountModalOpen(true);
  };
  const closeAccountModal = () => {
    setIsAccountModalOpen(false);
    setTimeout(() => setEditingAccount(null), 200);
  };

  const openBudgetModal = (budget?: Budget) => {
    if (budget) setEditingBudget(budget);
    else setEditingBudget(null);
    setIsBudgetModalOpen(true);
  };
  const closeBudgetModal = () => {
    setIsBudgetModalOpen(false);
    setTimeout(() => setEditingBudget(null), 200);
  };

  const openGoalModal = (goal?: Goal) => {
    if (goal) setEditingGoal(goal);
    else setEditingGoal(null);
    setIsGoalModalOpen(true);
  };
  const closeGoalModal = () => {
    setIsGoalModalOpen(false);
    setTimeout(() => setEditingGoal(null), 200);
  };

  const openGoalContributionModal = (goal: Goal) => {
    setContributingGoal(goal);
    setIsGoalContributionModalOpen(true);
  };
  const closeGoalContributionModal = () => {
    setIsGoalContributionModalOpen(false);
    setTimeout(() => setContributingGoal(null), 200);
  };

  return (
    <ModalContext.Provider
      value={{
        isTransactionModalOpen,
        editingTransaction,
        openTransactionModal,
        closeTransactionModal,
        isAccountModalOpen,
        editingAccount,
        openAccountModal,
        closeAccountModal,
        isBudgetModalOpen,
        editingBudget,
        openBudgetModal,
        closeBudgetModal,
        isGoalModalOpen,
        editingGoal,
        openGoalModal,
        closeGoalModal,
        isGoalContributionModalOpen,
        contributingGoal,
        openGoalContributionModal,
        closeGoalContributionModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
