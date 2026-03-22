import '@testing-library/jest-dom';
import { SCENARIOS, DEFAULT_SCENARIO } from '@/data/scenarios';
import { detectScenario, getScenarioById } from '@/utils/scenarioDetector';
import { generateDemoSteps } from '@/utils/DemoStepGenerator';
import { calculateEstimate } from '@/services/EstimateService';

describe('TC-CR-020: 시나리오 E2E 일관성 검증', () => {
  test('모든 시나리오가 detectScenario -> getScenarioById 일관성 유지', () => {
    SCENARIOS.forEach(scenario => {
      // getScenarioById로 직접 조회
      const byId = getScenarioById(scenario.id);
      expect(byId.id).toBe(scenario.id);
      expect(byId.domain).toBe(scenario.domain);
    });
  });

  test('모든 시나리오에 대해 generateDemoSteps가 정상 동작', () => {
    SCENARIOS.forEach(scenario => {
      const steps = generateDemoSteps(`${scenario.domain} 프로젝트`, scenario.id);
      expect(steps.length).toBe(7);
      steps.forEach(step => {
        expect(step.fileName).toBeTruthy();
        expect(step.fileContent).toBeTruthy();
      });
    });
  });

  test('모든 시나리오에 대해 calculateEstimate가 고정값 반환', () => {
    SCENARIOS.forEach(scenario => {
      const est1 = calculateEstimate(`${scenario.domain} 프로젝트`, scenario.id);
      const est2 = calculateEstimate(`${scenario.domain} 프로젝트`, scenario.id);
      expect(est1.developmentDays).toBe(est2.developmentDays);
      expect(est1.teamSize).toBe(est2.teamSize);
      expect(est1.complexity).toBe(est2.complexity);
      expect(est1.aiSavedDays).toBe(est2.aiSavedDays);
    });
  });

  test('default 시나리오 fallback 동작', () => {
    const byId = getScenarioById('nonexistent');
    expect(byId.id).toBe(DEFAULT_SCENARIO.id);
  });

  test('scenarioId 없이 호출 시 기존 로직 fallback', () => {
    const steps = generateDemoSteps('온라인 쇼핑몰');
    expect(steps.length).toBe(7);

    const est = calculateEstimate('온라인 쇼핑몰');
    expect(est.developmentDays).toBeGreaterThan(0);
  });

  test('Screen 1->2->3 URL param 전달 시나리오 시뮬레이션', () => {
    // Screen 1: detectScenario로 scenarioId 결정
    const scenario = detectScenario('AI 기반 이커머스 쇼핑몰');
    expect(scenario.id).toBe('ecommerce');

    // Screen 2: scenarioId로 demoSteps 생성
    const steps = generateDemoSteps('AI 기반 이커머스 쇼핑몰', scenario.id);
    expect(steps.length).toBe(7);

    // Screen 3: scenarioId로 estimate 계산
    const est = calculateEstimate('AI 기반 이커머스 쇼핑몰', scenario.id);
    expect(est.developmentDays).toBe(75);
    expect(est.teamSize).toBe(8);
  });
});
