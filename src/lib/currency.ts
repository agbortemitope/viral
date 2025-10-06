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

// Currency conversion rates: 100 coins = 500 naira as base
// All rates are calculated relative to this base rate
const COINS_TO_NGN = 500; // 100 coins = 500 NGN
const BASE_COINS = 100;

const CURRENCY_RATES: Record<string, CurrencyRate> = {
  NGN: { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', rate: COINS_TO_NGN / BASE_COINS }, // 5 NGN per coin
  USD: { code: 'USD', name: 'US Dollar', symbol: '$', rate: 0.66 }, // ~$0.66 per coin (500 NGN ≈ $0.66 at 760 NGN/$)
  EUR: { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.60 }, // ~€0.60 per coin
  GBP: { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.52 }, // ~£0.52 per coin
  CAD: { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 0.90 },
  AUD: { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.00 },
  JPY: { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 98 },
  INR: { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 55 },
  ZAR: { code: 'ZAR', name: 'South African Rand', symbol: 'R', rate: 12 },
  KES: { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', rate: 85 },
  GHS: { code: 'GHS', name: 'Ghanaian Cedi', symbol: '₵', rate: 9 },
  EGP: { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£', rate: 32 },
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
  ZA: 'ZAR',
  KE: 'KES',
  GH: 'GHS',
  EG: 'EGP',
  DE: 'EUR',
  FR: 'EUR',
  IT: 'EUR',
  ES: 'EUR',
  NL: 'EUR',
  AT: 'EUR',
  BE: 'EUR',
  FI: 'EUR',
  IE: 'EUR',
  PT: 'EUR',
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
  
  // Direct conversion based on rates
  const result = (amount * toRate) / fromRate;
  return Math.round(result * 100) / 100; // Round to 2 decimal places
}

// Convert coins to any currency
export function coinsToFiat(coins: number, currency: string): number {
  const rate = CURRENCY_RATES[currency]?.rate || 1;
  return Math.round(coins * rate * 100) / 100;
}

// Convert fiat to coins
export function fiatToCoins(amount: number, currency: string): number {
  const rate = CURRENCY_RATES[currency]?.rate || 1;
  return Math.round((amount / rate) * 100) / 100;
}

export function formatCurrency(amount: number, currency: string): string {
  const currencyData = CURRENCY_RATES[currency];
  if (!currencyData) return `${amount}`;
  
  return `${currencyData.symbol}${amount.toLocaleString()}`;
}

export function getAllCurrencies(): CurrencyRate[] {
  return Object.values(CURRENCY_RATES);
}