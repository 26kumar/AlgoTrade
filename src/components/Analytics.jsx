import React from 'react';
import { BarChart2, PieChart, LineChart, Activity } from 'lucide-react';

const Analytics = React.forwardRef((props, ref) => {
  return (
    <section 
      ref={ref}
      id="analytics" 
      className="bg-gray-800 py-16 scroll-mt-16"
    >
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-white mb-12 text-center">
          Real-Time Analytics
        </h2>


        <div className="grid md:grid-cols-4 gap-6 mt-8">
          {[
            { label: "Total Profit", value: "₹5K", change: "+12.5%" },
            { label: "Win Rate", value: "85.5%", change: "+2.3%" },
            { label: "Active Trades", value: "10", change: "+3" },
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
    </section>
  );
});

export default Analytics;