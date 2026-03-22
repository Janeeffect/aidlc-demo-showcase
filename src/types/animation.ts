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


// Animation Target Constants
export const ANIMATION_TARGETS = {
  CHAT_INPUT: 'chat-input',
  SEND_BUTTON: 'send-button',
  NEXT_BUTTON: 'next-button',
  RESULT_BUTTON: 'result-button',
  EDITOR_TAB: 'editor-tab',
  EDITOR_CONTENT: 'editor-content',
  FILE_PREFIX: 'file-',
  PHASE_INDICATOR: 'phase-indicator',
} as const;

export const FALLBACK_POSITIONS: Record<string, Position> = {
  'chat-input': { x: 900, y: 600 },
  'send-button': { x: 1050, y: 600 },
  'next-button': { x: 640, y: 700 },
  'result-button': { x: 640, y: 700 },
  'editor-tab': { x: 500, y: 150 },
  'editor-content': { x: 500, y: 400 },
  'file-default': { x: 100, y: 300 },
  'phase-indicator': { x: 640, y: 80 },
};

const DEFAULT_FALLBACK: Position = { x: 500, y: 400 };

/**
 * data-animation-target 속성으로 DOM 요소를 찾아 중앙 좌표를 반환한다.
 * 요소를 찾지 못하면 FALLBACK_POSITIONS에서 조회하고, 그것도 없으면 기본 좌표를 반환한다.
 */
export function resolveTargetPosition(target: string): Position {
  if (typeof document !== 'undefined') {
    const el = document.querySelector(`[data-animation-target="${target}"]`);
    if (el) {
      const rect = el.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    }
  }
  return FALLBACK_POSITIONS[target] || DEFAULT_FALLBACK;
}
