import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Loader,
  DollarSign,
  Calendar,
  Shield,
  Info
} from 'lucide-react';
import { useStacksAuth } from '../hooks/useStacksAuth';
import { claim as callClaim, exitEarly as callExitEarly, proofOfLife as callProofOfLife } from '../services/pensionService';

const Claim = () => {
  const { isSignedIn } = useStacksAuth();
  const [pensionData, setPensionData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [claimType, setClaimType] = useState('regular');

  useEffect(() => {
    if (isSignedIn) {
      setPensionData({
        planName: 'Standard Plan',
        contributed: 2500000,
        claimable: 2500000,
        unlockDate: '2024-12-31',
        currentDate: '2024-01-15',
        isUnlocked: false,
        earlyExitAllowed: true,
        penaltyRate: 5,
        lastPing: '2024-01-10',
        beneficiaryWait: 7
      });
    }
  }, [isSignedIn]);

  const handleClaim = async (type) => {
    setIsLoading(true);
    setError('');
    setClaimType(type);
    try {
      if (type === 'regular') await callClaim();
      if (type === 'early') await callExitEarly();
      setIsSuccess(true);
    } catch (e) {
      setError(e?.message || 'Transaction failed. Please try again.');
    } finally {
      setIsLoading(false);
      setTimeout(() => setIsSuccess(false), 4000);
    }
  };

  const handleProofOfLife = async () => {
    setIsLoading(true);
    setError('');
    try {
      await callProofOfLife();
      setIsSuccess(true);
    } catch (e) {
      setError(e?.message || 'Proof of life failed. Please try again.');
    } finally {
      setIsLoading(false);
      setTimeout(() => setIsSuccess(false), 2500);
    }
  };

  const formatSTX = (microSTX) => (microSTX / 1000000).toFixed(2);
  const formatUSD = (microSTX) => (microSTX / 1000000 * 1.5).toFixed(2);

  const calculateEarlyExitAmount = () => {
    if (!pensionData) return { penalty: 0, payout: 0 };
    const penalty = (pensionData.claimable * pensionData.penaltyRate) / 100;
    const payout = pensionData.claimable - penalty;
    return { penalty: penalty / 1000000, payout: payout / 1000000 };
  };

  const getDaysUntilUnlock = () => {
    if (!pensionData) return 0;
    const unlockDate = new Date(pensionData.unlockDate);
    const currentDate = new Date(pensionData.currentDate);
    const diffTime = unlockDate.getTime() - currentDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getBeneficiaryEligibility = () => {
    if (!pensionData) return { eligible: false, daysLeft: 0 };
    const lastPing = new Date(pensionData.lastPing);
    const currentDate = new Date(pensionData.currentDate);
    const daysSincePing = Math.ceil((currentDate.getTime() - lastPing.getTime()) / (1000 * 60 * 60 * 24));
    const daysLeft = pensionData.beneficiaryWait - daysSincePing;
    return { eligible: daysSincePing >= pensionData.beneficiaryWait, daysLeft: Math.max(0, daysLeft) };
  };

  if (!isSignedIn) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <Download className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Connect Wallet First</h2>
        <p className="text-gray-600">Please connect your wallet to view your pension status.</p>
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

  const earlyExitAmounts = calculateEarlyExitAmount();
  const daysUntilUnlock = getDaysUntilUnlock();
  const beneficiaryStatus = getBeneficiaryEligibility();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Claim Your Pension</h1>
        <p className="text-gray-600">Withdraw your funds when ready or keep them growing</p>
      </div>

      {/* Pension Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Pension Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {formatSTX(pensionData.claimable)} STX
            </div>
            <div className="text-sm text-gray-600">Available to Claim</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatSTX(pensionData.contributed)} STX
            </div>
            <div className="text-sm text-gray-600">Total Contributed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {pensionData.planName}
            </div>
            <div className="text-sm text-gray-600">Plan Type</div>
          </div>
        </div>
      </div>

      {/* Unlock Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Unlock Status</h2>
        
        {pensionData.isUnlocked ? (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-green-800 font-medium">
                Your pension is unlocked! You can now claim your funds.
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-yellow-600 mr-2" />
                <span className="text-yellow-800">
                  Your pension unlocks on <strong>{pensionData.unlockDate}</strong>
                </span>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {daysUntilUnlock} days
              </div>
              <div className="text-sm text-gray-600">until unlock</div>
            </div>
          </div>
        )}
      </div>

      {/* Claim Options */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Claim Options</h2>
        
        {/* Regular Claim */}
        <div className="mb-6 p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-medium text-gray-900">Regular Claim</h3>
              <p className="text-sm text-gray-600">
                Withdraw your full pension after the unlock date
              </p>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-900">
                {formatSTX(pensionData.claimable)} STX
              </div>
              <div className="text-sm text-gray-500">
                ≈ ${formatUSD(pensionData.claimable)}
              </div>
            </div>
          </div>
          
          <button
            onClick={() => handleClaim('regular')}
            disabled={!pensionData.isUnlocked || isLoading}
            className="w-full py-3 px-6 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {isLoading && claimType === 'regular' ? (
              <>
                <Loader className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Download className="w-5 h-5 mr-2" />
                Claim Full Amount
              </>
            )}
          </button>
        </div>

        {/* Early Exit */}
        {pensionData.earlyExitAllowed && (
          <div className="mb-6 p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-medium text-gray-900">Early Exit</h3>
                <p className="text-sm text-gray-600">
                  Exit early with a {pensionData.penaltyRate}% penalty
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900">
                  {earlyExitAmounts.payout} STX
                </div>
                <div className="text-sm text-gray-500">
                  After {earlyExitAmounts.penalty} STX penalty
                </div>
              </div>
            </div>
            
            <button
              onClick={() => handleClaim('early')}
              disabled={isLoading}
              className="w-full py-3 px-6 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isLoading && claimType === 'early' ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Exit Early
                </>
              )}
            </button>
          </div>
        )}

        {/* Proof of Life */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-medium text-gray-900">Proof of Life</h3>
              <p className="text-sm text-gray-600">
                Keep your account active and prevent beneficiary claims
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">
                Last ping: {pensionData.lastPing}
              </div>
            </div>
          </div>
          
          <button
            onClick={handleProofOfLife}
            disabled={isLoading}
            className="w-full py-3 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Shield className="w-5 h-5 mr-2" />
                Send Proof of Life
              </>
            )}
          </button>
        </div>
      </div>

      {/* Beneficiary Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Beneficiary Status</h2>
        
        {beneficiaryStatus.eligible ? (
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-red-800">
                Your beneficiary can now claim your pension due to inactivity.
              </span>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center">
              <Info className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-blue-800">
                Your beneficiary can claim in <strong>{beneficiaryStatus.daysLeft} days</strong> if you remain inactive.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Success/Error Messages */}
      {isSuccess && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-green-800">
                {claimType === 'regular' 
                  ? 'Claim successful! Your funds have been transferred to your wallet.'
                  : claimType === 'early'
                    ? 'Early exit successful! Your funds have been transferred (minus penalty).'
                    : 'Proof of life sent successfully! Your account is now active.'
                }
              </span>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        </div>
      )}

      {/* Important Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Important Information</h2>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-start space-x-2">
            <Shield className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <span>Your pension is secured by smart contracts on the Stacks blockchain.</span>
          </div>
          <div className="flex items-start space-x-2">
            <Calendar className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <span>Regular proof of life pings help prevent beneficiary claims.</span>
          </div>
          <div className="flex items-start space-x-2">
            <DollarSign className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
            <span>Early exit penalties fund the community pool for other participants.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Claim;
