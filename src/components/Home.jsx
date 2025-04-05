import React, { useState, useEffect } from "react";
import { Cpu, Globe, Users, Code, Shield, Zap } from "lucide-react";
import TradingViewTicker from "./TradingViewTicker";
import LoadingWave from "./LoadingWave";

const Home = ({ forwardedRef }) => {
  const [showPopup, setShowPopup] = useState(false);

  const features = [
    {
      icon: <Cpu className="h-8 w-8 text-emerald-400" />,
      title: "AI-Powered Trading",
      description:
        "Advanced algorithms that adapt to market conditions in real-time",
    },
    {
      icon: <Globe className="h-8 w-8 text-emerald-400" />,
      title: "Global Markets",
      description: "Trade across multiple markets and asset classes 24/7",
    },
    {
      icon: <Users className="h-8 w-8 text-emerald-400" />,
      title: "Community Driven",
      description: "Join a community of algorithmic traders and developers",
    },
    {
      icon: <Code className="h-8 w-8 text-emerald-400" />,
      title: "Developer Friendly",
      description: "Robust APIs and SDKs for custom strategy development",
    },
    {
      icon: <Shield className="h-8 w-8 text-emerald-400" />,
      title: "Enterprise Security",
      description: "Bank-grade security and compliance measures",
    },
    {
      icon: <Zap className="h-8 w-8 text-emerald-400" />,
      title: "Lightning Fast",
      description: "Ultra-low latency execution and real-time data",
    },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-gray-900" ref={forwardedRef}>
      {/* TradingView Ticker positioned below navbar */}
      <div className="w-full fixed top-16 z-40 bg-gray-900">
        <TradingViewTicker />
      </div>

      {/* Main content with padding to account for fixed navbar and ticker */}
      <div className="pt-32 pb-12 mt-10">
        <div className="container mx-auto px-6">
          {/* Added the heading section back */}
          <div className="flex flex-col items-center justify-center text-center h-96 mb-10">
            <h1 className="text-5xl font-bold text-white mb-6">
              The Future of{" "}
              <span className="text-emerald-400">Algorithmic Trading</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Empowering traders with cutting-edge technology, comprehensive
              research, and powerful tools to succeed in today's markets.
            </p>
            <div className="flex justify-center items-center h-screen">
              <LoadingWave />
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 ">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800 p-8 rounded-xl hover:bg-gray-750 transition-all"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Rest of your existing content... */}
        </div>
      </div>
    </div>
  );
};

export default React.forwardRef((props, ref) => (
  <Home forwardedRef={ref} {...props} />
));
