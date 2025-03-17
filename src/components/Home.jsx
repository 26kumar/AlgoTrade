// import React, { useState, useEffect } from 'react';
// import { Cpu, Globe, Users, Code, Shield, Zap, X } from 'lucide-react';

// const Home = () => {
//   const [showPopup, setShowPopup] = useState(false);

//   const features = [
//     { icon: <Cpu className="h-8 w-8 text-emerald-400" />, title: "AI-Powered Trading", description: "Advanced algorithms that adapt to market conditions in real-time" },
//     { icon: <Globe className="h-8 w-8 text-emerald-400" />, title: "Global Markets", description: "Trade across multiple markets and asset classes 24/7" },
//     { icon: <Users className="h-8 w-8 text-emerald-400" />, title: "Community Driven", description: "Join a community of algorithmic traders and developers" },
//     { icon: <Code className="h-8 w-8 text-emerald-400" />, title: "Developer Friendly", description: "Robust APIs and SDKs for custom strategy development" },
//     { icon: <Shield className="h-8 w-8 text-emerald-400" />, title: "Enterprise Security", description: "Bank-grade security and compliance measures" },
//     { icon: <Zap className="h-8 w-8 text-emerald-400" />, title: "Lightning Fast", description: "Ultra-low latency execution and real-time data" }
//   ];

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   return (
//     <div className="bg-gray-900 py-20">
//       <div className="container mx-auto px-6">
//         <div className="text-center mb-16">
//           <h1 className="text-5xl font-bold text-white mb-6">
//             The Future of <span className="text-emerald-400">Algorithmic Trading</span>
//           </h1>
//           <p className="text-xl text-gray-400 max-w-3xl mx-auto">
//             Empowering traders with cutting-edge technology, comprehensive research, and powerful tools to succeed in today's markets.
//           </p>
//         </div>

//         {/* Features Grid */}
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
//           {features.map((feature, index) => (
//             <div key={index} className="bg-gray-800 p-8 rounded-xl hover:bg-gray-750 transition-all">
//               <div className="mb-4">{feature.icon}</div>
//               <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
//               <p className="text-gray-400">{feature.description}</p>
//             </div>
//           ))}
//         </div>

//         {/* Our Mission Section */}
//         <div className="bg-gray-800 rounded-2xl p-8 md:p-12">
//           <div className="grid md:grid-cols-2 gap-12 items-center">
//             <div>
//               <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
//               <p className="text-gray-400 mb-6">
//                 We're on a mission to democratize algorithmic trading by providing institutional-grade tools and infrastructure to traders of all sizes.Our platform combines cutting-edge technology with intuitive design to make algorithmic trading accessible to everyone.
//               </p>
//               <button
//                 className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold"
//                 onClick={() => setShowPopup(true)}
//               >
//                 Learn More
//               </button>
//             </div>
//             <div className="relative">
//               <img 
//                 src="https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&q=80&w=800"
//                 alt="Trading Dashboard"
//                 className="rounded-xl shadow-2xl"
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Popup Modal */}
//       {showPopup && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="bg-gray-800 p-8 rounded-xl shadow-lg max-w-lg w-full">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-2xl font-bold text-white">Our Mission</h3>
//               <button onClick={() => setShowPopup(false)}>
//                 <X className="h-6 w-6 text-gray-400 hover:text-gray-200" />
//               </button>
//             </div>
//             <p className="text-gray-400 mb-4">
//               Our goal is to revolutionize algorithmic trading by making it accessible to traders of all experience levels. 
//               We provide advanced AI-driven tools, high-performance infrastructure, and a supportive community to help you succeed.
//             </p>
//             <p className="text-gray-400 mb-4">
//               By leveraging cutting-edge technology, we aim to level the playing field and offer traders the same capabilities that were once reserved for institutions.
//             </p>
//             <p className="text-gray-400 mb-6">
//               Join us in transforming the world of trading with smart automation, robust security, and seamless market access.
//             </p>
//             <button
//               className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold w-full"
//               onClick={() => setShowPopup(false)}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Home;


// import React, { useState, useEffect } from 'react';
// import { Cpu, Globe, Users, Code, Shield, Zap } from 'lucide-react';

// const Home = () => {
//   const [showPopup, setShowPopup] = useState(false);

