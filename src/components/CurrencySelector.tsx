import { useCurrency, CurrencyCode, Currency } from '../context/CurrencyContext';
import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function CurrencySelector() {
  const { currency, setCurrencyCode, availableCurrencies } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl font-bold transition-colors border border-slate-700"
      >
        <span className="text-lg">{currency.symbol}</span>
        <span className="text-sm">{currency.code}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-32 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden"
          >
            {(Object.values(availableCurrencies) as Currency[]).map((curr) => (
              <button
                key={curr.code}
                onClick={() => {
                  setCurrencyCode(curr.code as CurrencyCode);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-slate-700 transition-colors ${
                  currency.code === curr.code ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-300'
                }`}
              >
                <span className="font-bold">{curr.code}</span>
                <span className="text-slate-500">{curr.symbol}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
