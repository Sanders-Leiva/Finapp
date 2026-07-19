export type Currency = 'NIO' | 'USD';

export const formatCurrency = (amount: number, currency: Currency = 'NIO') => {
  return new Intl.NumberFormat('es-NI', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
};
