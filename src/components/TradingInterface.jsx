import React, { useState, useEffect, useCallback } from 'react';
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle, Target, Clock, Settings, PlayCircle, StopCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const TradingInterface = ({ strategy }) => {
  // Trading settings state
  const [isAutoTrading, setIsAutoTrading] = useState(false);
  const [tradeSettings, setTradeSettings] = useState({
    investment: 1000,
    stopLoss: 5,
    takeProfit: 10,
    trailingStop: false,
    maxTrades: 5,
    timeFrame: '5m'
  });

  // Position and market state
  const [position, setPosition] = useState({
    type: null, // 'buy' or 'sell'
    entryPrice: null,
    quantity: null,
    profit: null,
    status: 'closed' // 'open' or 'closed'
  });
  const [marketPrice, setMarketPrice] = useState(100.25);
  const [marketPrediction, setMarketPrediction] = useState(null);

  // Auto trading state
  const [tradeCount, setTradeCount] = useState(0);
  const [lastSignal, setLastSignal] = useState(null);
  const [autoTradeInterval, setAutoTradeInterval] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tradeHistory, setTradeHistory] = useState([]);

  // Handle settings changes
  const handleSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTradeSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) : value)
    }));
  };

  // Get current market price (simulated)
  const getCurrentMarketPrice = async () => {
    try {
      // Simulate market data retrieval - in a real implementation you would fetch from a market data API
      const newPrice = 100.25 + (Math.random() * 5 - 2.5); // Random price around 100.25
      setMarketPrice(newPrice);
      return newPrice;
    } catch (error) {
      console.error("Error fetching market price:", error);
      return marketPrice; // Fallback to current price
    }
  };

  // Check if stop loss or take profit is triggered
  const checkStopLossAndTakeProfit = useCallback(async () => {
    if (position.status !== 'open') return;
    
    try {
      const currentPrice = await getCurrentMarketPrice();
      let shouldClose = false;
      let profitAmount = 0;
      let closeReason = '';
      
      if (position.type === 'buy') {
        // Calculate profit/loss percentage for long position
        const priceDiff = currentPrice - position.entryPrice;
        const percentChange = (priceDiff / position.entryPrice) * 100;
        profitAmount = position.quantity * priceDiff;
        
        // Check stop loss
        if (percentChange <= -tradeSettings.stopLoss) {
          shouldClose = true;
          closeReason = 'Stop loss';
          setNotification({
            type: 'error',
            message: `Stop loss triggered at ${currentPrice.toFixed(2)}`
          });
        }
        
        // Check take profit
        if (percentChange >= tradeSettings.takeProfit) {
          shouldClose = true;
          closeReason = 'Take profit';
          setNotification({
            type: 'success',
            message: `Take profit triggered at ${currentPrice.toFixed(2)}`
          });
        }
      } else if (position.type === 'sell') {
        // Calculate profit/loss percentage for short position
        const priceDiff = position.entryPrice - currentPrice;
        const percentChange = (priceDiff / position.entryPrice) * 100;
        profitAmount = position.quantity * priceDiff;
        
        // Check stop loss
        if (percentChange <= -tradeSettings.stopLoss) {
          shouldClose = true;
          closeReason = 'Stop loss';
          setNotification({
            type: 'error',
            message: `Stop loss triggered at ${currentPrice.toFixed(2)}`
          });
        }
        
        // Check take profit
        if (percentChange >= tradeSettings.takeProfit) {
          shouldClose = true;
          closeReason = 'Take profit';
          setNotification({
            type: 'success',
            message: `Take profit triggered at ${currentPrice.toFixed(2)}`
          });
        }
      }
      
      // Close position if needed
      if (shouldClose) {
        await closePosition(profitAmount, closeReason);
      }
    } catch (error) {
      console.error("Error checking stop loss/take profit:", error);
    }
  }, [position, tradeSettings.stopLoss, tradeSettings.takeProfit]);

  // Fetch market prediction from the API
  const fetchMarketPrediction = useCallback(async () => {
    setIsLoading(true);
    try {
      // First check if data file exists
      const fileCheckResponse = await axios.get("http://localhost:5000/api/check-file", {
        validateStatus: (status) => status < 500,
      });
      
      // If file doesn't exist, trigger data fetch
      if (!fileCheckResponse.data.exists) {
        console.log("Stock data file not found. Fetching fresh data...");
        await axios.get("http://localhost:5000/api/fetch-data", {
          validateStatus: (status) => status < 500,
        });
      }
      
      // Then fetch prediction
      const response = await axios.get("http://localhost:5001/api/predict", {
        validateStatus: (status) => status < 500,
      });
      
      const signal = response.data.message;
      console.log("Received prediction signal:", signal);
      setMarketPrediction(signal);
      setLastSignal(signal);
      setIsLoading(false);
      return signal;
    } catch (error) {
      console.error("Error fetching market prediction:", error);
      setNotification({
        type: 'error',
        message: 'Could not fetch market prediction. Check if servers are running.'
      });
      setIsLoading(false);
      
      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);
      return null;
    }
  }, []);

  // Parse market prediction to determine trading signal
  const getTradingSignalFromPrediction = useCallback((prediction) => {
    if (!prediction) return null;
    
    console.log("Analyzing raw prediction signal:", prediction);
    
    // Direct exact match for the model output formats
    if (prediction === "📈 Uptrend (Buy)") {
      console.log("EXACT MATCH: Buy signal detected");
      return 'buy';
    } else if (prediction === "📉 Downtrend (Sell)") {
      console.log("EXACT MATCH: Sell signal detected");
      return 'sell';
    }
    
    console.log("No exact signal match detected in prediction");
    return null;
  }, []);

  // Open a new position
  const openPosition = async (type) => {
    try {
      const currentPrice = await getCurrentMarketPrice();
      const quantity = Math.floor(tradeSettings.investment / currentPrice);
      const timestamp = new Date().toLocaleString();
      
      setPosition({
        type,
        entryPrice: currentPrice,
        quantity: quantity,
        profit: 0,
        status: 'open',
        openTime: timestamp
      });
      
      // Add to trade history
      setTradeHistory(prev => [
        {
          id: Date.now(),
          type: type,
          action: 'OPEN',
          price: currentPrice,
          quantity: quantity,
          timestamp: timestamp,
          reason: 'Market signal'
        },
        ...prev
      ]);
      
      setNotification({
        type: 'info',
        message: `${type.toUpperCase()} position opened at ${currentPrice.toFixed(2)}`
      });
      
      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);
      
      // If auto trading, increment trade count
      if (isAutoTrading) {
        setTradeCount(prev => prev + 1);
      }
      
      return true;
    } catch (error) {
      console.error("Error opening position:", error);
      setNotification({
        type: 'error',
        message: 'Failed to open position'
      });
      
      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);
      return false;
    }
  };

  // Close the current position
  const closePosition = async (profit = null, reason = 'Manual close') => {
    try {
      const currentPrice = await getCurrentMarketPrice();
      let profitAmount = profit;
      const timestamp = new Date().toLocaleString();
      
      if (profitAmount === null) {
        if (position.type === 'buy') {
          profitAmount = position.quantity * (currentPrice - position.entryPrice);
        } else {
          profitAmount = position.quantity * (position.entryPrice - currentPrice);
        }
      }
      
      // Add to trade history
      setTradeHistory(prev => [
        {
          id: Date.now(),
          type: position.type,
          action: 'CLOSE',
          price: currentPrice,
          quantity: position.quantity,
          profit: profitAmount,
          timestamp: timestamp,
          reason: reason
        },
        ...prev
      ]);
      
      setPosition(prev => ({
        ...prev,
        status: 'closed',
        profit: profitAmount,
        closeTime: timestamp
      }));
      
      setNotification({
        type: profitAmount >= 0 ? 'success' : 'error',
        message: `Position closed with ${profitAmount >= 0 ? 'profit' : 'loss'}: $${Math.abs(profitAmount).toFixed(2)}`
      });
      
      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);
      return true;
    } catch (error) {
      console.error("Error closing position:", error);
      setNotification({
        type: 'error',
        message: 'Failed to close position'
      });
      
      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);
      return false;
    }
  };

  // Handle manual trading
  const handleTrade = async (type) => {
    if (position.status === 'closed') {
      // Open a new position
      await openPosition(type);
    } else {
      // Close the current position
      await closePosition();
    }
  };

  // Auto trading core logic - improved to strictly follow the model signal and ensure continuous trading
  const executeAutoTrade = useCallback(async () => {
    console.log("==== AUTO TRADE EXECUTION ====");
    console.log("Current raw market prediction:", marketPrediction);
    console.log("Current position status:", position.status);
    
    // If reached max trades, stop auto trading
    if (tradeCount >= tradeSettings.maxTrades) {
      console.log(`Reached maximum trades (${tradeCount}/${tradeSettings.maxTrades}), stopping auto trading`);
      setIsAutoTrading(false);
      setNotification({
        type: 'info',
        message: `Auto trading stopped: Reached maximum ${tradeSettings.maxTrades} trades`
      });
      
      setTimeout(() => setNotification(null), 3000);
      return;
    }
    
    // If we don't have a prediction, fetch one
    if (!marketPrediction) {
      console.log("No market prediction available, fetching new prediction...");
      const prediction = await fetchMarketPrediction();
      if (!prediction) {
        console.log("Failed to fetch market prediction");
        return;
      }
    }
    
    // Get the trading signal directly from the model prediction
    const signal = getTradingSignalFromPrediction(marketPrediction);
    console.log("Trading signal from model prediction:", signal);
    
    if (!signal) {
      console.log("No valid signal detected in model prediction");
      return;
    }
    
    // Handle open positions based on signal changes
    if (position.status === 'open') {
      // If signal contradicts current position, close it
      if ((position.type === 'buy' && signal === 'sell') || 
          (position.type === 'sell' && signal === 'buy')) {
        console.log(`SIGNAL CHANGE DETECTED: Closing ${position.type.toUpperCase()} position due to ${signal.toUpperCase()} signal`);
        await closePosition(null, `Signal changed to ${signal[0].toUpperCase() + signal.slice(1)}`);
        
        // After closing, open a new position with new signal immediately
        console.log(`Opening new ${signal.toUpperCase()} position immediately after closing`);
        await openPosition(signal);
      } else {
        // If signal hasn't changed, just check stop loss/take profit
        console.log(`Signal matches current position (${position.type}), checking stop loss/take profit...`);
        await checkStopLossAndTakeProfit();
      }
    } else {
      // No open position, open a new one based on the signal
      console.log(`Opening new ${signal.toUpperCase()} position based on model signal`);
      await openPosition(signal);
    }
  }, [
    position.status,
    position.type,
    tradeCount,
    tradeSettings.maxTrades,
    marketPrediction,
    getTradingSignalFromPrediction,
    checkStopLossAndTakeProfit,
    openPosition,
    closePosition,
    fetchMarketPrediction
  ]);

  // Toggle auto trading on/off with enhanced continuous trading
  const toggleAutoTrading = () => {
    const newAutoTradingState = !isAutoTrading;
    setIsAutoTrading(newAutoTradingState);
    
    if (newAutoTradingState) {
      console.log("==== STARTING AUTO TRADING MODE ====");
      setTradeCount(0);
      
      // Refresh market prediction to get latest signal
      fetchMarketPrediction().then(prediction => {
        console.log("Fresh market prediction received:", prediction);
        
        // Close any open positions before starting auto trading
        if (position.status === 'open') {
          console.log("Closing existing position before starting auto trading");
          closePosition(null, 'Auto trading started').then(() => {
            // After closing position, immediately check for a new trade opportunity
            const signal = getTradingSignalFromPrediction(prediction);
            if (signal) {
              console.log("Executing immediate", signal, "signal from model");
              openPosition(signal);
            } else {
              console.log("No valid signal detected in model prediction");
            }
          });
        } else {
          // No open position, immediately execute a trade if we have a signal
          const signal = getTradingSignalFromPrediction(prediction);
          if (signal) {
            console.log("Executing immediate", signal, "signal from model");
            openPosition(signal);
          } else {
            console.log("No valid signal detected in model prediction");
          }
        }
      });
      
      setNotification({
        type: 'info',
        message: 'Auto trading started - continuously following model signals'
      });
    } else {
      console.log("==== STOPPING AUTO TRADING MODE ====");
      setNotification({
        type: 'info',
        message: 'Auto trading stopped'
      });
    }
    
    setTimeout(() => setNotification(null), 3000);
  };

  // Handle auto trading with useEffect - improved for continuous trading
  useEffect(() => {
    if (isAutoTrading) {
      console.log("Auto trading mode is active, setting up continuous monitoring");
      
      // Immediately execute auto trade when auto trading is turned on
      executeAutoTrade();
      
      // Set interval to regularly check for trading opportunities and monitor positions
      const interval = setInterval(() => {
        console.log("Auto trading cycle - Current prediction:", marketPrediction);
        
        // Always attempt to execute auto trade based on current signal
        executeAutoTrade();
      }, 5000); // Check more frequently (every 5 seconds) for more active trading
      
      setAutoTradeInterval(interval);
      
      return () => {
        console.log("Cleaning up auto trading interval");
        clearInterval(interval);
      };
    } else if (autoTradeInterval) {
      console.log("Auto trading disabled, clearing interval");
      clearInterval(autoTradeInterval);
      setAutoTradeInterval(null);
    }
  }, [
    isAutoTrading, 
    executeAutoTrade,
    autoTradeInterval,
    marketPrediction
  ]);

  // Fetch market prediction more frequently for active trading
  useEffect(() => {
    console.log("Setting up prediction monitoring");
    
    // Initial fetch
    fetchMarketPrediction();
    
    // Set up regular refreshes of the market prediction
    const predictionInterval = setInterval(() => {
      if (isAutoTrading) {
        console.log("Fetching fresh market prediction for auto trading...");
        fetchMarketPrediction();
      }
    }, 15000); // Refresh prediction more frequently (every 15 seconds) when auto trading
    
    return () => {
      console.log("Cleaning up prediction interval");
      clearInterval(predictionInterval);
    };
  }, [fetchMarketPrediction, isAutoTrading]);

  // Add an effect to explicitly handle market price changes
  useEffect(() => {
    // Update market price regularly
    const priceUpdateInterval = setInterval(() => {
      getCurrentMarketPrice();
    }, 3000); // More frequent price updates
    
    return () => clearInterval(priceUpdateInterval);
  }, []);

  // Calculate current profit/loss for display
  const calculateCurrentProfitLoss = () => {
    if (position.status !== 'open' || !position.entryPrice) return null;
    
    let profitLoss = 0;
    if (position.type === 'buy') {
      profitLoss = position.quantity * (marketPrice - position.entryPrice);
    } else {
      profitLoss = position.quantity * (position.entryPrice - marketPrice);
    }
    
    return profitLoss;
  };

  const currentProfitLoss = calculateCurrentProfitLoss();

  return (
    <div className="bg-gray-800 rounded-xl p-8 mb-8">
      {notification && (
        <div className={`mb-4 p-3 rounded-lg text-white font-medium flex items-center justify-between ${
          notification.type === 'success' ? 'bg-green-600' :
          notification.type === 'error' ? 'bg-red-600' :
          'bg-blue-600'
        }`}>
          <p>{notification.message}</p>
          <button 
            onClick={() => setNotification(null)}
            className="text-white ml-2"
          >
            ✕
          </button>
        </div>
      )}
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Trading Controls */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">Trading Controls</h3>
          
          {/* Market Prediction */}
          <div className="mb-6 bg-gray-700 rounded-xl p-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-white font-semibold">Market Prediction</h4>
              <button 
                onClick={fetchMarketPrediction}
                disabled={isLoading || isAutoTrading}
                className="p-2 bg-gray-600 hover:bg-gray-500 disabled:opacity-50 rounded-lg text-white flex items-center"
              >
                {isLoading ? 
                  <RefreshCw className="h-4 w-4 animate-spin" /> : 
                  <RefreshCw className="h-4 w-4" />
                }
              </button>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              {marketPrediction ? (
                <div className={`text-xl font-bold text-center ${
                  marketPrediction.includes('Buy') || marketPrediction.includes('Uptrend') 
                    ? 'text-green-400' 
                    : 'text-red-400'
                }`}>
                  {marketPrediction}
                </div>
              ) : (
                <div className="text-gray-400 flex items-center justify-center">
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                      Loading prediction...
                    </>
                  ) : (
                    'No prediction available'
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Manual Trading Buttons */}
          <div className="flex gap-4 mb-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleTrade('buy')}
              disabled={isAutoTrading}
              className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white py-4 rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              <TrendingUp className="h-5 w-5" />
              {position.status === 'open' ? 'Close Position' : 'Buy'}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleTrade('sell')}
              disabled={isAutoTrading}
              className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-600 text-white py-4 rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              <TrendingDown className="h-5 w-5" />
              {position.status === 'open' ? 'Close Position' : 'Sell'}
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
            
            {isAutoTrading && (
              <div className="mt-3 bg-blue-500/20 border border-blue-500/30 rounded-lg p-3 text-sm text-blue-300">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <span>Auto trading is active. The system will execute trades based on market signals.</span>
                </div>
              </div>
            )}
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
                disabled={isAutoTrading}
                className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:opacity-70"
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
                  disabled={isAutoTrading}
                  className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:opacity-70"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Take Profit (%)</label>
                <input
                  type="number"
                  name="takeProfit"
                  value={tradeSettings.takeProfit}
                  onChange={handleSettingsChange}
                  disabled={isAutoTrading}
                  className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:opacity-70"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="trailingStop"
                checked={tradeSettings.trailingStop}
                onChange={handleSettingsChange}
                disabled={isAutoTrading}
                className="h-4 w-4 text-emerald-500 rounded border-gray-300 focus:ring-emerald-500 disabled:opacity-70"
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
                  disabled={isAutoTrading}
                  className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:opacity-70"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Time Frame</label>
                <select
                  name="timeFrame"
                  value={tradeSettings.timeFrame}
                  onChange={handleSettingsChange}
                  disabled={isAutoTrading}
                  className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:opacity-70"
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
                  {position.entryPrice ? `$${position.entryPrice.toFixed(2)}` : '-'}
                </p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Quantity</p>
                <p className="text-xl font-semibold text-white">
                  {position.quantity || '-'}
                </p>
              </div>
            </div>
            
            {position.status === 'open' && (
              <div className="mt-4 bg-gray-800 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Current Price:</span>
                  <span className="text-white font-semibold">${marketPrice.toFixed(2)}</span>
                </div>
                {currentProfitLoss !== null && (
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-400">Unrealized P/L:</span>
                    <span className={`font-semibold ${currentProfitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      ${currentProfitLoss.toFixed(2)} ({((currentProfitLoss / (position.entryPrice * position.quantity)) * 100).toFixed(2)}%)
                    </span>
                  </div>
                )}
              </div>
            )}
            
            {isAutoTrading && (
              <div className="mt-4 bg-gray-800 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Auto Trading Status:</span>
                  <span className="text-emerald-400 font-semibold">Active</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-400">Trades Executed:</span>
                  <span className="text-white font-semibold">{tradeCount} / {tradeSettings.maxTrades}</span>
                </div>
                {lastSignal && (
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-400">Last Signal:</span>
                    <span className={`font-semibold ${lastSignal.includes('Buy') || lastSignal.includes('Uptrend') ? 'text-green-400' : 'text-red-400'}`}>
                      {lastSignal}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Trade History */}
          <div className="bg-gray-700 rounded-xl p-6 mb-6">
            <h4 className="text-white font-semibold mb-4">Trade History</h4>
            {tradeHistory.length > 0 ? (
              <div className="overflow-y-auto max-h-60">
                {tradeHistory.map((trade) => (
                  <div key={trade.id} className="border-b border-gray-600 last:border-0 py-3">
                    <div className="flex justify-between mb-1">
                      <span className={`font-semibold ${
                        trade.action === 'OPEN' 
                          ? 'text-blue-400'
                          : trade.profit >= 0 
                            ? 'text-green-400' 
                            : 'text-red-400'
                      }`}>
                        {trade.action} {trade.type.toUpperCase()}
                      </span>
                      <span className="text-gray-400 text-sm">{trade.timestamp}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">
                        Price: ${trade.price.toFixed(2)} × {trade.quantity}
                      </span>
                      {trade.action === 'CLOSE' && (
                        <span className={trade.profit >= 0 ? 'text-green-400' : 'text-red-400'}>
                          {trade.profit >= 0 ? '+' : ''}{trade.profit.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {trade.reason}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-400 text-center py-4">
                No trades have been executed yet
              </div>
            )}
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