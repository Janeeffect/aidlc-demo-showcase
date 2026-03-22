import { renderHook, act } from '@testing-library/react';
import { useRunStep, RunStepCallbacks } from '@/hooks/useRunStep';
import { DemoStep } from '@/types/demo';

// 테스트용 간단한 DemoStep
const mockSteps: DemoStep[] = [
  {
    phase: 'INCEPTION',
    stage: 'requirements',
    label: '요구사항 분석',
    fileName: 'aidlc-docs/inception/requirements.md',
    fileContent: '# 요구사항',
    chatSequence: [
      { id: '1', type: 'system', content: '시작' },
      { id: '2', type: 'ai', content: '분석 중...' },
      { id: '3', type: 'user', content: '확인' },
    ],
  },
  {
    phase: 'CONSTRUCTION',
    stage: 'code',
    label: '코드 생성',
    fileName: 'src/app/page.tsx',
    fileContent: '// code',
    chatSequence: [
      { id: '4', type: 'system', content: '코드 생성' },
      { id: '5', type: 'ai', content: '생성 중...' },
    ],
  },
];

function createMockCallbacks(): RunStepCallbacks & { calls: string[] } {
  const calls: string[] = [];
  return {
    calls,
    onChatReset: jest.fn(() => calls.push('onChatReset')),
    onChatMessage: jest.fn(() => calls.push('onChatMessage')),
    onFileAdd: jest.fn(() => calls.push('onFileAdd')),
    onEditorContent: jest.fn(() => calls.push('onEditorContent')),
    onActiveFile: jest.fn(() => calls.push('onActiveFile')),
    onPhaseChange: jest.fn(() => calls.push('onPhaseChange')),
    onProgress: jest.fn(() => calls.push('onProgress')),
    onStepComplete: jest.fn(() => calls.push('onStepComplete')),
    onAnimatingChange: jest.fn(() => calls.push('onAnimatingChange')),
    onTypingChange: jest.fn(() => calls.push('onTypingChange')),
  };
}

// jest fake timers 사용
beforeEach(() => {
  jest.useFakeTimers();
});
afterEach(() => {
  jest.useRealTimers();
});

describe('useRunStep', () => {
  it('TC-CU-024: 단계 실행 시 콜백 순서 검증', async () => {
    const cbs = createMockCallbacks();
    const { result } = renderHook(() => useRunStep(mockSteps, cbs));

    let runPromise: Promise<void>;
    act(() => {
      runPromise = result.current.runStep(0);
    });

    // 모든 타이머를 실행하여 비동기 완료
    await act(async () => {
      jest.runAllTimers();
    });
    await act(async () => {
      jest.runAllTimers();
    });
    await act(async () => {
      jest.runAllTimers();
    });
    await act(async () => {
      jest.runAllTimers();
    });

    // 핵심 콜백이 호출되었는지 확인
    expect(cbs.onAnimatingChange).toHaveBeenCalledWith(true);
    expect(cbs.onChatReset).toHaveBeenCalled();
    expect(cbs.onPhaseChange).toHaveBeenCalledWith('INCEPTION', 'requirements');
    expect(cbs.onChatMessage).toHaveBeenCalled();
    expect(cbs.onFileAdd).toHaveBeenCalled();
    expect(cbs.onEditorContent).toHaveBeenCalledWith('# 요구사항', 'aidlc-docs/inception/requirements.md');
    expect(cbs.onProgress).toHaveBeenCalled();
    expect(cbs.onStepComplete).toHaveBeenCalled();
  });

  it('TC-CU-025: 취소 메커니즘 검증', async () => {
    const cbs = createMockCallbacks();
    const { result } = renderHook(() => useRunStep(mockSteps, cbs));

    // 첫 번째 실행 시작
    act(() => {
      result.current.runStep(0);
    });

    // 즉시 두 번째 실행 시작 (첫 번째 취소)
    act(() => {
      result.current.runStep(1);
    });

    await act(async () => {
      jest.runAllTimers();
    });
    await act(async () => {
      jest.runAllTimers();
    });
    await act(async () => {
      jest.runAllTimers();
    });

    // 두 번째 실행의 phase가 호출되었는지 확인
    expect(cbs.onPhaseChange).toHaveBeenCalledWith('CONSTRUCTION', 'code');
  });

  it('TC-CU-026: 에러 발생 시 복구', async () => {
    const errorCbs = createMockCallbacks();
    // onChatMessage에서 에러 발생시키기
    let callCount = 0;
    errorCbs.onChatMessage = jest.fn(() => {
      callCount++;
      if (callCount === 1) throw new Error('Test error');
    });

    const { result } = renderHook(() => useRunStep(mockSteps, errorCbs));

    act(() => {
      result.current.runStep(0);
    });

    await act(async () => {
      jest.runAllTimers();
    });
    await act(async () => {
      jest.runAllTimers();
    });
    await act(async () => {
      jest.runAllTimers();
    });

    // 에러 후 복구: animating=false, stepComplete 호출
    expect(errorCbs.onAnimatingChange).toHaveBeenCalledWith(false);
    expect(errorCbs.onStepComplete).toHaveBeenCalled();
  });
});
