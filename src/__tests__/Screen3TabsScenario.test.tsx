import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock useTranslation
jest.mock('@/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        'result.aidlcOutputs.title': 'AI-DLC 산출물',
        'result.aidlcOutputs.desc': '산출물 설명',
        'result.kiro.subtitle': 'Kiro 소개',
        'result.kiro.plans': '요금제',
        'result.kiro.free': 'Free',
        'result.kiro.freePlan': '무료',
        'result.kiro.pro': 'Pro',
        'result.kiro.proPlan': '유료',
        'result.kiro.features': '기능',
        'result.kiro.comparison': '비교',
        'result.kiro.security': '보안',
        'result.kiro.getStarted': '시작하기',
      };
      // Handle dynamic keys with fallback
      return map[key] || key;
    },
    locale: 'ko',
  }),
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => <img {...props} />,
}));

// We need to test the internal components from result/page.tsx
// Since they're not exported, we test via the scenarios data approach
import { SCENARIOS, DEFAULT_SCENARIO } from '@/data/scenarios';
import { getScenarioById } from '@/utils/scenarioDetector';

describe('TC-CR-018: AIDLCOutputsTab scenarioId 분기 데이터 검증', () => {
  test('각 시나리오에 resultData.aidlcOutputs가 정의되어 있으면 분기 가능', () => {
    // scenarioId로 시나리오 조회 가능 확인
    const ecommerce = getScenarioById('ecommerce');
    expect(ecommerce.id).toBe('ecommerce');
    expect(ecommerce.domain).toBe('이커머스 플랫폼');

    const fintech = getScenarioById('fintech');
    expect(fintech.id).toBe('fintech');
    expect(fintech.domain).toBe('핀테크 서비스');
  });

  test('시나리오별 도메인이 고유하여 산출물 콘텐츠 차별화 가능', () => {
    const domains = SCENARIOS.map(s => s.domain);
    const uniqueDomains = new Set(domains);
    expect(uniqueDomains.size).toBe(domains.length);
  });
});

describe('TC-CR-019: KiroIntroTab scenarioId 분기 데이터 검증', () => {
  test('시나리오별 mainFeatures가 존재하여 활용 사례 차별화 가능', () => {
    SCENARIOS.forEach(scenario => {
      expect(scenario.mainFeatures.length).toBeGreaterThan(0);
    });
    expect(DEFAULT_SCENARIO.mainFeatures.length).toBeGreaterThan(0);
  });

  test('시나리오별 awsServices가 존재하여 기술 스택 차별화 가능', () => {
    SCENARIOS.forEach(scenario => {
      expect(scenario.awsServices.length).toBeGreaterThan(0);
    });
  });
});
