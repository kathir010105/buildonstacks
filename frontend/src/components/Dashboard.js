import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Clock, 
  Target, 
  DollarSign, 
  Shield, 
  Activity,
  Plus,
  Download,
  Heart
} from 'lucide-react';
import { useStacksAuth } from '../hooks/useStacksAuth';

const Dashboard = () => {
  const { isSignedIn, userData } = useStacksAuth();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [pensionData, setPensionData] = useState({
    planName: 'Standard Plan',
    contributed: 0,
    claimable: 0,
    unlockDate: '2024-12-31',
    progress: 0,
    lastPing: '2024-01-15'
  });

  useEffect(() => {
    if (isSignedIn) {
      setPensionData({
        planName: 'Standard Plan',
        contributed: 2500000,
        claimable: 2500000,
        unlockDate: '2024-12-31',
        progress: 65,
        lastPing: '2024-01-15'
      });
      setIsEnrolled(true);
    }
  }, [isSignedIn]);

  const quickActions = [
    { name: 'Contribute', description: 'Add to your pension', icon: Plus, href: '/contribute', color: 'bg-blue-500 hover:bg-blue-600' },
    { name: 'Proof of Life', description: 'Keep account active', icon: Heart, href: '#', color: 'bg-green-500 hover:bg-green-600' },
    { name: 'Claim', description: 'Withdraw funds', icon: Download, href: '/claim', color: 'bg-purple-500 hover:bg-purple-600' }
  ];

  const stats = [
    { name: 'Total Contributed', value: `${(pensionData.contributed / 1000000).toFixed(2)} STX`, icon: DollarSign, color: 'text-blue-600' },
    { name: 'Claimable Amount', value: `${(pensionData.claimable / 1000000).toFixed(2)} STX`, icon: Target, color: 'text-green-600' },
    { name: 'Unlock Date', value: pensionData.unlockDate, icon: Clock, color: 'text-purple-600' },
    { name: 'Last Activity', value: pensionData.lastPing, icon: Activity, color: 'text-orange-600' }
  ];

  if (!isSignedIn) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <Shield className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Micro-Pension</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Connect your wallet to start building your secure, time-locked pension on Bitcoin.
        </p>
        <div className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
          <Shield className="w-5 h-5 mr-2" />
          Connect Wallet to Continue
        </div>
      </div>
    );
  }

  if (!isEnrolled) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
          <Target className="w-12 h-12 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Your Pension?</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Enroll in a pension plan and start contributing to secure your financial future.
        </p>
        <Link
          to="/enroll"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Enroll Now
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {userData?.profile?.name || 'User'}!
            </h1>
            <p className="text-gray-600 mt-1">
              Your pension is growing steadily. Keep up the great work!
            </p>
          </div>
          <div className="hidden sm:block">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <TrendingUp className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Pension Progress</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Progress to Goal</span>
            <span className="text-sm font-medium text-gray-900">{pensionData.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${pensionData.progress}%` }}
            ></div>
          </div>
          <div className="text-sm text-gray-600">
            You're {pensionData.progress}% of the way to your pension goal. Keep contributing!
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg bg-gray-50 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              to={action.href}
              className="group relative bg-gray-50 p-6 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${action.color} text-white`}>
                  <action.icon className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                    {action.name}
                  </h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Pension Plan</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-700">Plan Type</span>
            <span className="text-sm text-gray-900">{pensionData.planName}</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-700">Early Exit Allowed</span>
            <span className="text-sm text-gray-900">Yes (5% penalty)</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-sm font-medium text-gray-700">Beneficiary</span>
            <span className="text-sm text-gray-900">Set</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
