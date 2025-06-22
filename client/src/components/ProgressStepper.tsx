import React from 'react';
import './ProgressStepper.css';

interface Step {
  id: number;
  title: string;
  description: string;
  icon: string;
}

interface ProgressStepperProps {
  currentStep: number;
  isLoading?: boolean;
}

const steps: Step[] = [
  {
    id: 1,
    title: "Create Prompt",
    description: "Describe your vision",
    icon: "✨"
  },
  {
    id: 2,
    title: "Add Reference",
    description: "Upload an image (optional)",
    icon: "📷"
  },
  {
    id: 3,
    title: "Generate Video",
    description: "AI creates your video",
    icon: "🎬"
  },
  {
    id: 4,
    title: "Review & Edit",
    description: "Preview your creation",
    icon: "👁️"
  },
  {
    id: 5,
    title: "Proceed to 3D",
    description: "Transform to 3D experience",
    icon: "🚀"
  }
];

const ProgressStepper: React.FC<ProgressStepperProps> = ({ currentStep, isLoading = false }) => {
  return (
    <div className="progress-stepper">
      <div className="stepper-header">
        <h3>Your Creation Journey</h3>
        <span className="step-counter">{currentStep}/5</span>
      </div>
      
      <div className="steps-container">
        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isActive = step.id <= currentStep;
          
          return (
            <div key={step.id} className="step-wrapper">
              <div className={`step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${isActive ? 'active' : ''}`}>
                <div className="step-indicator">
                  <div className="step-icon">
                    {isCompleted ? '✓' : step.icon}
                  </div>
                  {isCurrent && isLoading && (
                    <div className="loading-ring"></div>
                  )}
                </div>
                
                <div className="step-content">
                  <div className="step-title">{step.title}</div>
                  <div className="step-description">{step.description}</div>
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className={`step-connector ${isCompleted ? 'completed' : ''}`}>
                  <div className="connector-line"></div>
                  <div className="connector-progress"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="progress-bar-container">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>
        <div className="progress-text">
          Step {currentStep} of {steps.length}
        </div>
      </div>
    </div>
  );
};

export default ProgressStepper; 