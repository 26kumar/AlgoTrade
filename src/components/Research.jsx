import React from 'react';
import { BookOpen, Brain, BarChart as ChartBar, Download } from 'lucide-react';

const Research = () => {
  const reports = [
    {
      title: "Q1 2025 Market Analysis",
      category: "Market Analysis",
      date: "Mar 15, 2025",
      description: "Comprehensive analysis of global market trends and opportunities"
    },
    {
      title: "Machine Learning in HFT",
      category: "AI Research",
      date: "Mar 10, 2025",
      description: "Latest developments in ML applications for high-frequency trading"
    },
    {
      title: "Crypto Market Dynamics",
      category: "Market Analysis",
      date: "Mar 5, 2025",
      description: "Deep dive into cryptocurrency market microstructure"
    },
    {
      title: "Alternative Data in Trading",
      category: "Quantitative Research",
      date: "Mar 1, 2025",
      description: "Leveraging alternative data sources for alpha generation"
    }
  ];

  return (
    <div className="bg-gray-900 py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">Research & Insights</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Stay ahead with our cutting-edge research and market analysis
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gray-800 p-8 rounded-xl">
            <Brain className="h-10 w-10 text-emerald-400 mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">AI & Machine Learning</h3>
            <p className="text-gray-400 mb-6">
              Exploring the latest applications of AI and machine learning in trading
            </p>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center">
                <ChartBar className="h-5 w-5 mr-3 text-emerald-400" />
                Predictive Analytics
              </li>
              <li className="flex items-center">
                <ChartBar className="h-5 w-5 mr-3 text-emerald-400" />
                Natural Language Processing
              </li>
              <li className="flex items-center">
                <ChartBar className="h-5 w-5 mr-3 text-emerald-400" />
                Deep Learning Models
              </li>
            </ul>
          </div>

          <div className="bg-gray-800 p-8 rounded-xl">
            <BookOpen className="h-10 w-10 text-emerald-400 mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">Market Analysis</h3>
            <p className="text-gray-400 mb-6">
              In-depth analysis of market trends and trading opportunities
            </p>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center">
                <ChartBar className="h-5 w-5 mr-3 text-emerald-400" />
                Technical Analysis
              </li>
              <li className="flex items-center">
                <ChartBar className="h-5 w-5 mr-3 text-emerald-400" />
                Market Microstructure
              </li>
              <li className="flex items-center">
                <ChartBar className="h-5 w-5 mr-3 text-emerald-400" />
                Sentiment Analysis
              </li>
            </ul>
          </div>

          <div className="bg-gray-800 p-8 rounded-xl">
            <Brain className="h-10 w-10 text-emerald-400 mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">Quantitative Research</h3>
            <p className="text-gray-400 mb-6">
              Advanced mathematical and statistical analysis of trading strategies
            </p>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center">
                <ChartBar className="h-5 w-5 mr-3 text-emerald-400" />
                Factor Analysis
              </li>
              <li className="flex items-center">
                <ChartBar className="h-5 w-5 mr-3 text-emerald-400" />
                Risk Modeling
              </li>
              <li className="flex items-center">
                <ChartBar className="h-5 w-5 mr-3 text-emerald-400" />
                Portfolio Optimization
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-white mb-8">Latest Research Reports</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {reports.map((report, index) => (
              <div key={index} className="bg-gray-900 p-6 rounded-xl">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-emerald-400 text-sm">{report.category}</span>
                    <h4 className="text-xl font-semibold text-white mt-1">{report.title}</h4>
                  </div>
                  <button className="text-emerald-400 hover:text-emerald-300">
                    <Download className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-gray-400 text-sm mb-4">{report.description}</p>
                <div className="text-gray-500 text-sm">{report.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Research;