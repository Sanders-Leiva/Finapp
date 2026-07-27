import { useState } from 'react';
import { Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { GoogleGenAI } from '@google/genai';
import { formatCurrency } from '../../utils/currency';
import clsx from 'clsx';

export const AIInsightsWidget = () => {
  const { transactions, accounts, exchangeRate } = useStore();
  const [insight, setInsight] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateInsight = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("API Key de Gemini no encontrada. Por favor, añádela en .env.local");
      }

      const ai = new GoogleGenAI({ apiKey });

      // Calcular datos para el prompt
      const totalBalance = accounts.reduce((acc, account) => {
        if (account.currency === 'USD') return acc + (account.balance * exchangeRate);
        return acc + account.balance;
      }, 0);

      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      const monthlyTransactions = transactions.filter(tx => {
        const txDate = new Date(tx.date);
        return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
      });

      const expensesByCategory = monthlyTransactions
        .filter(tx => tx.type === 'expense' && tx.category !== 'transfer')
        .reduce((acc, tx) => {
          const parentCat = tx.category.split(':')[0];
          acc[parentCat] = (acc[parentCat] || 0) + tx.amount;
          return acc;
        }, {} as Record<string, number>);

      const topExpenseCategories = Object.entries(expensesByCategory)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([cat, amount]) => `${cat}: ${amount}`)
        .join(', ');

      const prompt = `
        Eres un asistente financiero personal experto, amigable y conciso.
        Aquí tienes un resumen de mis finanzas de este mes:
        - Balance Total: ${formatCurrency(totalBalance)}
        - Principales gastos por categoría: ${topExpenseCategories || 'Ninguno aún'}
        
        Dame un consejo o "insight" financiero muy breve (máximo 2-3 oraciones cortas). 
        Analiza si estoy gastando mucho en algo, dame ánimo, o sugiere una meta. No uses saludos, ve directo al grano.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-flash-latest',
        contents: prompt,
      });

      setInsight(response.text || null);
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message || 'Error al generar el análisis.');
      } else {
        setError('Error al generar el análisis.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-brand rounded-3xl p-6 md:p-8 shadow-lg text-white">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-black/10 blur-3xl pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold">FinApp AI</h3>
          </div>
          
          <button 
            onClick={generateInsight}
            disabled={isLoading}
            className={clsx(
              "p-2 rounded-full transition-all duration-300",
              isLoading ? "bg-white/10" : "bg-white/20 hover:bg-white/30 active:scale-95",
              insight ? "opacity-100" : "opacity-0"
            )}
            title="Generar nuevo consejo"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-6 animate-pulse">
              <Sparkles className="w-8 h-8 text-white/50 mb-3" />
              <p className="text-white/80 font-medium">Analizando tus finanzas...</p>
            </div>
          ) : error ? (
            <div className="bg-red-500/20 backdrop-blur-md rounded-xl p-4 border border-red-500/30">
              <p className="text-sm text-red-100">{error}</p>
              <button onClick={generateInsight} className="mt-2 text-xs font-bold text-white underline">
                Reintentar
              </button>
            </div>
          ) : insight ? (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 animate-in fade-in zoom-in-95 duration-500">
              <p className="text-lg md:text-xl font-medium leading-relaxed text-white text-shadow-sm">
                "{insight}"
              </p>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-white/80 mb-4 font-medium">Descubre patrones en tus gastos y recibe consejos personalizados con IA.</p>
              <button 
                onClick={generateInsight}
                className="px-6 py-3 bg-white text-brand font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 active:scale-95 flex items-center gap-2 mx-auto"
              >
                <Sparkles className="w-4 h-4" />
                Generar Análisis
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
