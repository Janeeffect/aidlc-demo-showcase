// useRunStep - 단일 데모 단계 비동기 실행 훅
import { useRef, useCallback } from 'react';
import { DemoStep, ChatMessage, FileTreeNode, Phase, Stage } from '@/types/demo';

export interface RunStepCallbacks {
  onChatReset: (messages: ChatMessage[]) => void;
  onChatMessage: (msg: ChatMessage) => void;
  onFileAdd: (file: FileTreeNode) => void;
  onEditorContent: (content: string, fileName?: string) => void;
  onActiveFile: (path: string) => void;
  onPhaseChange: (phase: Phase, stage: Stage) => void;
  onProgress: (progress: number) => void;
  onStepComplete: () => void;
  onAnimatingChange: (v: boolean) => void;
  onTypingChange: (v: boolean) => void;
}

export interface UseRunStepReturn {
  runStep: (stepIdx: number) => Promise<void>;
  cancelCurrentRun: () => void;
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 단일 데모 단계 비동기 실행 훅
 */
export function useRunStep(
  demoSteps: DemoStep[],
  callbacks: RunStepCallbacks,
  speedMultiplier: number = 1
): UseRunStepReturn {
  const runIdRef = useRef(0);

  const runStep = useCallback(async (stepIdx: number) => {
    if (stepIdx >= demoSteps.length) return;

    const myRunId = ++runIdRef.current;
    const cancelled = () => runIdRef.current !== myRunId;
    const d = (ms: number) => delay(Math.round(ms / speedMultiplier));

    try {
      callbacks.onAnimatingChange(true);
      callbacks.onTypingChange(false);

      const step = demoSteps[stepIdx];

      // 이전 단계 메시지 수집
      const priorMessages: ChatMessage[] = [];
      for (let s = 0; s < stepIdx; s++) {
        priorMessages.push(...demoSteps[s].chatSequence);
      }
      callbacks.onChatReset(priorMessages);
      callbacks.onPhaseChange(step.phase, step.stage);

      // chatSequence 순차 처리
      for (let i = 0; i < step.chatSequence.length; i++) {
        if (cancelled()) return;
        const msg = step.chatSequence[i];

        if (msg.type === 'ai') {
          callbacks.onTypingChange(true);
          await d(800);
          if (cancelled()) { callbacks.onTypingChange(false); return; }
          callbacks.onTypingChange(false);
        } else if (msg.type === 'user') {
          await d(400);
          if (cancelled()) return;
        } else {
          await d(200);
          if (cancelled()) return;
        }

        callbacks.onChatMessage(msg);
      }

      if (cancelled()) return;
      await d(500);
      if (cancelled()) return;

      // 파일 생성
      callbacks.onFileAdd({
        name: step.fileName.split('/').pop() || step.fileName,
        path: step.fileName,
        type: 'file',
        isNew: true,
      });
      callbacks.onActiveFile(step.fileName);
      callbacks.onEditorContent(step.fileContent, step.fileName);

      const progress = Math.round(((stepIdx + 1) / demoSteps.length) * 100);
      callbacks.onProgress(progress);

      // 완료 안내 메시지
      const completeMsg: ChatMessage = {
        id: `complete-${stepIdx}`,
        type: 'system',
        content: stepIdx < demoSteps.length - 1
          ? `${step.label} 완료 -- 우측 상단의 "다음 단계" 버튼을 눌러주세요`
          : `${step.label} 완료 -- 우측 상단의 "결과 보기" 버튼을 눌러주세요`,
      };
      callbacks.onChatMessage(completeMsg);

      callbacks.onAnimatingChange(false);
      callbacks.onStepComplete();
    } catch (err) {
      callbacks.onAnimatingChange(false);
      callbacks.onTypingChange(false);
      callbacks.onStepComplete();
    }
  }, [demoSteps, callbacks, speedMultiplier]);

  const cancelCurrentRun = useCallback(() => {
    runIdRef.current++;
  }, []);

  return { runStep, cancelCurrentRun };
}
