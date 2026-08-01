'use client';
import { Check } from 'lucide-react';

export default function ProgressStepper({ currentStep, steps, onStepClick }) {
  const progressPercent = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="reg-v2-stepper">
      <div className="reg-v2-stepper-line-bg">
        <div 
          className="reg-v2-stepper-progress" 
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      {steps.map((step) => {
        const isCompleted = step.id < currentStep;
        const isActive = step.id === currentStep;

        return (
          <div
            key={step.id}
            className={`reg-v2-step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
            onClick={() => isCompleted && onStepClick && onStepClick(step.id)}
          >
            <div className="reg-v2-step-num">
              {isCompleted ? <Check size={16} strokeWidth={3} /> : step.id}
            </div>
            <span className="reg-v2-step-label">{step.label}</span>
          </div>
        );
      })}
    </div>
  );
}
