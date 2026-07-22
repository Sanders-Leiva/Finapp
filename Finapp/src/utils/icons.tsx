import React from 'react';
import { 
  Utensils, Car, Lightbulb, ShoppingBag, 
  Film, Home, HeartPulse, GraduationCap, 
  HelpCircle, Briefcase, Laptop, CircleDollarSign,
  Landmark, CreditCard, Banknote, PiggyBank, 
  TrendingUp, Building2, Coins, Smartphone, Wallet
} from 'lucide-react';

// --- CATEGORY MAPPINGS ---

export const CATEGORY_ICONS: Record<string, React.ElementType> = {
  // Expenses
  food: Utensils,
  transport: Car,
  utilities: Lightbulb,
  shopping: ShoppingBag,
  entertainment: Film,
  rent: Home,
  health: HeartPulse,
  education: GraduationCap,
  other_expense: HelpCircle,
  // Incomes
  salary: Briefcase,
  freelance: Laptop,
  other: CircleDollarSign
};

export const CATEGORY_LABELS: Record<string, string> = {
  // Expenses
  food: 'Comida',
  transport: 'Transporte',
  utilities: 'Servicios',
  shopping: 'Compras',
  entertainment: 'Ocio',
  rent: 'Alquiler',
  health: 'Salud',
  education: 'Educación',
  other_expense: 'Otros Gastos',
  // Incomes
  salary: 'Salario',
  freelance: 'Freelance',
  other: 'Otros'
};

export const getCategoryIcon = (category: string) => {
  return CATEGORY_ICONS[category] || HelpCircle;
};

export const getCategoryLabel = (category: string) => {
  return CATEGORY_LABELS[category] || category;
};

// --- ACCOUNT MAPPINGS ---

export const ACCOUNT_ICON_KEYS = [
  'landmark', 'credit-card', 'banknote', 'piggy-bank', 
  'trending-up', 'building', 'coins', 'smartphone'
];

export const ACCOUNT_ICONS: Record<string, React.ElementType> = {
  // Nuevos identificadores
  'landmark': Landmark,
  'credit-card': CreditCard,
  'banknote': Banknote,
  'piggy-bank': PiggyBank,
  'trending-up': TrendingUp,
  'building': Building2,
  'coins': Coins,
  'smartphone': Smartphone,
  
  // Emojis legacy (Retrocompatibilidad para DB antigua)
  '🏦': Landmark,
  '💳': CreditCard,
  '💵': Banknote,
  '🐷': PiggyBank,
  '📈': TrendingUp,
  '🏢': Building2,
  '💰': Coins,
  '📱': Smartphone
};

export const getAccountIcon = (iconKey: string | undefined | null) => {
  if (!iconKey) return Wallet;
  return ACCOUNT_ICONS[iconKey] || Wallet;
};
