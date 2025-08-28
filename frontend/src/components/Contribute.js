import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  Target, 
  AlertCircle,
  CheckCircle,
  Loader,
  Shield
} from 'lucide-react';
import { useStacksAuth } from '../hooks/useStacksAuth';
import { contribute as callContribute } from '../services/pensionService';

const Contribute = () => {
  const { isSignedIn } = useStacksAuth();
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [pensionData, setPensionData] = useState(null);

  const quickAmounts = [
    { value: 100000, label: '0.1 STX', usd: '~$0.15' },
    { value: 500000, label: '0.5 STX', usd: '~$0.75' },
    { value: 1000000, label: '1 STX', usd: '~$1.50' },
    { value: 2500000, label: '2.5 STX', usd: '~$3.75' },
    { value: 5000000, label: '5 STX', usd: '~$7.50' },
    { value: 10000000, label: '10 STX', usd: '~$15.00' }
  ];

  useEffect(() => {
    if (isSignedIn) {
      setPensionData({
        planName: 'Standard Plan',
        contributed: 2500000,
        claimable: 2500000,
        unlockDate: '2024-12-31',
        progress: 65,
        goal: 10000000
      });
    }
  }, [isSignedIn]);

  const handleAmountSelect = (value) => {
    setAmount(value);
    setCustomAmount('');
    setError('');
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    setCustomAmount(value);
    setAmount('');
    if (value && parseFloat(value) <= 0) setError('Amount must be greater than 0');
    else setError('');
  };

  const getSelectedAmount = () => {
    if (amount) return amount;
    if (customAmount) return Math.round(parseFloat(customAmount) * 1000000);
    return 0;
  };

  const handleContribute = async () => {
    const selectedAmount = getSelectedAmount();
    if (!selectedAmount || selectedAmount <= 0) {
      setError('Please select or enter a valid amount');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await callContribute({ amountUstx: selectedAmount });
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2500);
    } catch (e) {
      setError(e?.message || 'Contribution failed. Please try again.');
    } finally {
      setIsLoading(false);
      setAmount('');
      setCustomAmount('');
    }
  };

  const formatSTX = (microSTX) => (microSTX / 1000000).toFixed(2);
  const formatUSD = (microSTX) => (microSTX / 1000000 * 1.5).toFixed(2);

  if (!isSignedIn) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <DollarSign className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Connect Wallet First</h2>
        <p className="text-gray-600">Please connect your wallet to contribute to your pension.</p>
      </div>
    );
  }

  if (!pensionData) {
    return (
      <div className="text-center py-12">
        <Loader className="w-8 h-8 text-blue-600 mx-auto animate-spin" />
        <p className="text-gray-600 mt-4">Loading pension data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contribute to Your Pension</h1>
        <p className="text-gray-600">Build your secure financial future, one contribution at a time</p>
      </div>

      {/* Pension Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Pension Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {formatSTX(pensionData.contributed)} STX
            </div>
            <div className="text-sm text-gray-600">Total Contributed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatSTX(pensionData.claimable)} STX
            </div>
            <div className="text-sm text-gray-600">Available to Claim</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {pensionData.progress}%
            </div>
            <div className="text-sm text-gray-600">Progress to Goal</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Current: {formatSTX(pensionData.contributed)} STX</span>
            <span>Goal: {formatSTX(pensionData.goal)} STX</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${pensionData.progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Contribution Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Choose Contribution Amount</h2>
        
        {/* Quick Amount Buttons */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Quick Select
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {quickAmounts.map((quickAmount) => (
              <button
                key={quickAmount.value}
                onClick={() => handleAmountSelect(quickAmount.value)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  amount === quickAmount.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="font-semibold">{quickAmount.label}</div>
                <div className="text-sm text-gray-500">{quickAmount.usd}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Amount */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Or enter custom amount
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="number"
              value={customAmount}
              onChange={handleCustomAmountChange}
              placeholder="0.00"
              step="0.01"
              min="0.01"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <span className="text-gray-500 font-medium">STX</span>
          </div>
          {customAmount && (
            <div className="mt-2 text-sm text-gray-600">
              ≈ ${formatUSD(parseFloat(customAmount || 0) * 1000000)}
            </div>
          )}
        </div>

        {/* Selected Amount Summary */}
        {getSelectedAmount() > 0 && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-blue-900">Contribution Summary</div>
                <div className="text-sm text-blue-700">
                  Amount: {formatSTX(getSelectedAmount())} STX (≈ ${formatUSD(getSelectedAmount())})
                </div>
              </div>
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* Success Message */}
        {isSuccess && (
          <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-green-800">
                Contribution successful! Your pension has been updated.
              </span>
            </div>
          </div>
        )}

        {/* Contribute Button */}
        <button
          onClick={handleContribute}
          disabled={!getSelectedAmount() || isLoading || isSuccess}
          className="w-full py-3 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader className="w-5 h-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Plus className="w-5 h-5 mr-2" />
              Contribute {getSelectedAmount() > 0 ? formatSTX(getSelectedAmount()) + ' STX' : ''}
            </>
          )}
        </button>
      </div>

      {/* Benefits & Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Why Contribute?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Secure & Time-Locked</h3>
              <p className="text-sm text-gray-600">Your funds are secured by smart contracts and can only be withdrawn after the unlock date.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <div>
            //TODO: Add a link to the build wealth page
              <h3 className="font-medium text-gray-900">Build Wealth</h3>
              <p className="text-sm text-gray-600">Regular contributions help you build a substantial pension over time.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Target className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Goal-Oriented</h3>
              <p className="text-sm text-gray-600">Track your progress toward your pension goal with visual indicators.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Flexible Timing</h3>
              <p className="text-sm text-gray-600">Contribute whenever you want - no fixed schedule required.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contribute;
