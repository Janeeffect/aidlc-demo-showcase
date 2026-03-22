import { detectScenario, calculateMatchScore } from '@/utils/scenarioDetector';
import { SCENARIOS, DEFAULT_SCENARIO, ScenarioDefinition } from '@/data/scenarios';

describe('ScenarioDetector', () => {
  describe('calculateMatchScore()', () => {
    const ecommerceScenario = SCENARIOS.find(s => s.id === 'ecommerce')!;

    it('TC-CU-006: 우선 키워드(앞쪽 3개) 매칭 시 가중치 1.5', () => {
      // ecommerce의 첫 번째 키워드는 '쇼핑' (인덱스 0 = 우선)
      const score = calculateMatchScore('쇼핑', ecommerceScenario);
      expect(score).toBe(1.5);
    });

    it('TC-CU-007: 일반 키워드(인덱스 3+) 매칭 시 가중치 1.0', () => {
      // ecommerce의 4번째 키워드는 '주문' (인덱스 3 = 일반)
      const score = calculateMatchScore('주문', ecommerceScenario);
      expect(score).toBe(1.0);
    });

    it('TC-CU-008: 복수 키워드 매칭 시 점수 합산', () => {
      // '쇼핑'(1.5) + '상품'(1.5) + '주문'(1.0) = 4.0
      const score = calculateMatchScore('쇼핑 상품 주문', ecommerceScenario);
      expect(score).toBe(4.0);
    });

    it('TC-CU-009: 매칭 키워드 없으면 점수 0', () => {
      const score = calculateMatchScore('아무거나 만들어줘', ecommerceScenario);
      expect(score).toBe(0);
    });
  });

  describe('detectScenario()', () => {
    it('TC-CU-001: 이커머스 키워드 매칭', () => {
      const result = detectScenario('온라인 쇼핑몰 만들고 싶어');
      expect(result.id).toBe('ecommerce');
    });

    it('TC-CU-002: 핀테크 키워드 매칭', () => {
      const result = detectScenario('간편 송금 서비스');
      expect(result.id).toBe('fintech-remit');
    });

    it('TC-CU-003: 헬스케어 키워드 매칭', () => {
      const result = detectScenario('원격 진료 플랫폼');
      expect(result.id).toBe('healthcare');
    });

    it('TC-CU-004: 매칭 없는 입력 시 기본 시나리오 반환', () => {
      const result = detectScenario('아무거나 만들어줘');
      expect(result.id).toBe('default');
    });

    it('TC-CU-005: 빈 문자열 입력 시 기본 시나리오 반환', () => {
      const result = detectScenario('');
      expect(result.id).toBe('default');
    });
  });
});
