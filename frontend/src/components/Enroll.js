import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Clock, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useStacksAuth } from '../hooks/useStacksAuth';
import { enroll as callEnroll, estimateUnlockBlockFromDate } from '../services/pensionService';

const Enroll = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useStacksAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    planId: '',
    unlockDate: '',
    beneficiary: '',
    confirmBeneficiary: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const plans = [
    { id: 1, name: 'Standard Plan', description: 'Balanced approach with moderate penalties', minPeriods: '12 months', cliff: '6 months', penalty: '5%', earlyExit: true, color: 'border-blue-500 bg-blue-50' },
    { id: 2, name: 'Conservative Plan', description: 'Long-term focus with higher penalties', minPeriods: '24 months', cliff: '12 months', penalty: '10%', earlyExit: false, color: 'border-green-500 bg-green-50' },
    { id: 3, name: 'Flexible Plan', description: 'Short-term with low penalties', minPeriods: '6 months', cliff: '3 months', penalty: '3%', earlyExit: true, color: 'border-purple-500 bg-purple-50' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateStep = () => {
    const newErrors = {};
    if (step === 1 && !formData.planId) newErrors.planId = 'Please select a plan';
    if (step === 2 && !formData.unlockDate) newErrors.unlockDate = 'Please select an unlock date';
    if (step === 3) {
      if (!formData.beneficiary) newErrors.beneficiary = 'Please enter beneficiary address';
      if (!formData.confirmBeneficiary) newErrors.confirmBeneficiary = 'Please confirm beneficiary address';
      if (formData.beneficiary && formData.confirmBeneficiary && formData.beneficiary !== formData.confirmBeneficiary) newErrors.confirmBeneficiary = 'Addresses do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setSubmitting(true);
    try {
      const planId = parseInt(formData.planId, 10);
      const unlockBn = estimateUnlockBlockFromDate(formData.unlockDate);
      const beneficiary = formData.beneficiary;
      await callEnroll({ planId, unlockBn, beneficiary });
      navigate('/', { state: { message: 'Enrollment submitted. Check your wallet.' } });
    } catch (error) {
      setErrors({ submit: error?.message || 'Enrollment failed. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const getUnlockDateInfo = () => {
    if (!formData.unlockDate) return null;
    const unlockDate = new Date(formData.unlockDate);
    const today = new Date();
    const diffTime = unlockDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return { type: 'error', message: 'Unlock date must be in the future' };
    if (diffDays < 30) return { type: 'warning', message: 'Short-term plan (less than 30 days)' };
    if (diffDays < 365) return { type: 'info', message: 'Medium-term plan (1-12 months)' };
    return { type: 'success', message: 'Long-term plan (1+ years)' };
  };

  if (!isSignedIn) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <Shield className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Connect Wallet First</h2>
        <p className="text-gray-600">Please connect your wallet to enroll in a pension plan.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                stepNumber < step 
                  ? 'bg-blue-600 text-white' 
                  : stepNumber === step 
                    ? 'bg-blue-100 text-blue-600 border-2 border-blue-600'
                    : 'bg-gray-200 text-gray-500'
              }`}>
                {stepNumber < step ? <CheckCircle className="w-5 h-5" /> : stepNumber}
              </div>
              {stepNumber < 4 && (
                <div className={`w-16 h-1 mx-2 ${
                  stepNumber < step ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>Choose Plan</span>
          <span>Set Date</span>
          <span>Beneficiary</span>
          <span>Confirm</span>
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Choose Your Pension Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    formData.planId === plan.id 
                      ? `${plan.color} border-current` 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, planId: plan.id }))}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                    {formData.planId === plan.id && (
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Min Period:</span>
                      <span className="font-medium">{plan.minPeriods}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cliff:</span>
                      <span className="font-medium">{plan.cliff}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Penalty:</span>
                      <span className="font-medium">{plan.penalty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Early Exit:</span>
                      <span className="font-medium">{plan.earlyExit ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {errors.planId && (
              <p className="text-red-600 text-sm mt-2">{errors.planId}</p>
            )}
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Set Your Unlock Date</h2>
            <div className="max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                When do you want to unlock your pension?
              </label>
              <input
                type="date"
                name="unlockDate"
                value={formData.unlockDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {formData.unlockDate && (
                <div className="mt-4 p-3 rounded-md bg-gray-50">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">
                      {getUnlockDateInfo()?.message}
                    </span>
                  </div>
                </div>
              )}
              {errors.unlockDate && (
                <p className="text-red-600 text-sm mt-2">{errors.unlockDate}</p>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Set Your Beneficiary</h2>
            <div className="max-w-md space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Beneficiary Address (STX)
                </label>
                <input
                  type="text"
                  name="beneficiary"
                  value={formData.beneficiary}
                  onChange={handleInputChange}
                  placeholder="ST1..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.beneficiary && (
                  <p className="text-red-600 text-sm mt-2">{errors.beneficiary}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Beneficiary Address
                </label>
                <input
                  type="text"
                  name="confirmBeneficiary"
                  value={formData.confirmBeneficiary}
                  onChange={handleInputChange}
                  placeholder="ST1..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.confirmBeneficiary && (
                  <p className="text-red-600 text-sm mt-2">{errors.confirmBeneficiary}</p>
                )}
              </div>
              <div className="p-3 rounded-md bg-blue-50 border border-blue-200">
                <div className="flex items-start">
                  <AlertCircle className="w-4 h-4 text-blue-600 mr-2 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Important:</p>
                    <p>Your beneficiary can claim your pension if you become inactive for an extended period.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Review & Confirm</h2>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Enrollment Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Selected Plan:</span>
                  <span className="font-medium">
                    {plans.find(p => p.id === parseInt(formData.planId))?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Unlock Date:</span>
                  <span className="font-medium">{formData.unlockDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Beneficiary:</span>
                  <span className="font-medium font-mono text-xs">
                    {formData.beneficiary.slice(0, 8)}...{formData.beneficiary.slice(-6)}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-3 rounded-md bg-yellow-50 border border-yellow-200">
              <div className="flex items-start">
                <AlertCircle className="w-4 h-4 text-yellow-600 mr-2 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium">Final Step:</p>
                  <p>Review your details carefully. This action cannot be undone.</p>
                </div>
              </div>
            </div>
            {errors.submit && (
              <p className="text-red-600 text-sm mt-2">{errors.submit}</p>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Back
          </button>
          
          <div className="flex space-x-3">
            {step < 4 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Submitting…' : 'Confirm Enrollment'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Enroll;
