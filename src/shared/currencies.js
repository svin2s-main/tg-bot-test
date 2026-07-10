export const CURRENCIES = [
  { code: 'RUB', symbol: '₽', flag: '🇷🇺', name: 'Российский рубль' },
  { code: 'USD', symbol: '$', flag: '🇺🇸', name: 'Доллар США' },
  { code: 'EUR', symbol: '€', flag: '🇪🇺', name: 'Евро' },
  { code: 'GBP', symbol: '£', flag: '🇬🇧', name: 'Фунт стерлингов' },
  { code: 'KZT', symbol: '₸', flag: '🇰🇿', name: 'Казахстанский тенге' },
  { code: 'UAH', symbol: '₴', flag: '🇺🇦', name: 'Украинская гривна' },
  { code: 'BYN', symbol: 'Br', flag: '🇧🇾', name: 'Белорусский рубль' },
  { code: 'CNY', symbol: '¥', flag: '🇨🇳', name: 'Китайский юань' },
  { code: 'TRY', symbol: '₺', flag: '🇹🇷', name: 'Турецкая лира' },
  { code: 'PLN', symbol: 'zł', flag: '🇵🇱', name: 'Польский злотый' },
];

const byCode = {};
CURRENCIES.forEach(c => { byCode[c.code] = c; });

export function getCurrency(code) {
  return byCode[code] || byCode['RUB'];
}
