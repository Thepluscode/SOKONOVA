
import React, { useState, useEffect, useRef } from 'react';

interface Currency {
  code: string;
  symbol: string;
  name: string;
  rate: number;
}

const currencies: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1 },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92 },
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.79 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rate: 149.50 },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', rate: 1.35 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rate: 1.52 },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc', rate: 0.88 },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', rate: 7.24 },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 83.12 },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling', rate: 129.50 }
];

const CurrencySwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('selectedCurrency');
    if (saved) {
      const currency = currencies.find(c => c.code === saved);
      if (currency) setSelectedCurrency(currency);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCurrencyChange = (currency: Currency) => {
    setSelectedCurrency(currency);
    localStorage.setItem('selectedCurrency', currency.code);
    setIsOpen(false);
    window.dispatchEvent(new CustomEvent('currencyChange', { detail: currency }));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
      >
        <span className="text-base">{selectedCurrency.symbol}</span>
        <span>{selectedCurrency.code}</span>
        <i className={`ri-arrow-down-s-line transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Select Currency</p>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {currencies.map((currency) => (
              <button
                key={currency.code}
                onClick={() => handleCurrencyChange(currency)}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${selectedCurrency.code === currency.code ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400' : 'text-gray-700 dark:text-gray-300'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-medium w-8">{currency.symbol}</span>
                  <div className="text-left">
                    <div className="font-medium">{currency.code}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{currency.name}</div>
                  </div>
                </div>
                {selectedCurrency.code === currency.code && (
                  <i className="ri-check-line text-teal-600 dark:text-teal-400"></i>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencySwitcher;

export const convertPrice = (price: number, fromCurrency = 'USD'): string => {
  const saved = localStorage.getItem('selectedCurrency');
  const currency = currencies.find(c => c.code === saved) || currencies[0];

  const convertedPrice = price * currency.rate;
  return `${currency.symbol}${convertedPrice.toFixed(2)}`;
};

export const useCurrency = () => {
  const [currency, setCurrency] = useState<Currency>(currencies[0]);

  useEffect(() => {
    const saved = localStorage.getItem('selectedCurrency');
    if (saved) {
      const found = currencies.find(c => c.code === saved);
      if (found) setCurrency(found);
    }

    const handleCurrencyChange = (event: CustomEvent) => {
      setCurrency(event.detail);
    };

    window.addEventListener('currencyChange', handleCurrencyChange as EventListener);
    return () => window.removeEventListener('currencyChange', handleCurrencyChange as EventListener);
  }, []);

  return currency;
};
