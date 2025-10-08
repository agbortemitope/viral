// Nigerian banks and their codes for Paystack
export const nigerianBanks: Record<string, string> = {
  'access bank': '044',
  'access bank (diamond)': '063',
  'citibank': '023',
  'ecobank': '050',
  'fidelity bank': '070',
  'first bank': '011',
  'first city monument bank': '214',
  'fcmb': '214',
  'guaranty trust bank': '058',
  'gtbank': '058',
  'heritage bank': '030',
  'keystone bank': '082',
  'polaris bank': '076',
  'providus bank': '101',
  'stanbic ibtc bank': '221',
  'standard chartered bank': '068',
  'sterling bank': '232',
  'union bank': '032',
  'united bank for africa': '033',
  'uba': '033',
  'unity bank': '215',
  'wema bank': '035',
  'zenith bank': '057',
  'kuda bank': '50211',
  'vfd microfinance bank': '566',
  'opay': '100004',
  'palmpay': '100033',
  'moniepoint': '50515',
  'taj bank': '302',
  'jaiz bank': '301',
  'lotus bank': '303',
  'parallex bank': '526',
  'rand merchant bank': '502',
  'globus bank': '00103',
  'suntrust bank': '100',
  'titan trust bank': '102',
};

export const getBankCode = (bankName: string): string | null => {
  const normalizedName = bankName.toLowerCase().trim();
  return nigerianBanks[normalizedName] || null;
};
