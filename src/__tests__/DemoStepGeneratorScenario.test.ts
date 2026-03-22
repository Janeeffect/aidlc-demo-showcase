import '@testing-library/jest-dom';
import { generateDemoSteps } from '@/utils/demoStepGenerator';

describe('generateDemoSteps with scenarioId', () => {
  test('TC-CR-003: scenarioId 전달 시 해당 시나리오 기반 DemoStep 생성', () => {
    const steps = generateDemoSteps('온라인 쇼핑몰', 'ecommerce');
    expect(steps).toHaveLength(7);
    // 이커머스 도메인 콘텐츠가 포함되어야 함
    const allContent = steps.map(s => s.fileContent).join(' ');
    expect(allContent).toContain('이커머스');
  });

  test('TC-CR-004: scenarioId 없이 호출 시 기존 detectScenario fallback', () => {
    const steps = generateDemoSteps('온라인 쇼핑몰');
    expect(steps).toHaveLength(7);
    // detectScenario가 ecommerce를 감지해야 함
    const allContent = steps.map(s => s.fileContent).join(' ');
    expect(allContent).toContain('이커머스');
  });

  test('TC-CR-005: 시나리오별 AI 메시지 차별화 확인', () => {
    const ecomSteps = generateDemoSteps('온라인 쇼핑몰', 'ecommerce');
    const finSteps = generateDemoSteps('결제 서비스', 'fintech');

    // 첫 번째 단계의 AI 메시지가 서로 달라야 함
    const ecomAiMsgs = ecomSteps[0].chatSequence.filter(m => m.type === 'ai').map(m => m.content);
    const finAiMsgs = finSteps[0].chatSequence.filter(m => m.type === 'ai').map(m => m.content);

    // 최소 하나의 AI 메시지가 달라야 함
    const ecomJoined = ecomAiMsgs.join('|');
    const finJoined = finAiMsgs.join('|');
    expect(ecomJoined).not.toBe(finJoined);
  });

  test('TC-CR-006: 시나리오별 파일 콘텐츠 차별화 확인', () => {
    const ecomSteps = generateDemoSteps('온라인 쇼핑몰', 'ecommerce');
    const finSteps = generateDemoSteps('결제 서비스', 'fintech');

    // 첫 번째 단계의 파일 콘텐츠가 서로 달라야 함
    expect(ecomSteps[0].fileContent).not.toBe(finSteps[0].fileContent);
    // 각각 자기 도메인 정보 포함
    expect(ecomSteps[0].fileContent).toContain('이커머스');
    expect(finSteps[0].fileContent).toContain('핀테크');
  });

  test('모든 7개 시나리오 + default로 DemoStep 생성 가능', () => {
    const ids = ['ecommerce', 'fintech', 'healthcare', 'education', 'logistics', 'saas', 'chat', 'default'];
    ids.forEach(id => {
      const steps = generateDemoSteps('테스트', id);
      expect(steps).toHaveLength(7);
      steps.forEach(step => {
        expect(step.fileName).toBeTruthy();
        expect(step.fileContent).toBeTruthy();
        expect(step.chatSequence.length).toBeGreaterThan(0);
      });
    });
  });
});
