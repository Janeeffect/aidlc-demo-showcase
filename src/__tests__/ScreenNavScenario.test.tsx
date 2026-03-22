import '@testing-library/jest-dom';
import { detectScenario } from '@/utils/scenarioDetector';

describe('Screen 1 scenarioId 전달', () => {
  test('TC-CR-008: 시나리오 선택 후 시작 시 URL에 scenario param 포함', () => {
    // Screen 1의 handleStart 로직을 단위 테스트
    const projectIdea = '온라인 쇼핑몰';
    const scenarioId = detectScenario(projectIdea).id;
    const url = `/demo?idea=${encodeURIComponent(projectIdea)}&scenario=${scenarioId}`;

    expect(url).toContain('&scenario=ecommerce');
    expect(url).toContain('idea=');
  });

  test('TC-CR-008b: 다양한 시나리오에 대해 올바른 scenarioId 생성', () => {
    const cases = [
      { idea: '결제 서비스', expectedScenario: 'fintech' },
      { idea: '진료 예약 시스템', expectedScenario: 'healthcare-appointment' },
      { idea: '온라인 강의 플랫폼', expectedScenario: 'education' },
    ];
    cases.forEach(({ idea, expectedScenario }) => {
      const scenarioId = detectScenario(idea).id;
      expect(scenarioId).toBe(expectedScenario);
    });
  });
});

describe('Screen 2 파일 탐색기 콘텐츠 연동', () => {
  test('TC-CR-009: 파일 클릭 시 demoSteps에서 매칭된 fileContent 표시', () => {
    const { generateDemoSteps } = require('@/utils/demoStepGenerator');
    const demoSteps = generateDemoSteps('온라인 쇼핑몰', 'ecommerce');

    // handleFileClick 로직 시뮬레이션
    const targetFileName = demoSteps[0].fileName;
    const matchedStep = demoSteps.find((step: any) => step.fileName === targetFileName);

    expect(matchedStep).toBeDefined();
    expect(matchedStep!.fileContent).toBeTruthy();
    expect(matchedStep!.fileContent.length).toBeGreaterThan(0);
  });

  test('TC-CR-010: 이전 단계 파일 클릭 시 정확한 콘텐츠 표시', () => {
    const { generateDemoSteps } = require('@/utils/demoStepGenerator');
    const demoSteps = generateDemoSteps('온라인 쇼핑몰', 'ecommerce');

    // 3번째 단계 진행 중이라고 가정, 1번째 단계 파일 클릭
    const step0FileName = demoSteps[0].fileName;
    const step2FileName = demoSteps[2].fileName;

    const matchedForStep0 = demoSteps.find((step: any) => step.fileName === step0FileName);
    const matchedForStep2 = demoSteps.find((step: any) => step.fileName === step2FileName);

    // 각각 자기 단계의 콘텐츠를 반환해야 함
    expect(matchedForStep0!.fileContent).toBe(demoSteps[0].fileContent);
    expect(matchedForStep2!.fileContent).toBe(demoSteps[2].fileContent);
    // 서로 다른 콘텐츠여야 함
    expect(matchedForStep0!.fileContent).not.toBe(matchedForStep2!.fileContent);
  });
});
