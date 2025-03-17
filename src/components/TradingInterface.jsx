import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle, Target, Clock, Settings, PlayCircle, StopCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const TradingInterface = ({ strategy }) => {
  const [isAutoTrading, setIsAutoTrading] = useState(false);
  const [tradeSettings, setTradeSettings] = useState({
    investment: 1000,
    stopLoss: 5,
    takeProfit: 10,
    trailingStop: false,
    maxTrades: 5,
    timeFrame: '5m'
  });

  const [position, setPosition] = useState({
    type: null, // 'buy' or 'sell'
    entryPrice: null,
    quantity: null,
    profit: null,
    status: 'closed' // 'open' or 'closed'
  });

  const handleSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTradeSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTrade = (type) => {
    setPosition({
      type,
      entryPrice: 100.25, // Example price
      quantity: Math.floor(tradeSettings.investment / 100.25),
      profit: 0,
      status: 'open'
    });
  };

  const toggleAutoTrading = () => {
    setIsAutoTrading(!isAutoTrading);
  };

  return (
    <div className="bg-gray-800 rounded-xl p-8 mb-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Trading Controls */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">Trading Controls</h3>
          
          {/* Manual Trading Buttons */}
          <div className="flex gap-4 mb-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleTrade('buy')}
              disabled={position.status === 'open'}
              className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white py-4 rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              <TrendingUp className="h-5 w-5" />
              Buy
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleTrade('sell')}
              disabled={position.status === 'open'}
              className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-600 text-white py-4 rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              <TrendingDown className="h-5 w-5" />
              Sell
            </motion.button>
          </div>

          {/* Auto Trading Toggle */}
          <div className="mb-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={toggleAutoTrading}
              className={`w-full py-4 rounded-lg font-semibold flex items-center justify-center gap-2 ${
                isAutoTrading 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-emerald-500 hover:bg-emerald-600'
              } text-white`}
            >
              {isAutoTrading ? (
                <>
                  <StopCircle className="h-5 w-5" />
                  Stop Auto Trading
                </>
              ) : (
                <>
                  <PlayCircle className="h-5 w-5" />
                  Start Auto Trading
                </>
              )}
            </motion.button>
          </div>

          {/* Trading Settings */}
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 mb-2">Investment Amount ($)</label>
              <input
                type="number"
                name="investment"
                value={tradeSettings.investment}
                onChange={handleSettingsChange}
                className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-2">Stop Loss (%)</label>
                <input
                  type="number"
                  name="stopLoss"
                  value={tradeSettings.stopLoss}
                  onChange={handleSettingsChange}
                  className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Take Profit (%)</label>
                <input
                  type="number"
                  name="takeProfit"
                  value={tradeSettings.takeProfit}
                  onChange={handleSettingsChange}
                  className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="trailingStop"
                checked={tradeSettings.trailingStop}
                onChange={handleSettingsChange}
                className="h-4 w-4 text-emerald-500 rounded border-gray-300 focus:ring-emerald-500"
              />
              <label className="ml-2 text-gray-400">Enable Trailing Stop</label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-2">Max Trades</label>
                <input
                  type="number"
                  name="maxTrades"
                  value={tradeSettings.maxTrades}
                  onChange={handleSettingsChange}
                  className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Time Frame</label>
                <select
                  name="timeFrame"
                  value={tradeSettings.timeFrame}
                  onChange={handleSettingsChange}
                  className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <option value="1m">1 minute</option>
                  <option value="5m">5 minutes</option>
                  <option value="15m">15 minutes</option>
                  <option value="1h">1 hour</option>
                  <option value="4h">4 hours</option>
                  <option value="1d">1 day</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Position Information */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">Position Details</h3>
          
          {/* Current Position */}
          <div className="bg-gray-700 rounded-xl p-6 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 mb-1">Position Type</p>
                <p className="text-xl font-semibold text-white">
                  {position.type ? (
                    <span className={position.type === 'buy' ? 'text-green-400' : 'text-red-400'}>
                      {position.type.toUpperCase()}
                    </span>
                  ) : (
                    'No Position'
                  )}
                </p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Status</p>
                <p className="text-xl font-semibold text-white">
                  {position.status.toUpperCase()}
                </p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Entry Price</p>
                <p className="text-xl font-semibold text-white">
                  {`position.entryPrice ? ${position.entryPrice} : '-'`}
                </p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Quantity</p>
                <p className="text-xl font-semibold text-white">
                  {position.quantity || '-'}
                </p>
              </div>
            </div>
          </div>

          {/* Strategy Stats */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Target className="h-5 w-5 text-emerald-400 mr-2" />
                <span className="text-gray-400">Win Rate</span>
              </div>
              <span className="text-white font-semibold">78.5%</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-emerald-400 mr-2" />
                <span className="text-gray-400">Profit Factor</span>
              </div>
              <span className="text-white font-semibold">2.4</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-emerald-400 mr-2" />
                <span className="text-gray-400">Avg Trade Duration</span>
              </div>
              <span className="text-white font-semibold">45 min</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-emerald-400 mr-2" />
                <span className="text-gray-400">Max Drawdown</span>
              </div>
              <span className="text-white font-semibold">12.5%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingInterface;