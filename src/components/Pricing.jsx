import React from 'react';
import { Check } from 'lucide-react';

const Pricing = React.forwardRef((props, ref) => {
  const plans = [
    {
      name: "Starter",
      price: "$49",
      period: "per month",
      description: "Perfect for beginners and small traders",
      features: [
        "Basic algorithmic trading tools",
        "5 active strategies",
        "Standard backtesting",
        "Email support",
        "Basic API access",
        "Community forum access"
      ]
    },
    {
      name: "Professional",
      price: "$199",
      period: "per month",
      description: "For serious traders and small firms",
      features: [
        "Advanced trading tools",
        "Unlimited strategies",
        "Advanced backtesting",
        "Priority support",
        "Full API access",
        "Strategy builder",
        "Custom indicators",
        "Risk management tools"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      description: "For institutions and large trading firms",
      features: [
        "Custom solutions",
        "Dedicated support",
        "Custom integration",
        "Advanced risk management",
        "Multiple user accounts",
        "Custom reporting",
        "SLA guarantee",
        "24/7 phone support"
      ]
    }
  ];

  return (
    <section 
      ref={ref}
      id="pricing" 
      className="bg-gray-900 py-20 scroll-mt-16"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">Pricing Plans</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Choose the perfect plan for your trading needs
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`bg-gray-800 rounded-xl p-8 flex flex-col justify-between ${
                plan.popular ? 'ring-2 ring-emerald-400' : ''
              }`}
            >
              {/* Popular Tag */}
              {plan.popular && (
                <span className="bg-emerald-400 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold self-center">
                  Most Popular
                </span>
              )}
              
              {/* Plan Details */}
              <div className="flex-grow">
                <h3 className="text-2xl font-bold text-white mt-6 mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-5xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400 ml-2">{plan.period}</span>
                </div>
                <p className="text-gray-400 mb-6">{plan.description}</p>
                <ul className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-400">
                      <Check className="h-5 w-5 text-emerald-400 mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Button (Always at the Bottom) */}
              <button 
                className={`w-full mt-8 py-3 rounded-lg font-semibold ${
                  plan.popular
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                }`}
                onClick={() => {
                  if (plan.price === "Custom") {
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    // Handle other button clicks (e.g., open signup modal)
                  }
                }}
              >
                {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default Pricing;