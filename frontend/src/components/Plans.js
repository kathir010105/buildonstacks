import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  Shield, 
  TrendingUp, 
  Target, 
  CheckCircle,
  AlertTriangle,
  Info,
  ArrowRight
} from 'lucide-react';

const Plans = () => {
  const plans = [
    {
      id: 1,
      name: 'Standard Plan',
      description: 'Balanced approach with moderate penalties and flexibility',
      features: [
        '12-month minimum period',
        '6-month cliff period',
        '5% early exit penalty',
        'Early exit allowed',
        'Moderate risk tolerance'
      ],
      color: 'border-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      iconColor: 'bg-blue-100',
      popular: false
    },
    {
      id: 2,
      name: 'Conservative Plan',
      description: 'Long-term focus with higher penalties for maximum security',
      features: [
        '24-month minimum period',
        '12-month cliff period',
        '10% early exit penalty',
        'No early exit allowed',
        'Low risk tolerance'
      ],
      color: 'border-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      iconColor: 'bg-green-100',
      popular: true
    },
    {
      id: 3,
      name: 'Flexible Plan',
      description: 'Short-term with low penalties for maximum flexibility',
      features: [
        '6-month minimum period',
        '3-month cliff period',
        '3% early exit penalty',
        'Early exit allowed',
        'High risk tolerance'
      ],
      color: 'border-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      iconColor: 'bg-purple-100',
      popular: false
    }
  ];

  const benefits = [
    {
      title: 'Secure & Transparent',
      description: 'All funds are secured by smart contracts on the Stacks blockchain with full transparency.',
      icon: Shield,
      color: 'text-blue-600'
    },
    {
      title: 'Time-Locked Protection',
      description: 'Your pension is protected from impulsive withdrawals until the unlock date.',
      icon: Clock,
      color: 'text-green-600'
    },
    {
      title: 'Community Funded',
      description: 'Early exit penalties contribute to a community pool that benefits all participants.',
      icon: TrendingUp,
      color: 'text-purple-600'
    },
    {
      title: 'Beneficiary Protection',
      description: 'Designate beneficiaries who can claim your pension if you become inactive.',
      icon: Target,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Pension Plan</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Select the plan that best fits your financial goals and risk tolerance. 
          All plans are secured by smart contracts on the Stacks blockchain.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative border-2 rounded-xl p-6 transition-all hover:shadow-lg ${
              plan.popular ? 'scale-105 shadow-lg' : ''
            } ${plan.color} ${plan.bgColor}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <div className={`w-16 h-16 ${plan.iconColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <Shield className={`w-8 h-8 ${plan.textColor}`} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-gray-600">{plan.description}</p>
            </div>

            <div className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <Link
              to="/enroll"
              className={`w-full py-3 px-6 ${plan.textColor} border-2 border-current rounded-lg hover:bg-white hover:shadow-md transition-all flex items-center justify-center font-medium`}
            >
              Choose Plan
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        ))}
      </div>

      {/* Benefits Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Why Choose Our Pension System?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <benefit.icon className={`w-6 h-6 ${benefit.color}`} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          How It Works
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-xl font-bold">1</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Enroll</h3>
            <p className="text-gray-600">
              Choose your plan and set your unlock date and beneficiary
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-xl font-bold">2</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Contribute</h3>
            <p className="text-gray-600">
              Add funds to your pension whenever you want
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-xl font-bold">3</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Grow</h3>
            <p className="text-gray-600">
              Your pension grows securely until the unlock date
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-xl font-bold">4</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Claim</h3>
            <p className="text-gray-600">
              Withdraw your funds after unlock or exit early with penalty
            </p>
          </div>
        </div>
      </div>

      {/* Risk & Security */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Risk & Security
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">Security Features</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Smart contract security on Stacks blockchain</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>No rehypothecation - funds never leave the contract</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Deterministic unlocks based on block height</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Beneficiary protection with proof-of-life system</span>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">Risk Considerations</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                <span>Early exit penalties reduce your payout</span>
              </li>
              <li className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                <span>Funds are locked until unlock date</span>
              </li>
              <li className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                <span>Cryptocurrency price volatility</span>
              </li>
              <li className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                <span>Smart contract risk (mitigated by audits)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-12 text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Your Pension?</h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Join thousands of users building secure financial futures with blockchain technology.
        </p>
        <Link
          to="/enroll"
          className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-lg"
        >
          Get Started Now
          <ArrowRight className="w-5 h-5 ml-2" />
        </Link>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              What happens if I need my money before the unlock date?
            </h3>
            <p className="text-gray-600">
              You can exit early with a penalty (varies by plan). The penalty goes to the community pool to benefit other participants.
            </p>
          </div>
          
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              How is my pension secured?
            </h3>
            <p className="text-gray-600">
              Your funds are secured by smart contracts on the Stacks blockchain. They cannot be accessed by anyone except you (after unlock) or your beneficiary (if inactive).
            </p>
          </div>
          
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Can I change my beneficiary?
            </h3>
            <p className="text-gray-600">
              Currently, beneficiaries cannot be changed after enrollment. This ensures security and prevents potential abuse.
            </p>
          </div>
          
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              What is proof of life?
            </h3>
            <p className="text-gray-600">
              Proof of life is a simple transaction that shows you're still active. Regular pings prevent your beneficiary from claiming your pension.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              How do I know my pension is growing?
            </h3>
            <p className="text-gray-600">
              You can view your pension balance and progress on the dashboard. All transactions are recorded on the blockchain for transparency.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plans;
