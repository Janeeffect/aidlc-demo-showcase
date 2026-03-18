// Animation Types

export interface Position {
  x: number;
  y: number;
}

export type AnimationStepType = 
  | 'move'
  | 'click'
  | 'type'
  | 'wait'
  | 'createFile'
  | 'openFile'
  | 'scroll';

export interface AnimationStep {
  id: string;
  type: AnimationStepType;
  target?: string; // element selector or file path
  position?: Position;
  content?: string; // for typing
  duration: number; // ms
  delay?: number; // ms before step
}

export interface AnimationSequence {
  id: string;
  phase: string;
  stage: string;
  steps: AnimationStep[];
}

export interface MousePointerState {
  position: Position;
  isVisible: boolean;
  isClicking: boolean;
}

export interface TypingState {
  text: string;
  currentIndex: number;
  isTyping: boolean;
  speed: number; // ms per character
}

export interface AnimationOrchestratorState {
  currentSequence: AnimationSequence | null;
  currentStepIndex: number;
  isPlaying: boolean;
  isPaused: boolean;
  speed: number; // 1 = normal, 0.5 = slow, 2 = fast
}