//   const features = [
//     { icon: <Cpu className="h-8 w-8 text-emerald-400" />, title: "AI-Powered Trading", description: "Advanced algorithms that adapt to market conditions in real-time" },
//     { icon: <Globe className="h-8 w-8 text-emerald-400" />, title: "Global Markets", description: "Trade across multiple markets and asset classes 24/7" },
//     { icon: <Users className="h-8 w-8 text-emerald-400" />, title: "Community Driven", description: "Join a community of algorithmic traders and developers" },
//     { icon: <Code className="h-8 w-8 text-emerald-400" />, title: "Developer Friendly", description: "Robust APIs and SDKs for custom strategy development" },
//     { icon: <Shield className="h-8 w-8 text-emerald-400" />, title: "Enterprise Security", description: "Bank-grade security and compliance measures" },
//     { icon: <Zap className="h-8 w-8 text-emerald-400" />, title: "Lightning Fast", description: "Ultra-low latency execution and real-time data" }
//   ];

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   return (
//     <div className="bg-gray-900 py-20">
//       <div className="container mx-auto px-6">
//         <div className="text-center mb-16">
//           <h1 className="text-5xl font-bold text-white mb-6">
//             The Future of <span className="text-emerald-400">Algorithmic Trading</span>
//           </h1>
//           <p className="text-xl text-gray-400 max-w-3xl mx-auto">
//             Empowering traders with cutting-edge technology, comprehensive research, and powerful tools to succeed in today's markets.
//           </p>
//         </div>

//         {/* Features Grid */}
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
//           {features.map((feature, index) => (
//             <div key={index} className="bg-gray-800 p-8 rounded-xl hover:bg-gray-750 transition-all">
//               <div className="mb-4">{feature.icon}</div>
//               <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
//               <p className="text-gray-400">{feature.description}</p>
//             </div>
//           ))}
//         </div>

//         {/* Our Mission Section */}
//         <div className="bg-gray-800 rounded-2xl p-8 md:p-12">
//           <div className="grid md:grid-cols-2 gap-12 items-center">
//             <div>
//               <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
//               <p className="text-gray-400 mb-6">
//                 We're on a mission to democratize algorithmic trading by providing institutional-grade tools and infrastructure to traders of all sizes. Our platform combines cutting-edge technology with intuitive design to make algorithmic trading accessible to everyone.
//               </p>
//               <button
//                 className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold"
//                 onClick={() => setShowPopup(true)}
//               >
//                 Learn More
//               </button>
//             </div>
//             <div className="relative">
//               <img 
//                 src="https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&q=80&w=800"
//                 alt="Trading Dashboard"
//                 className="rounded-xl shadow-2xl"
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Popup Modal */}
//       {showPopup && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="bg-gray-800 p-10 rounded-xl shadow-lg max-w-lg w-full flex flex-col items-center text-center">
//             <h3 className="text-3xl font-bold text-white mb-6">Our Mission</h3>
//             <p className="text-gray-400 mb-4">
//               Our goal is to revolutionize algorithmic trading by making it accessible to traders of all experience levels. 
//               We provide advanced AI-driven tools, high-performance infrastructure, and a supportive community to help you succeed.
//             </p>
//             <p className="text-gray-400 mb-4">
//               By leveraging cutting-edge technology, we aim to level the playing field and offer traders the same capabilities that were once reserved for institutions.
//             </p>
//             <p className="text-gray-400 mb-6">
//               Join us in transforming the world of trading with smart automation, robust security, and seamless market access.
//             </p>
//             <button
//               className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold w-full"
//               onClick={() => setShowPopup(false)}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Home;


import React, { useState, useEffect } from 'react';
import { Cpu, Globe, Users, Code, Shield, Zap } from 'lucide-react';

const Home = () => {
  const [showPopup, setShowPopup] = useState(false);

  const features = [
    { icon: <Cpu className="h-8 w-8 text-emerald-400" />, title: "AI-Powered Trading", description: "Advanced algorithms that adapt to market conditions in real-time" },
    { icon: <Globe className="h-8 w-8 text-emerald-400" />, title: "Global Markets", description: "Trade across multiple markets and asset classes 24/7" },
    { icon: <Users className="h-8 w-8 text-emerald-400" />, title: "Community Driven", description: "Join a community of algorithmic traders and developers" },
    { icon: <Code className="h-8 w-8 text-emerald-400" />, title: "Developer Friendly", description: "Robust APIs and SDKs for custom strategy development" },
    { icon: <Shield className="h-8 w-8 text-emerald-400" />, title: "Enterprise Security", description: "Bank-grade security and compliance measures" },
    { icon: <Zap className="h-8 w-8 text-emerald-400" />, title: "Lightning Fast", description: "Ultra-low latency execution and real-time data" }
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-800 p-8 rounded-xl hover:bg-gray-750 transition-all">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Our Mission Section */}
        <div className="bg-gray-800 rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
              <p className="text-gray-400 mb-6">
                We're on a mission to democratize algorithmic trading by providing institutional-grade tools and infrastructure to traders of all sizes. Our platform combines cutting-edge technology with intuitive design to make algorithmic trading accessible to everyone.
              </p>
              <button
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold"
                onClick={() => setShowPopup(true)}
              >
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

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 animate-fade-in">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-10 rounded-2xl shadow-xl max-w-lg w-full flex flex-col items-center text-center">
            <h3 className="text-3xl font-bold text-white mb-6">Our Mission</h3>
            <p className="text-gray-300 mb-4">
              Our goal is to revolutionize algorithmic trading by making it accessible to traders of all experience levels. 
              We provide advanced AI-driven tools, high-performance infrastructure, and a supportive community to help you succeed.
            </p>
            <p className="text-gray-300 mb-4">
              By leveraging cutting-edge technology, we aim to level the playing field and offer traders the same capabilities that were once reserved for institutions.
            </p>
            <p className="text-gray-300 mb-6">
              Join us in transforming the world of trading with smart automation, robust security, and seamless market access.
            </p>
            <button
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold w-full"
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
