import React from 'react';
import Icon from '../../../components/AppIcon';

const StepIndicator = ({ currentStep, steps, onStepClick }) => {
  return (
    <div className="bg-card border-b border-border p-6">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = currentStep === stepNumber;
          const isCompleted = currentStep > stepNumber;
          const isClickable = currentStep >= stepNumber;

          return (
            <React.Fragment key={step.id}>
              <div className="flex items-center">
                <button
                  onClick={() => isClickable && onStepClick(stepNumber)}
                  disabled={!isClickable}
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                    isCompleted
                      ? 'bg-success border-success text-success-foreground'
                      : isActive
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'bg-background border-border text-muted-foreground'
                  } ${isClickable ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed'}`}
                >
                  {isCompleted ? (
                    <Icon name="Check" size={16} />
                  ) : (
                    <span className="text-sm font-medium">{stepNumber}</span>
                  )}
                </button>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    isActive ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${
                  isCompleted ? 'bg-success' : 'bg-border'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;