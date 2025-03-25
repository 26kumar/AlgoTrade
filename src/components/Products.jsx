import React from 'react';
import { Code, Database, Cpu, Zap } from 'lucide-react';

const Products = React.forwardRef((props, ref) => {
  const products = [
    {
      icon: <Code className="h-12 w-12 text-emerald-400" />,
      name: "API Access",
      description: "Direct market access through our high-performance API",
      features: [
        "Real-time market data",
        "Order execution",
        "Portfolio management",
        "Strategy automation"
      ]
    },
    {
      icon: <Database className="h-12 w-12 text-emerald-400" />,
      name: "Backtesting Engine",
      description: "Test your strategies against historical market data",
      features: [
        "Multiple asset classes",
        "Custom indicators",
        "Risk analysis",
        "Performance metrics"
      ]
    },
    {
      icon: <Cpu className="h-12 w-12 text-emerald-400" />,
      name: "Strategy Builder",
      description: "Visual tool for creating and testing trading strategies",
      features: [
        "Drag-and-drop interface",
        "Custom indicators",
        "Strategy templates",
        "Real-time testing"
      ]
    },
    {
      icon: <Zap className="h-12 w-12 text-emerald-400" />,
      name: "Execution Engine",
      description: "High-performance trade execution system",
      features: [
        "Low latency",
        "Smart order routing",
        "Risk management",
        "Multiple venues"
      ]
    }
  ];

  return (
    <section 
      ref={ref}
      id="products" 
      className="bg-gray-900 py-20 scroll-mt-16"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">Products & Services</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Comprehensive suite of tools and services for algorithmic trading
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {products.map((product, index) => (
            <div key={index} className="bg-gray-800 rounded-xl p-8">
              <div className="mb-6">{product.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-4">{product.name}</h3>
              <p className="text-gray-400 mb-6">{product.description}</p>
              <ul className="space-y-3">
                {product.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-400">
                    <span className="h-2 w-2 bg-emerald-400 rounded-full mr-3"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="bg-gray-800 rounded-xl p-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Custom Solutions</h3>
              <p className="text-gray-400 mb-6">
                Need a tailored solution for your trading needs? Our team of experts can help you build and implement custom trading strategies and infrastructure.
              </p>
              <ul className="space-y-4 text-gray-400 mb-8">
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-emerald-400 rounded-full mr-3"></span>
                  Custom strategy development
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-emerald-400 rounded-full mr-3"></span>
                  Infrastructure optimization
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-emerald-400 rounded-full mr-3"></span>
                  Integration services
                </li>
              </ul>
              <button 
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Contact Sales
              </button>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800"
                alt="Technology Infrastructure"
                className="rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default Products;