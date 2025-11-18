import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';

const TradingGame: React.FC = () => {
  const { t } = useTranslation();
  const [price, setPrice] = useState(100);
  const [balance, setBalance] = useState(1000);
  const [shares, setShares] = useState(0);
  const [lastChange, setLastChange] = useState(0);
  const [history, setHistory] = useState<number[]>(() => Array(50).fill(100)); // More points

  useEffect(() => {
    const interval = setInterval(() => {
      const change = (Math.random() - 0.49) * 5; // Skew slightly positive
      setPrice(prev => {
        const newPrice = Math.max(1, prev + change);
        setHistory(currentHistory => [...currentHistory.slice(1), newPrice]);
        return newPrice;
      });
      setLastChange(change);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const buy = () => {
    if (balance >= price) {
      setBalance(prev => prev - price);
      setShares(prev => prev + 1);
    }
  };

  const sell = () => {
    if (shares > 0) {
      setBalance(prev => prev + price);
      setShares(prev => prev - 1);
    }
  };

  const priceColor = lastChange >= 0 ? 'text-green-400' : 'text-red-400';
  const PriceIcon = lastChange >= 0 ? TrendingUp : TrendingDown;
  const strokeColor = lastChange >= 0 ? '#34d399' : '#f87171'; // green-400 or red-400

  const chartData = useMemo(() => {
    const max = Math.max(...history);
    const min = Math.min(...history);
    const range = max - min === 0 ? 1 : max - min;
    
    const points = history.map((p, i) => {
      const x = (i / (history.length - 1)) * 100;
      const y = 100 - ((p - min) / range) * 80 - 10; // Use 80% of height, offset by 10%
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    }).join(' ');

    return { points };
  }, [history]);


  return (
    <div className="bg-slate-900/70 backdrop-blur-xl p-4 sm:p-8 rounded-2xl border border-slate-800 shadow-2xl shadow-cyan-500/10 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-2 bg-cyan-400/10 rounded-lg">
            <Activity className="text-cyan-400" size={32}/>
        </div>
        <h3 className="text-3xl sm:text-4xl font-bold text-white">{t('tradingGame')}</h3>
      </div>
      
      <div className="bg-black/40 p-2 sm:p-4 rounded-lg mb-6 relative h-64 overflow-hidden">
        <svg viewBox="0 0 100 100" className="absolute top-0 left-0 w-full h-full" preserveAspectRatio="none">
           <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity="0.4"/>
              <stop offset="100%" stopColor={strokeColor} stopOpacity="0"/>
            </linearGradient>
          </defs>
           <polyline fill="none" stroke={strokeColor} strokeWidth="0.5" points={chartData.points} />
           <polygon fill="url(#chartGradient)" points={`0,100 ${chartData.points} 100,100`} />
        </svg>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mb-8">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-sm text-gray-400 uppercase tracking-wider">{t('shares')}</p>
          <p className="text-2xl font-bold text-white">{shares}</p>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg flex flex-col justify-center">
            <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">{t('stockPrice')}</p>
            <div className={`flex items-center justify-center text-3xl font-mono font-bold ${priceColor}`}>
              <DollarSign size={20} className="mr-1 rtl:ml-1 rtl:mr-0"/>
              {price.toFixed(2)}
              <PriceIcon size={20} className="ml-2 rtl:mr-2 rtl:ml-0" />
            </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-sm text-gray-400 uppercase tracking-wider">{t('balance')}</p>
          <p className="text-2xl font-bold text-white">${balance.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex justify-center space-x-4 sm:space-x-6 rtl:space-x-reverse">
        <button onClick={sell} disabled={shares === 0} className="text-xl w-full md:w-auto flex-1 bg-slate-700 hover:bg-slate-600 disabled:bg-gray-600/50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-red-500/20">{t('sell')}</button>
        <button onClick={buy} disabled={balance < price} className="text-xl w-full md:w-auto flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-green-500/20">{t('buy')}</button>
      </div>
    </div>
  );
};

export default TradingGame;