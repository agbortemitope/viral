export interface CurrencyRate {
  code: string;
  name: string;
  symbol: string;
  rate: number;
}

export interface LocationData {
  country: string;
  countryCode: string;
  currency: string;
  currencySymbol: string;
}

// Currency conversion rates (in a real app, this would come from an API)
const CURRENCY_RATES: Record<string, CurrencyRate> = {
  USD: { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1 },
  EUR: { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.85 },
  GBP: { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.73 },
  NGN: { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', rate: 411 },
  CAD: { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 1.25 },
  AUD: { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.35 },
  JPY: { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 110 },
  INR: { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 74 },
};

// Country to currency mapping
const COUNTRY_CURRENCY_MAP: Record<string, string> = {
  US: 'USD',
  CA: 'CAD',
  GB: 'GBP',
  AU: 'AUD',
  JP: 'JPY',
  IN: 'INR',
  NG: 'NGN',
  DE: 'EUR',
  FR: 'EUR',
  IT: 'EUR',
  ES: 'EUR',
  NL: 'EUR',
};

export async function getUserLocation(): Promise<LocationData> {
  try {
    // Try to get user's location from IP
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    const countryCode = data.country_code || 'US';
    const currency = COUNTRY_CURRENCY_MAP[countryCode] || 'USD';
    const currencyData = CURRENCY_RATES[currency];
    
    return {
      country: data.country_name || 'United States',
      countryCode,
      currency,
      currencySymbol: currencyData.symbol,
    };
  } catch (error) {
    console.error('Failed to get user location:', error);
    // Default to US
    return {
      country: 'United States',
      countryCode: 'US',
      currency: 'USD',
      currencySymbol: '$',
    };
  }
}

export function convertCurrency(amount: number, fromCurrency: string, toCurrency: string): number {
  const fromRate = CURRENCY_RATES[fromCurrency]?.rate || 1;
  const toRate = CURRENCY_RATES[toCurrency]?.rate || 1;
  
  // Convert to USD first, then to target currency
  const usdAmount = amount / fromRate;
  return usdAmount * toRate;
}

export function formatCurrency(amount: number, currency: string): string {
  const currencyData = CURRENCY_RATES[currency];
  if (!currencyData) return `${amount}`;
  
  return `${currencyData.symbol}${amount.toLocaleString()}`;
}

export function getAllCurrencies(): CurrencyRate[] {
  return Object.values(CURRENCY_RATES);
}