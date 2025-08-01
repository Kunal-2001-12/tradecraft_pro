import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import StepIndicator from './components/StepIndicator';
import StrategyOutline from './components/StrategyOutline';
import MarketSelectionStep from './components/MarketSelectionStep';
import EntryConditionsStep from './components/EntryConditionsStep';
import ExitRulesStep from './components/ExitRulesStep';
import RiskParametersStep from './components/RiskParametersStep';
import OrderTypesStep from './components/OrderTypesStep';
import ActionButtons from './components/ActionButtons';
import StrategyPreview from './components/StrategyPreview';

const StrategyBuilder = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [isOutlineCollapsed, setIsOutlineCollapsed] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    // Market Selection
    assetClass: '',
    primaryTimeframe: '',
    secondaryTimeframe: '',
    symbols: [],
    
    // Entry Conditions
    entryType: '',
    indicators: [],
    priceActionPatterns: [],
    minVolume: '',
    minPrice: '',
    rsiLower: '',
    rsiUpper: '',
    
    // Exit Rules
    primaryExitType: '',
    stopLossType: '',
    takeProfitPercent: '',
    stopLossPercent: '',
    trailingMethod: '',
    trailingDistance: '',
    maxHoldTime: '',
    partialExitPercent: '',
    breakEvenTrigger: '',
    exitConditions: [],
    
    // Risk Parameters
    positionSizingMethod: '',
    maxPositionSize: '',
    portfolioRiskPercent: '',
    maxDailyRisk: '',
    maxDrawdown: '',
    maxPositions: '',
    maxSectorExposure: '',
    consecutiveLossLimit: '',
    cooldownPeriod: '',
    volatilityMultiplier: '',
    correlationThreshold: '',
    riskMetrics: [],
    
    // Order Types
    enabledOrderTypes: [],
    maxSlippage: '',
    orderTimeout: '',
    executionSettings: [],
    slippageSettings: [],
    minOrderSize: '',
    maxOrderSize: ''
  });

  const steps = [
    {
      id: 1,
      title: 'Market Selection',
      description: 'Choose assets and timeframes'
    },
    {
      id: 2,
      title: 'Entry Conditions',
      description: 'Define entry signals'
    },
    {
      id: 3,
      title: 'Exit Rules',
      description: 'Configure exit strategy'
    },
    {
      id: 4,
      title: 'Risk Parameters',
      description: 'Set risk management'
    },
    {
      id: 5,
      title: 'Order Types',
      description: 'Configure execution'
    }
  ];

  // Load saved form data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('strategy-builder-form');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
        
        // Determine completed steps based on saved data
        const completed = [];
        if (parsedData.assetClass && parsedData.primaryTimeframe && parsedData.symbols?.length > 0) {
          completed.push(1);
        }
        if (parsedData.entryType && parsedData.indicators?.length > 0) {
          completed.push(2);
        }
        if (parsedData.primaryExitType && parsedData.stopLossType) {
          completed.push(3);
        }
        if (parsedData.positionSizingMethod && parsedData.portfolioRiskPercent) {
          completed.push(4);
        }
        if (parsedData.enabledOrderTypes?.length > 0) {
          completed.push(5);
        }
        setCompletedSteps(completed);
      } catch (error) {
        console.error('Error loading saved form data:', error);
      }
    }
  }, []);

  // Auto-save form data
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem('strategy-builder-form', JSON.stringify(formData));
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [formData]);

  const handleFormChange = (newData) => {
    setFormData(newData);
    
    // Update completed steps based on form validation
    const completed = [...completedSteps];
    const stepIndex = currentStep - 1;
    
    if (isStepValid(currentStep, newData) && !completed.includes(currentStep)) {
      completed.push(currentStep);
      setCompletedSteps(completed);
    }
  };

  const isStepValid = (step, data = formData) => {
    switch (step) {
      case 1:
        return data.assetClass && data.primaryTimeframe && data.symbols?.length > 0;
      case 2:
        return data.entryType && data.indicators?.length > 0;
      case 3:
        return data.primaryExitType && data.stopLossType && data.takeProfitPercent && data.stopLossPercent;
      case 4:
        return data.positionSizingMethod && data.portfolioRiskPercent && data.maxDrawdown;
      case 5:
        return data.enabledOrderTypes?.length > 0 && data.maxSlippage;
      default:
        return false;
    }
  };

  const handleStepClick = (step) => {
    if (step <= Math.max(...completedSteps, currentStep)) {
      setCurrentStep(step);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length && isStepValid(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.setItem('strategy-builder-draft', JSON.stringify({
        ...formData,
        savedAt: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error saving draft:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleBacktest = () => {
    // Save final strategy and navigate to backtesting
    localStorage.setItem('strategy-config', JSON.stringify(formData));
    navigate('/backtesting-dashboard');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <MarketSelectionStep formData={formData} onFormChange={handleFormChange} />;
      case 2:
        return <EntryConditionsStep formData={formData} onFormChange={handleFormChange} />;
      case 3:
        return <ExitRulesStep formData={formData} onFormChange={handleFormChange} />;
      case 4:
        return <RiskParametersStep formData={formData} onFormChange={handleFormChange} />;
      case 5:
        return <OrderTypesStep formData={formData} onFormChange={handleFormChange} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      <main className={`transition-all duration-300 ease-out ${
        isOutlineCollapsed ? 'ml-16' : 'ml-80'
      } mt-16`}>
        <div className="flex h-[calc(100vh-4rem)]">
          {/* Strategy Outline Panel */}
          <StrategyOutline
            isCollapsed={isOutlineCollapsed}
            onToggle={() => setIsOutlineCollapsed(!isOutlineCollapsed)}
            completedSteps={completedSteps}
            currentStep={currentStep}
          />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col">
            {/* Step Indicator */}
            <StepIndicator
              currentStep={currentStep}
              steps={steps}
              onStepClick={handleStepClick}
            />

            {/* Breadcrumb */}
            <div className="px-8 pt-6">
              <Breadcrumb />
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
              <div className="max-w-4xl mx-auto">
                {renderCurrentStep()}
              </div>
            </div>

            {/* Action Buttons */}
            <ActionButtons
              currentStep={currentStep}
              totalSteps={steps.length}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onSaveDraft={handleSaveDraft}
              onPreview={handlePreview}
              onBacktest={handleBacktest}
              isFormValid={isStepValid(currentStep)}
              isSaving={isSaving}
            />
          </div>
        </div>
      </main>

      {/* Strategy Preview Modal */}
      {showPreview && (
        <StrategyPreview
          formData={formData}
          onClose={() => setShowPreview(false)}
          onEdit={() => setShowPreview(false)}
          onProceedToBacktest={handleBacktest}
        />
      )}
    </div>
  );
};

export default StrategyBuilder;