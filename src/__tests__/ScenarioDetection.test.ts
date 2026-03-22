import '@testing-library/jest-dom';
import { getScenarioById, detectScenario, calculateMatchScore } from '@/utils/scenarioDetector';
import { SCENARIOS, DEFAULT_SCENARIO } from '@/data/scenarios';

describe('getScenarioById', () => {
  test('TC-CR-001: 유효한 scenarioId로 시나리오 조회', () => {
    const result = getScenarioById('ecommerce');
    expect(result.id).toBe('ecommerce');
    expect(result.domain).toBe('이커머스 플랫폼');
  });

  test('TC-CR-001b: 모든 시나리오 ID로 조회 가능', () => {
    const ids = ['ecommerce', 'fintech', 'healthcare', 'education', 'logistics', 'saas', 'chat'];
    ids.forEach(id => {
      const result = getScenarioById(id);
      expect(result.id).toBe(id);
    });
  });

  test('TC-CR-002: 유효하지 않은 scenarioId로 조회 시 DEFAULT_SCENARIO 반환', () => {
    const result = getScenarioById('invalid');
    expect(result.id).toBe(DEFAULT_SCENARIO.id);
    expect(result.domain).toBe(DEFAULT_SCENARIO.domain);
  });

  test('TC-CR-002b: 빈 문자열 scenarioId로 조회 시 DEFAULT_SCENARIO 반환', () => {
    const result = getScenarioById('');
    expect(result.id).toBe(DEFAULT_SCENARIO.id);
  });
});

describe('detectScenario (기존 기능 회귀 테스트)', () => {
  test('이커머스 키워드 감지', () => {
    const result = detectScenario('온라인 쇼핑몰');
    expect(result.id).toBe('ecommerce');
  });

  test('핀테크 키워드 감지', () => {
    const result = detectScenario('결제 서비스');
    expect(result.id).toBe('fintech');
  });

  test('매칭 없으면 DEFAULT_SCENARIO', () => {
    const result = detectScenario('xyz 전혀 관련없는 것');
    expect(result.id).toBe('default');
  });
});
