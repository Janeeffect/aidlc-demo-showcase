import '@testing-library/jest-dom';
import { DemoLog } from '@/types/demo';

// 집계 함수를 별도 모듈로 추출하여 테스트
// src/services/StatisticsService.ts에서 import
import {
  calculateIndustryDistribution,
  calculateSessionTrend,
  extractPopularIdeas,
} from '@/services/StatisticsService';

const sampleLogs: DemoLog[] = [
  { id: '1', sessionId: 's1', projectIdea: 'AI 챗봇', completed: true, durationMs: 120000, timestamp: '2026-03-22T10:15:00Z', industry: 'IT' },
  { id: '2', sessionId: 's2', projectIdea: '이커머스 플랫폼', completed: true, durationMs: 180000, timestamp: '2026-03-22T10:45:00Z', industry: '유통' },
  { id: '3', sessionId: 's3', projectIdea: 'AI 챗봇', completed: false, durationMs: 60000, timestamp: '2026-03-22T11:30:00Z', industry: 'IT' },
  { id: '4', sessionId: 's4', projectIdea: '헬스케어 앱', completed: true, durationMs: 200000, timestamp: '2026-03-22T14:00:00Z', industry: '헬스케어' },
  { id: '5', sessionId: 's5', projectIdea: 'AI 챗봇', completed: true, durationMs: 150000, timestamp: '2026-03-22T14:20:00Z', industry: 'IT' },
  { id: '6', sessionId: 's6', projectIdea: '물류 시스템', completed: true, durationMs: 90000, timestamp: '2026-03-22T10:50:00Z' },
];

describe('API Statistics Calculation', () => {
  // TC-NF-018: 산업별 분포를 올바르게 계산한다
  test('TC-NF-018: 산업별 분포를 올바르게 계산한다', () => {
    const result = calculateIndustryDistribution(sampleLogs);
    // IT: 3, 유통: 1, 헬스케어: 1, 기타: 1 (industry 없는 로그)
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ industry: 'IT', count: 3 }),
        expect.objectContaining({ industry: '유통', count: 1 }),
        expect.objectContaining({ industry: '헬스케어', count: 1 }),
      ])
    );
    // percentage 합계 = 100
    const totalPct = result.reduce((sum, d) => sum + d.percentage, 0);
    expect(Math.round(totalPct)).toBe(100);
  });

  // TC-NF-019: 세션 추이를 시간대별로 올바르게 계산한다
  test('TC-NF-019: 세션 추이를 시간대별로 올바르게 계산한다', () => {
    const result = calculateSessionTrend(sampleLogs);
    // 10시: 3건 (s1, s2, s6), 11시: 1건 (s3), 14시: 2건 (s4, s5)
    const hour10 = result.find(d => d.hour === '10시');
    const hour11 = result.find(d => d.hour === '11시');
    const hour14 = result.find(d => d.hour === '14시');
    expect(hour10?.count).toBe(3);
    expect(hour11?.count).toBe(1);
    expect(hour14?.count).toBe(2);
  });

  // TC-NF-020: 인기 아이디어를 상위 5개로 추출한다
  test('TC-NF-020: 인기 아이디어를 상위 5개로 추출한다', () => {
    const result = extractPopularIdeas(sampleLogs);
    // AI 챗봇: 3, 이커머스 플랫폼: 1, 헬스케어 앱: 1, 물류 시스템: 1
    expect(result[0]).toEqual({ idea: 'AI 챗봇', count: 3 });
    expect(result.length).toBeLessThanOrEqual(5);
    // 내림차순 정렬
    for (let i = 1; i < result.length; i++) {
      expect(result[i - 1].count).toBeGreaterThanOrEqual(result[i].count);
    }
  });

  // TC-NF-021: industry 없는 로그는 "기타"로 분류한다
  test('TC-NF-021: industry 없는 로그는 "기타"로 분류한다', () => {
    const result = calculateIndustryDistribution(sampleLogs);
    const etc = result.find(d => d.industry === '기타');
    expect(etc).toBeDefined();
    expect(etc!.count).toBe(1);
  });

  // TC-NF-022: 빈 로그 배열에서 빈 결과를 반환한다
  test('TC-NF-022: 빈 로그 배열에서 빈 결과를 반환한다', () => {
    expect(calculateIndustryDistribution([])).toEqual([]);
    expect(calculateSessionTrend([])).toEqual([]);
    expect(extractPopularIdeas([])).toEqual([]);
  });
});
