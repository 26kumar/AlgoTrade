import React, { useEffect } from 'react';
import { Cpu, Globe, Users, Code, Shield, Zap } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <Cpu className="h-8 w-8 text-emerald-400" />,
      title: "AI-Powered Trading",
      description: "Advanced algorithms that adapt to market conditions in real-time"
    },
    {
      icon: <Globe className="h-8 w-8 text-emerald-400" />,
      title: "Global Markets",
      description: "Trade across multiple markets and asset classes 24/7"
    },
    {
      icon: <Users className="h-8 w-8 text-emerald-400" />,
      title: "Community Driven",
      description: "Join a community of algorithmic traders and developers"
    },
    {
      icon: <Code className="h-8 w-8 text-emerald-400" />,
      title: "Developer Friendly",
      description: "Robust APIs and SDKs for custom strategy development"
    },
    {
      icon: <Shield className="h-8 w-8 text-emerald-400" />,
      title: "Enterprise Security",
      description: "Bank-grade security and compliance measures"
    },
    {
      icon: <Zap className="h-8 w-8 text-emerald-400" />,
      title: "Lightning Fast",
      description: "Ultra-low latency execution and real-time data"
    }
  ];

  useEffect(()=>{
    window.scrollTo(0,0);
  },[])

  return (
    <div className="bg-gray-900 py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">
            The Future of <span className="text-emerald-400">Algorithmic Trading</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Empowering traders with cutting-edge technology, comprehensive research, and powerful tools to succeed in today's markets.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-800 p-8 rounded-xl hover:bg-gray-750 transition-all">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-gray-800 rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
              <p className="text-gray-400 mb-6">
                We're on a mission to democratize algorithmic trading by providing institutional-grade tools and infrastructure to traders of all sizes. Our platform combines cutting-edge technology with intuitive design to make algorithmic trading accessible to everyone.
              </p>
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold">
                Learn More
              </button>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&q=80&w=800"
                alt="Trading Dashboard"
                className="rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;