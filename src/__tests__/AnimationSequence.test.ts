/**
 * AnimationSequence Tests
 * TC-CF-001~009: Animation 시퀀스 생성 및 resolveTargetPosition 테스트
 */

import { generateDemoSteps } from '@/utils/demoStepGenerator';
import { resolveTargetPosition, FALLBACK_POSITIONS } from '@/types/animation';

describe('AnimationSequence 생성', () => {
  const steps = generateDemoSteps('온라인 쇼핑몰');

  it('TC-CF-001: 모든 DemoStep에 animationSequence가 존재한다', () => {
    steps.forEach((step, i) => {
      expect(step.animationSequence).toBeDefined();
      expect(step.animationSequence!.steps.length).toBeGreaterThan(0);
      expect(step.animationSequence!.id).toBeTruthy();
    });
  });

  it('TC-CF-002: AnimationSequence에 move step이 포함된다', () => {
    steps.forEach((step) => {
      const moveSteps = step.animationSequence!.steps.filter(s => s.type === 'move');
      expect(moveSteps.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('TC-CF-003: AnimationSequence에 click step이 포함된다', () => {
    steps.forEach((step) => {
      const clickSteps = step.animationSequence!.steps.filter(s => s.type === 'click');
      expect(clickSteps.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('TC-CF-004: AnimationSequence에 type step이 포함되고 content가 비어있지 않다', () => {
    const hasTypeStep = steps.some((step) => {
      const typeSteps = step.animationSequence!.steps.filter(s => s.type === 'type');
      return typeSteps.length > 0 && typeSteps.every(s => s.content && s.content.length > 0);
    });
    expect(hasTypeStep).toBe(true);
  });

  it('TC-CF-005: AnimationSequence에 scroll step이 포함된다', () => {
    const hasScroll = steps.some((step) => {
      return step.animationSequence!.steps.some(s => s.type === 'scroll');
    });
    expect(hasScroll).toBe(true);
  });

  it('TC-CF-006: 모든 AnimationStep ID가 고유하다', () => {
    const allIds: string[] = [];
    steps.forEach((step) => {
      step.animationSequence!.steps.forEach(s => allIds.push(s.id));
    });
    expect(new Set(allIds).size).toBe(allIds.length);
  });

  it('TC-CF-007: 모든 duration이 100ms 이상이다', () => {
    steps.forEach((step) => {
      step.animationSequence!.steps.forEach(s => {
        expect(s.duration).toBeGreaterThanOrEqual(100);
      });
    });
  });
});

describe('resolveTargetPosition', () => {
  it('TC-CF-008: DOM 요소가 없으면 fallback 좌표를 반환한다', () => {
    const pos = resolveTargetPosition('chat-input');
    expect(pos).toEqual(FALLBACK_POSITIONS['chat-input']);
  });

  it('TC-CF-009: 알 수 없는 target은 기본 fallback을 반환한다', () => {
    const pos = resolveTargetPosition('unknown-target');
    expect(pos).toEqual({ x: 500, y: 400 });
  });
});
