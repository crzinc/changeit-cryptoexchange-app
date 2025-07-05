import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpDown, Search, TrendingUp, TrendingDown, ChevronDown } from 'lucide-react';

const currencies = [
  { symbol: 'BTC', name: 'Bitcoin', price: 65430, change: 2.5, color: 'bg-orange-500' },
  { symbol: 'ETH', name: 'Ethereum', price: 3200, change: 1.8, color: 'bg-blue-500' },
  { symbol: 'USDT', name: 'Tether', price: 1, change: 0.1, color: 'bg-green-500' },
  { symbol: 'BNB', name: 'Binance Coin', price: 520, change: -0.8, color: 'bg-yellow-500' },
  { symbol: 'XRP', name: 'Ripple', price: 0.62, change: 3.2, color: 'bg-blue-400' },
  { symbol: 'ADA', name: 'Cardano', price: 0.45, change: 1.5, color: 'bg-purple-500' },
  { symbol: 'SOL', name: 'Solana', price: 95, change: 4.2, color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
  { symbol: 'DOT', name: 'Polkadot', price: 8.5, change: -1.2, color: 'bg-pink-500' },
];

const ExchangeForm = () => {
  const [fromCurrency, setFromCurrency] = useState(currencies[0]);
  const [toCurrency, setToCurrency] = useState(currencies[2]);
  const [fromAmount, setFromAmount] = useState('1.0');
  const [toAmount, setToAmount] = useState('65430.00');
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCurrencies = currencies.filter(currency =>
    currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    currency.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const selectCurrency = (currency: any, type: 'from' | 'to') => {
    if (type === 'from') {
      setFromCurrency(currency);
      setShowFromDropdown(false);
    } else {
      setToCurrency(currency);
      setShowToDropdown(false);
    }
    setSearchTerm('');
  };

  const CurrencyDropdown = ({ currencies, onSelect, isOpen, onClose }: any) => (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full left-0 right-0 mt-2 bg-slate-800/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl z-50 overflow-hidden"
        >
          <div className="p-4 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
              <input
                type="text"
                placeholder="Search currencies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-colors duration-300"
              />
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {filteredCurrencies.map((currency, index) => (
              <motion.div
                key={currency.symbol}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02 }}
                onClick={() => onSelect(currency)}
                className="p-4 hover:bg-white/5 cursor-pointer transition-colors duration-200 border-b border-white/5 last:border-b-0"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 ${currency.color} rounded-full mr-3 flex items-center justify-center`}>
                      <span className="text-white font-bold text-sm">{currency.symbol[0]}</span>
                    </div>
                    <div>
                      <div className="text-white font-semibold">{currency.symbol}</div>
                      <div className="text-white/60 text-sm">{currency.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-semibold">${currency.price.toLocaleString()}</div>
                    <div className={`text-sm flex items-center ${currency.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {currency.change >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                      {Math.abs(currency.change)}%
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <section id="exchange" className="py-20 bg-slate-900/50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-white">Exchange</span>{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Instantly
            </span>
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Trade 500+ cryptocurrencies with zero fees and real-time rates
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
            <div className="space-y-6">
              {/* From Section */}
              <div className="relative">
                <label className="block text-white/80 text-sm font-medium mb-3">From</label>
                <div className="bg-slate-700/50 rounded-2xl p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="relative">
                      <button
                        onClick={() => setShowFromDropdown(!showFromDropdown)}
                        className="flex items-center bg-slate-600/50 hover:bg-slate-600/70 rounded-xl px-4 py-2 transition-colors duration-200"
                      >
                        <div className={`w-6 h-6 ${fromCurrency.color} rounded-full mr-2 flex items-center justify-center`}>
                          <span className="text-white font-bold text-xs">{fromCurrency.symbol[0]}</span>
                        </div>
                        <span className="text-white font-semibold mr-2">{fromCurrency.symbol}</span>
                        <ChevronDown className="w-4 h-4 text-white/60" />
                      </button>
                      <CurrencyDropdown
                        currencies={filteredCurrencies}
                        onSelect={(currency: any) => selectCurrency(currency, 'from')}
                        isOpen={showFromDropdown}
                        onClose={() => setShowFromDropdown(false)}
                      />
                    </div>
                    <div className="text-right">
                      <div className="text-white/60 text-sm">Balance</div>
                      <div className="text-white font-semibold">2.45 {fromCurrency.symbol}</div>
                    </div>
                  </div>
                  <input
                    type="number"
                    value={fromAmount}
                    onChange={(e) => setFromAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-transparent text-3xl font-bold text-white outline-none placeholder-white/40"
                  />
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={swapCurrencies}
                  className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center hover:from-cyan-400 hover:to-purple-400 transition-all duration-300 shadow-lg"
                >
                  <ArrowUpDown className="w-5 h-5 text-white" />
                </motion.button>
              </div>

              {/* To Section */}
              <div className="relative">
                <label className="block text-white/80 text-sm font-medium mb-3">To</label>
                <div className="bg-slate-700/50 rounded-2xl p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="relative">
                      <button
                        onClick={() => setShowToDropdown(!showToDropdown)}
                        className="flex items-center bg-slate-600/50 hover:bg-slate-600/70 rounded-xl px-4 py-2 transition-colors duration-200"
                      >
                        <div className={`w-6 h-6 ${toCurrency.color} rounded-full mr-2 flex items-center justify-center`}>
                          <span className="text-white font-bold text-xs">{toCurrency.symbol[0]}</span>
                        </div>
                        <span className="text-white font-semibold mr-2">{toCurrency.symbol}</span>
                        <ChevronDown className="w-4 h-4 text-white/60" />
                      </button>
                      <CurrencyDropdown
                        currencies={filteredCurrencies}
                        onSelect={(currency: any) => selectCurrency(currency, 'to')}
                        isOpen={showToDropdown}
                        onClose={() => setShowToDropdown(false)}
                      />
                    </div>
                    <div className="text-right">
                      <div className="text-white/60 text-sm">≈ ${(parseFloat(toAmount) * toCurrency.price).toLocaleString()}</div>
                    </div>
                  </div>
                  <input
                    type="number"
                    value={toAmount}
                    onChange={(e) => setToAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-transparent text-3xl font-bold text-white outline-none placeholder-white/40"
                  />
                </div>
              </div>

              {/* Exchange Info */}
              <div className="bg-slate-700/30 rounded-2xl p-4 border border-white/5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/60 text-sm">Rate</span>
                  <span className="text-white font-semibold">1 {fromCurrency.symbol} = {(toCurrency.price / fromCurrency.price).toFixed(4)} {toCurrency.symbol}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/60 text-sm">Network Fee</span>
                  <span className="text-green-400 font-semibold">Free</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm">Processing Time</span>
                  <span className="text-white font-semibold">~2 minutes</span>
                </div>
              </div>

              {/* Exchange Button */}
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(6, 182, 212, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl text-white font-semibold text-lg hover:from-cyan-400 hover:to-purple-400 transition-all duration-300 shadow-lg"
              >
                Exchange Now
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ExchangeForm;