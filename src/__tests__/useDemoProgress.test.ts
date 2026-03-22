import { renderHook, act } from '@testing-library/react';
import { useDemoProgress } from '@/hooks/useDemoProgress';

describe('useDemoProgress', () => {
  const mockOnComplete = jest.fn();

  beforeEach(() => {
    mockOnComplete.mockClear();
  });

  it('TC-CU-016: 초기 상태 검증', () => {
    const { result } = renderHook(() => useDemoProgress(7, mockOnComplete));
    expect(result.current.currentStep).toBe(0);
    expect(result.current.isAnimating).toBe(false);
    expect(result.current.stepCompleted).toBe(false);
    expect(result.current.progress).toBe(Math.round((1 / 7) * 100));
  });

  it('TC-CU-017: 다음 단계 이동', () => {
    const { result } = renderHook(() => useDemoProgress(7, mockOnComplete));
    act(() => { result.current.setStepCompleted(true); });
    act(() => { result.current.handleNextStep(); });
    expect(result.current.currentStep).toBe(1);
    expect(result.current.stepCompleted).toBe(false);
  });

  it('TC-CU-018: 애니메이션 중 다음 이동 차단', () => {
    const { result } = renderHook(() => useDemoProgress(7, mockOnComplete));
    act(() => { result.current.setIsAnimating(true); });
    act(() => { result.current.setStepCompleted(true); });
    act(() => { result.current.handleNextStep(); });
    expect(result.current.currentStep).toBe(0);
  });

  it('TC-CU-019: 마지막 단계에서 onComplete 콜백 호출', () => {
    const { result } = renderHook(() => useDemoProgress(7, mockOnComplete));
    // 6단계까지 이동
    for (let i = 0; i < 6; i++) {
      act(() => { result.current.setStepCompleted(true); });
      act(() => { result.current.handleNextStep(); });
    }
    expect(result.current.currentStep).toBe(6);
    act(() => { result.current.setStepCompleted(true); });
    act(() => { result.current.handleNextStep(); });
    expect(mockOnComplete).toHaveBeenCalledTimes(1);
  });

  it('TC-CU-020: 이전 단계 이동', () => {
    const { result } = renderHook(() => useDemoProgress(7, mockOnComplete));
    act(() => { result.current.setStepCompleted(true); });
    act(() => { result.current.handleNextStep(); });
    expect(result.current.currentStep).toBe(1);
    act(() => { result.current.handlePrevStep(); });
    expect(result.current.currentStep).toBe(0);
  });

  it('TC-CU-021: 첫 단계에서 이전 이동 차단', () => {
    const { result } = renderHook(() => useDemoProgress(7, mockOnComplete));
    act(() => { result.current.handlePrevStep(); });
    expect(result.current.currentStep).toBe(0);
  });

  it('TC-CU-022: progress 계산 검증', () => {
    const { result } = renderHook(() => useDemoProgress(7, mockOnComplete));
    // step 0 -> progress = round(1/7*100) = 14
    expect(result.current.progress).toBe(14);
    // step 3으로 이동
    for (let i = 0; i < 3; i++) {
      act(() => { result.current.setStepCompleted(true); });
      act(() => { result.current.handleNextStep(); });
    }
    // step 3 -> progress = round(4/7*100) = 57
    expect(result.current.progress).toBe(57);
  });

  it('TC-CU-023: canGoNext/canGoPrev 계산 검증', () => {
    const { result } = renderHook(() => useDemoProgress(7, mockOnComplete));
    // 초기: canGoNext=false (stepCompleted=false), canGoPrev=false (step=0)
    expect(result.current.canGoNext).toBe(false);
    expect(result.current.canGoPrev).toBe(false);
    // stepCompleted=true -> canGoNext=true
    act(() => { result.current.setStepCompleted(true); });
    expect(result.current.canGoNext).toBe(true);
    // step 1로 이동 -> canGoPrev=true
    act(() => { result.current.handleNextStep(); });
    act(() => { result.current.setStepCompleted(true); });
    expect(result.current.canGoPrev).toBe(true);
    expect(result.current.canGoNext).toBe(true);
  });
});
