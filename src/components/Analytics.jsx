import React from 'react';
import { BarChart2, PieChart, LineChart, Activity } from 'lucide-react';

const Analytics = () => {
  return (
    <div className="bg-gray-800 py-16">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-white mb-12 text-center">
          Real-Time Analytics
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-900 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Strategy Performance</h3>
              <Activity className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
              <LineChart className="h-12 w-12 text-gray-600" />
              <span className="text-gray-500 ml-2">Performance Chart</span>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Profit Distribution</h3>
              <PieChart className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
              <BarChart2 className="h-12 w-12 text-gray-600" />
              <span className="text-gray-500 ml-2">Distribution Chart</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mt-8">
          {[
            { label: "Total Profit", value: "$24,521", change: "+12.5%" },
            { label: "Win Rate", value: "78.5%", change: "+2.3%" },
            { label: "Active Trades", value: "12", change: "−3" },
            { label: "Avg. Return", value: "8.2%", change: "+1.1%" }
          ].map((stat, index) => (
            <div key={index} className="bg-gray-900 p-6 rounded-xl">
              <h4 className="text-gray-400 text-sm mb-2">{stat.label}</h4>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-white">{stat.value}</span>
                <span className={`text-sm ${stat.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;