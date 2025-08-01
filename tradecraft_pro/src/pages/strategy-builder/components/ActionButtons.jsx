import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ActionButtons = ({ 
  currentStep, 
  totalSteps, 
  onPrevious, 
  onNext, 
  onSaveDraft, 
  onPreview, 
  onBacktest,
  isFormValid,
  isSaving 
}) => {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="bg-card border-t border-border p-6">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {/* Left side - Previous button */}
        <div className="flex items-center space-x-4">
          {!isFirstStep && (
            <Button
              variant="outline"
              onClick={onPrevious}
              iconName="ChevronLeft"
              iconPosition="left"
            >
              Previous
            </Button>
          )}
        </div>

        {/* Center - Save and Preview buttons */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={onSaveDraft}
            loading={isSaving}
            iconName="Save"
            iconPosition="left"
          >
            Save Draft
          </Button>

          <Button
            variant="outline"
            onClick={onPreview}
            iconName="Eye"
            iconPosition="left"
            disabled={!isFormValid}
          >
            Preview Strategy
          </Button>
        </div>

        {/* Right side - Next/Complete buttons */}
        <div className="flex items-center space-x-4">
          {!isLastStep ? (
            <Button
              variant="default"
              onClick={onNext}
              iconName="ChevronRight"
              iconPosition="right"
              disabled={!isFormValid}
            >
              Next Step
            </Button>
          ) : (
            <Button
              variant="success"
              onClick={onBacktest}
              iconName="Play"
              iconPosition="left"
              disabled={!isFormValid}
            >
              Start Backtest
            </Button>
          )}
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mt-4 max-w-4xl mx-auto">
        <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Clock" size={14} />
          <span>Step {currentStep} of {totalSteps}</span>
          <span>•</span>
          <span>Auto-saved {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};

export default ActionButtons;