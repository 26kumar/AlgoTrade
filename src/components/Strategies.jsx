import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Cpu, TrendingUp, Clock, DollarSign } from 'lucide-react';

const strategies = [
  {
    name: "Momentum Trading",
    icon: <TrendingUp className="h-6 w-6 text-emerald-400" />,
    description: "Capitalize on market trends and price momentum",
    parameters: ["RSI", "Moving Averages", "Volume", "Price Action"],
    bestFor: "Trending Markets",
    winRate: "78%"
  },
  {
    name: "Mean Reversion",
    icon: <LineChart className="h-6 w-6 text-emerald-400" />,
    description: "Profit from price corrections and market equilibrium",
    parameters: ["Bollinger Bands", "Standard Deviation", "Historical Volatility"],
    bestFor: "Range-bound Markets",
    winRate: "82%"
  },
  {
    name: "High-Frequency",
    icon: <Clock className="h-6 w-6 text-emerald-400" />,
    description: "Ultra-fast execution for micro price movements",
    parameters: ["Tick Data", "Order Book Depth", "Latency", "Spread"],
    bestFor: "All Market Conditions",
    winRate: "65%"
  },
  {
    name: "Machine Learning",
    icon: <Cpu className="h-6 w-6 text-emerald-400" />,
    description: "AI-powered pattern recognition and prediction",
    parameters: ["Historical Data", "Market Indicators", "Sentiment Analysis"],
    bestFor: "Complex Market Patterns",
    winRate: "75%"
  },
  {
    name: "Statistical Arbitrage",
    icon: <DollarSign className="h-6 w-6 text-emerald-400" />,
    description: "Exploit price differences across markets",
    parameters: ["Correlation", "Price Disparity", "Trading Pairs"],
    bestFor: "Multiple Markets",
    winRate: "85%"
  }
];

const Strategies = React.forwardRef((props, ref) => {
  const navigate = useNavigate();

  const handleStrategyClick = (strategyName) => {
    navigate(`/strategy/${strategyName.toLowerCase().replace(/\s+/g, '-')}`);
    window.scrollTo(0, 0);
  };

  return (
    <section 
      ref={ref}
      id="strategies" 
      className="bg-gray-900 py-16 scroll-mt-16"
    >
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-white mb-12 text-center">
          Trading Strategies
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {strategies.map((strategy, index) => (
            <button
              key={index}
              onClick={() => handleStrategyClick(strategy.name)}
              className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-all text-left w-full"
            >
              <div className="flex items-center mb-4">
                {strategy.icon}
                <h3 className="text-xl font-semibold text-white ml-3">{strategy.name}</h3>
              </div>
              
              <p className="text-gray-400 mb-4">{strategy.description}</p>
              
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-semibold text-emerald-400 mb-1">Parameters</h4>
                  <div className="flex flex-wrap gap-2">
                    {strategy.parameters.map((param, i) => (
                      <span key={i} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                        {param}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <div>
                    <span className="text-gray-400">Best For: </span>
                    <span className="text-white">{strategy.bestFor}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Win Rate: </span>
                    <span className="text-emerald-400">{strategy.winRate}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
});

export default Strategies;