import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { useModal } from '../../context/ModalContext';
import Swal from 'sweetalert2';

export const GlobalAIInput = () => {
  const [input, setInput] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const { openTransactionModal, openReminderModal, setInitialAIData } = useModal();

  const handleAIParse = async () => {
    if (!input.trim()) return;
    setIsParsing(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error("API Key faltante");
      
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
        Analiza el siguiente texto y determina si el usuario quiere registrar una transacción financiera (ingreso, gasto, traspaso) o crear un recordatorio/alarma.
        Texto: "${input}"
        
        Devuelve SOLO un objeto JSON válido con las siguientes claves:
        - "intent": "transaction" o "reminder".
        - Si es transaction, incluye:
          - "amount": número.
          - "type": "income" o "expense" o "transfer".
          - "category": una categoría principal válida en inglés (food, transport, utilities, shopping, health, education, rent, entertainment, salary, freelance, other, transfer).
          - "subCategory": sub-categoría válida si aplica (supermarket, restaurants, delivery, coffee, fuel, taxi, public_transport, maintenance, electricity, water, internet, phone, clothing, electronics, gifts, pharmacy, doctor, insurance). Déjalo vacío si no.
          - "title": título corto descriptivo.
          - "currency": "NIO" o "USD". Por defecto "NIO".
        - Si es reminder, incluye:
          - "title": título del recordatorio.
          - "amount": número (si se menciona un monto a pagar, si no 0).
          - "dueDate": fecha en formato YYYY-MM-DD. Si dice "mañana", calcula la fecha de mañana asumiendo que hoy es ${new Date().toISOString().split('T')[0]}.
        
        No incluyas markdown, solo el JSON raw.
      `;
      
      const response = await ai.models.generateContent({
        model: 'gemini-flash-latest',
        contents: prompt
      });
      
      let text = response.text || '';
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const data = JSON.parse(text);
      
      setInitialAIData(data);
      
      if (data.intent === 'transaction') {
        openTransactionModal();
      } else if (data.intent === 'reminder') {
        openReminderModal();
      } else {
        throw new Error("Intent desconocido");
      }
      
      setInput('');
      Swal.fire({
        title: '¡Magia!',
        text: 'Formulario autocompletado.',
        icon: 'success',
        timer: 1000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No pude entender el texto. Intenta ser más claro.', 'error');
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="relative group w-full mb-6">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-brand to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
      <div className="relative flex items-center bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-2 shadow-sm">
        <div className="pl-4 pr-3 text-brand">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAIParse();
            }
          }}
          placeholder="¿Qué hicimos hoy? Ej: Gasté 200 en café..."
          className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-base md:text-lg font-medium text-gray-800 dark:text-gray-200 placeholder-gray-400 py-3"
        />
        <button
          type="button"
          onClick={handleAIParse}
          disabled={isParsing || !input.trim()}
          className="ml-2 mr-1 px-5 py-3 bg-brand text-white font-bold rounded-xl transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2 whitespace-nowrap shadow-lg shadow-brand/30"
        >
          {isParsing ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Mandar'}
        </button>
      </div>
    </div>
  );
};
