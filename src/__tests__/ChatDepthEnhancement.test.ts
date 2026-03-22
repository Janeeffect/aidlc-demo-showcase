/**
 * CR-07: 채팅 대화 깊이 강화 테스트
 * TC-C3-006: 각 단계별 최소 8개 메시지
 * TC-C3-007: 다회전 대화 구조 (user 메시지 포함)
 * TC-C3-008: 시나리오별 고유 콘텐츠
 */

import { generateDemoSteps } from '@/utils/demoStepGenerator';

describe('CR-07: 채팅 대화 깊이 강화', () => {
  it('TC-C3-006: 각 단계별 최소 8개 메시지', () => {
    const steps = generateDemoSteps('온라인 쇼핑몰', 'ecommerce');

    steps.forEach((step, index) => {
      expect(step.chatSequence.length).toBeGreaterThanOrEqual(8);
    });
  });

  it('TC-C3-007: 요구사항 분석 단계에 user 메시지 2개 이상', () => {
    const steps = generateDemoSteps('온라인 쇼핑몰', 'ecommerce');
    const reqStep = steps[0]; // 요구사항 분석 단계

    const userMessages = reqStep.chatSequence.filter(m => m.type === 'user');
    expect(userMessages.length).toBeGreaterThanOrEqual(2);
  });

  it('TC-C3-008: 시나리오별 고유 콘텐츠 (ecommerce vs fintech)', () => {
    const ecomSteps = generateDemoSteps('온라인 쇼핑몰', 'ecommerce');
    const finSteps = generateDemoSteps('결제 게이트웨이', 'fintech');

    // 동일 단계(0번)의 ai 메시지 내용이 서로 달라야 함
    const ecomAiMsgs = ecomSteps[0].chatSequence.filter(m => m.type === 'ai').map(m => m.content);
    const finAiMsgs = finSteps[0].chatSequence.filter(m => m.type === 'ai').map(m => m.content);

    // 최소 하나의 ai 메시지가 달라야 함
    const allSame = ecomAiMsgs.every((msg, i) => finAiMsgs[i] === msg);
    expect(allSame).toBe(false);
  });
});
