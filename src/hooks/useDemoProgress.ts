// useDemoProgress - 데모 진행 상태 관리 훅
import { useState, useCallback, useMemo } from 'react';

export interface UseDemoProgressReturn {
  currentStep: number;
  isAnimating: boolean;
  stepCompleted: boolean;
  progress: number;
  isLastStep: boolean;
  canGoNext: boolean;
  canGoPrev: boolean;
  handleNextStep: () => void;
  handlePrevStep: () => void;
  setIsAnimating: (v: boolean) => void;
  setStepCompleted: (v: boolean) => void;
}

/**
 * 데모 진행 상태 관리 훅
 */
export function useDemoProgress(
  totalSteps: number,
  onComplete: () => void
): UseDemoProgressReturn {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [stepCompleted, setStepCompleted] = useState(false);

  const progress = useMemo(
    () => Math.round(((currentStep + 1) / totalSteps) * 100),
    [currentStep, totalSteps]
  );

  const isLastStep = currentStep >= totalSteps - 1;
  const canGoNext = !isAnimating && stepCompleted;
  const canGoPrev = currentStep > 0 && !isAnimating;

  const handleNextStep = useCallback(() => {
    if (isAnimating || !stepCompleted) return;
    if (isLastStep) {
      onComplete();
      return;
    }
    setCurrentStep(prev => prev + 1);
    setStepCompleted(false);
  }, [isAnimating, stepCompleted, isLastStep, onComplete]);

  const handlePrevStep = useCallback(() => {
    if (currentStep <= 0 || isAnimating) return;
    setCurrentStep(prev => prev - 1);
    setStepCompleted(false);
  }, [currentStep, isAnimating]);

  return {
    currentStep,
    isAnimating,
    stepCompleted,
    progress,
    isLastStep,
    canGoNext,
    canGoPrev,
    handleNextStep,
    handlePrevStep,
    setIsAnimating,
    setStepCompleted,
  };
}
