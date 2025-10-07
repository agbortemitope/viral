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

// Currency conversion rates with different rates for purchase and withdrawal
// Purchase rate: 100 coins = 1500 NGN (users pay more to buy)
// Withdrawal rate: 100 coins = 500 NGN (users receive less when withdrawing)
const COINS_TO_NGN_PURCHASE = 1500; // 100 coins = 1500 NGN for buying
const COINS_TO_NGN_WITHDRAWAL = 500; // 100 coins = 500 NGN for withdrawal
const BASE_COINS = 100;

// Withdrawal rates (what users receive)
const WITHDRAWAL_RATES: Record<string, CurrencyRate> = {
  NGN: { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', rate: COINS_TO_NGN_WITHDRAWAL / BASE_COINS }, // 5 NGN per coin
  USD: { code: 'USD', name: 'US Dollar', symbol: '$', rate: 0.66 },
  EUR: { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.60 },
  GBP: { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.52 },
  CAD: { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 0.90 },
  AUD: { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.00 },
  JPY: { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 98 },
  INR: { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 55 },
  ZAR: { code: 'ZAR', name: 'South African Rand', symbol: 'R', rate: 12 },
  KES: { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', rate: 85 },
  GHS: { code: 'GHS', name: 'Ghanaian Cedi', symbol: '₵', rate: 9 },
  EGP: { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£', rate: 32 },
};

// Purchase rates (what users pay)
const PURCHASE_RATES: Record<string, CurrencyRate> = {
  NGN: { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', rate: COINS_TO_NGN_PURCHASE / BASE_COINS }, // 15 NGN per coin
  USD: { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1.98 },
  EUR: { code: 'EUR', name: 'Euro', symbol: '€', rate: 1.80 },
  GBP: { code: 'GBP', name: 'British Pound', symbol: '£', rate: 1.56 },
  CAD: { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 2.70 },
  AUD: { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 3.00 },
  JPY: { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 294 },
  INR: { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 165 },
  ZAR: { code: 'ZAR', name: 'South African Rand', symbol: 'R', rate: 36 },
  KES: { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', rate: 255 },
  GHS: { code: 'GHS', name: 'Ghanaian Cedi', symbol: '₵', rate: 27 },
  EGP: { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£', rate: 96 },
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
    const currencyData = WITHDRAWAL_RATES[currency];
    
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

export function convertCurrency(amount: number, fromCurrency: string, toCurrency: string, forPurchase: boolean = false): number {
  const rates = forPurchase ? PURCHASE_RATES : WITHDRAWAL_RATES;
  const fromRate = rates[fromCurrency]?.rate || 1;
  const toRate = rates[toCurrency]?.rate || 1;
  
  // Direct conversion based on rates
  const result = (amount * toRate) / fromRate;
  return Math.round(result * 100) / 100; // Round to 2 decimal places
}

// Convert coins to any currency for withdrawal
export function coinsToFiat(coins: number, currency: string): number {
  const rate = WITHDRAWAL_RATES[currency]?.rate || 1;
  return Math.round(coins * rate * 100) / 100;
}

// Convert fiat to coins for purchase
export function fiatToCoins(amount: number, currency: string): number {
  const rate = PURCHASE_RATES[currency]?.rate || 1;
  return Math.round((amount / rate) * 100) / 100;
}

export function formatCurrency(amount: number, currency: string): string {
  const currencyData = WITHDRAWAL_RATES[currency];
  if (!currencyData) return `${amount}`;
  
  return `${currencyData.symbol}${amount.toLocaleString()}`;
}

export function getAllCurrencies(): CurrencyRate[] {
  return Object.values(WITHDRAWAL_RATES);
}

// Get purchase rate for a currency
export function getPurchaseRate(currency: string): CurrencyRate | undefined {
  return PURCHASE_RATES[currency];
}

// Get withdrawal rate for a currency
export function getWithdrawalRate(currency: string): CurrencyRate | undefined {
  return WITHDRAWAL_RATES[currency];
}