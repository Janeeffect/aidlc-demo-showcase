'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AnimationStep, AnimationSequence, Position } from '@/types/animation';

interface AnimationOrchestratorProps {
  sequence: AnimationSequence | null;
  onStepComplete?: (stepIndex: number, step: AnimationStep) => void;
  onAllComplete?: () => void;
  speed?: number; // 1 = normal, 0.5 = slow, 2 = fast
  autoStart?: boolean;
}

export default function AnimationOrchestrator({
  sequence,
  onStepComplete,
  onAllComplete,
  speed = 1,
  autoStart = true,
}: AnimationOrchestratorProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoStart);
  const [mousePosition, setMousePosition] = useState<Position>({ x: 100, y: 100 });
  const [isClicking, setIsClicking] = useState(false);
  const [isMouseVisible, setIsMouseVisible] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Execute current step
  const executeStep = useCallback(async (step: AnimationStep) => {
    const adjustedDuration = step.duration / speed;

    switch (step.type) {
      case 'move':
        if (step.position) {
          setMousePosition(step.position);
        } else if (step.target) {
          // Find element position
          const element = document.querySelector(`[data-file-path="${step.target}"]`);
          if (element) {
            const rect = element.getBoundingClientRect();
            setMousePosition({ x: rect.left + 10, y: rect.top + 10 });
          }
        }
        await delay(adjustedDuration);
        break;

      case 'click':
        setIsClicking(true);
        await delay(150);
        setIsClicking(false);
        await delay(adjustedDuration - 150);
        break;

      case 'wait':
        await delay(adjustedDuration);
        break;

      case 'createFile':
      case 'openFile':
      case 'type':
      case 'scroll':
        // These are handled by parent component through onStepComplete
        await delay(adjustedDuration);
        break;
    }
  }, [speed]);

  // Process steps
  useEffect(() => {
    if (!sequence || !isPlaying) return;

    const steps = sequence.steps;
    if (currentStepIndex >= steps.length) {
      setIsPlaying(false);
      onAllComplete?.();
      return;
    }

    const currentStep = steps[currentStepIndex];

    const runStep = async () => {
      // Wait for delay if specified
      if (currentStep.delay) {
        await delay(currentStep.delay / speed);
      }

      // Execute the step
      await executeStep(currentStep);

      // Notify completion
      onStepComplete?.(currentStepIndex, currentStep);

      // Move to next step
      setCurrentStepIndex(prev => prev + 1);
    };

    runStep();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [sequence, currentStepIndex, isPlaying, speed, executeStep, onStepComplete, onAllComplete]);

  // Reset when sequence changes
  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(autoStart);
    setMousePosition({ x: 100, y: 100 });
  }, [sequence, autoStart]);

  // Control functions
  const play = () => setIsPlaying(true);
  const pause = () => setIsPlaying(false);
  const reset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setMousePosition({ x: 100, y: 100 });
  };

  return (
    <>
      {/* MousePointer removed (CR-06) */}
      
      {/* Hidden controls for external access */}
      <div className="hidden">
        <button onClick={play}>Play</button>
        <button onClick={pause}>Pause</button>
        <button onClick={reset}>Reset</button>
      </div>
    </>
  );
}

// Helper function
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Hook for animation orchestration
export function useAnimationOrchestrator(speed: number = 1) {
  const [sequence, setSequence] = useState<AnimationSequence | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const start = (newSequence: AnimationSequence) => {
    setSequence(newSequence);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    setIsComplete(false);
  };

  const pause = () => setIsPlaying(false);
  const resume = () => setIsPlaying(true);
  
  const reset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setIsComplete(false);
  };

  const handleStepComplete = (index: number) => {
    setCurrentStepIndex(index + 1);
  };

  const handleAllComplete = () => {
    setIsComplete(true);
    setIsPlaying(false);
  };

  return {
    sequence,
    currentStepIndex,
    isPlaying,
    isComplete,
    progress: sequence 
      ? (currentStepIndex / sequence.steps.length) * 100 
      : 0,
    start,
    pause,
    resume,
    reset,
    handleStepComplete,
    handleAllComplete,
  };
}
