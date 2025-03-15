import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FileCheck,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  Activity,
  BarChart2,
  Clock,
  Shield,
} from "lucide-react";

const ApiRes = () => {
  const [message, setMessage] = useState("Checking file status...");
  const [stockPrediction, setStockPrediction] = useState("Loading...");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch from Node.js API (server.js)
      const fileStatus = await axios.get(
        "http://localhost:5000/api/check-file"
      );
      setMessage(fileStatus.data.message);

      // Fetch from Flask API (server.py)
      const prediction = await axios.get("http://127.0.0.1:5001/api/predict");
      setStockPrediction(prediction.data.message);
    } catch (error) {
      setError("Failed to fetch data. Please try again.");
      console.error("API Fetch Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const metrics = [
    {
      icon: <Activity className="h-8 w-8 text-emerald-400" />,
      label: "API Status",
      value: "Operational",
      subValue: "99.99% uptime",
    },
    {
      icon: <Clock className="h-8 w-8 text-emerald-400" />,
      label: "Response Time",
      value: "124ms",
      subValue: "Avg. last 24h",
    },
    {
      icon: <BarChart2 className="h-8 w-8 text-emerald-400" />,
      label: "Success Rate",
      value: "99.9%",
      subValue: "Last 30 days",
    },
    {
      icon: <Shield className="h-8 w-8 text-emerald-400" />,
      label: "Security Status",
      value: "Protected",
      subValue: "SSL/TLS Enabled",
    },
  ];

  return (
    <div className="bg-gray-900 py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">
            Strategy Status
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Real-time monitoring of our trading infrastructure and API endpoints
          </p>
        </div>
        <h3 className="text-white font-bold text-center">
          Stock Price with Real-time Buy/Sell Signals
        </h3>
        <img
          className="w-full max-w-3xl rounded-2xl mx-auto mt-2 mb-10 p-2 shadow-lg border border-gray-300"
          src="/public/momentum_average_crossover.png"
          alt="Model Output Image"
        />

        {/* Main Status Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-gray-800 rounded-xl p-8 hover:bg-gray-750 transition-all">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <FileCheck className="h-10 w-10 text-emerald-400 mr-4" />
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    API Data Status
                  </h3>
                  <p className="text-gray-400">
                    Trading system files and configurations
                  </p>
                </div>
              </div>
              <button
                onClick={fetchData}
                className="p-3 hover:bg-gray-700 rounded-full transition-colors"
                title="Refresh status"
              >
                <RefreshCw className="h-6 w-6 text-emerald-400" />
              </button>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-6">
              <p className="text-lg text-gray-300">
                {isLoading ? (
                  <span className="flex items-center">
                    <RefreshCw className="h-5 w-5 animate-spin mr-3" />
                    Checking status...
                  </span>
                ) : (
                  message
                )}
              </p>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-8 hover:bg-gray-750 transition-all">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <TrendingUp className="h-10 w-10 text-emerald-400 mr-4" />
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    Market Prediction
                  </h3>
                  <p className="text-gray-400">AI-powered market analysis</p>
                </div>
              </div>
              <button
                onClick={fetchData}
                className="p-3 hover:bg-gray-700 rounded-full transition-colors"
                title="Refresh prediction"
              >
                <RefreshCw className="h-6 w-6 text-emerald-400" />
              </button>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-6">
              <p className="text-lg text-gray-300">
                {isLoading ? (
                  <span className="flex items-center">
                    <RefreshCw className="h-5 w-5 animate-spin mr-3" />
                    Loading prediction...
                  </span>
                ) : (
                  stockPrediction
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-16 bg-red-900/20 border border-red-500/50 rounded-xl p-6">
            <div className="flex items-center">
              <AlertCircle className="h-6 w-6 text-red-400 mr-3" />
              <p className="text-red-400 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid md:grid-cols-4 gap-8">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-gray-800 p-8 rounded-xl hover:bg-gray-750 transition-all"
            >
              <div className="mb-4">{metric.icon}</div>
              <h4 className="text-sm font-semibold text-gray-400 mb-2">
                {metric.label}
              </h4>
              <div className="text-2xl font-bold text-white mb-2">
                {metric.value}
              </div>
              <p className="text-sm text-gray-400">{metric.subValue}</p>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 bg-gray-800 rounded-xl p-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">
                System Health
              </h3>
              <p className="text-gray-400 mb-6">
                Our trading infrastructure is continuously monitored to ensure
                optimal performance and reliability. All systems are operating
                normally with industry-leading uptime.
              </p>
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                View Detailed Status
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">CPU Usage</span>
                <div className="w-2/3 bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-emerald-400 h-2 rounded-full"
                    style={{ width: "45%" }}
                  ></div>
                </div>
                <span className="text-white">45%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Memory</span>
                <div className="w-2/3 bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-emerald-400 h-2 rounded-full"
                    style={{ width: "62%" }}
                  ></div>
                </div>
                <span className="text-white">62%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Network</span>
                <div className="w-2/3 bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-emerald-400 h-2 rounded-full"
                    style={{ width: "78%" }}
                  ></div>
                </div>
                <span className="text-white">78%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiRes;
