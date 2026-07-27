export const fetchExchangeRate = async (): Promise<number> => {
  try {
    const res = await fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json');
    if (!res.ok) throw new Error('API request failed');
    const data = await res.json();
    return data.usd.nio || 36.6;
  } catch (error) {
    console.error("Failed to fetch exchange rate, using fallback:", error);
    return 36.6; // Fallback USD -> NIO rate
  }
};
