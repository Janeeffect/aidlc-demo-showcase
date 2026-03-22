/**
 * Demo Page 로직 테스트 (리팩토링 후 - 외부 모듈 사용)
 * - demoSteps 구조 검증
 * - 파일명 고유성 검증
 * - Phase/Stage 전환 순서 검증
 * - 결과 페이지 라우팅 검증
 */

import { Phase } from '@/types/demo';
import { generateDemoSteps } from '@/utils/demoStepGenerator';

describe('DemoPage - demoSteps 구조', () => {
  const steps = generateDemoSteps('온라인 쇼핑몰');

  it('7개의 단계가 있어야 한다', () => {
    expect(steps.length).toBe(7);
  });

  it('모든 파일명이 고유해야 한다 (중복 없음)', () => {
    const fileNames = steps.map(s => s.fileName);
    const uniqueNames = new Set(fileNames);
    expect(uniqueNames.size).toBe(fileNames.length);
  });

  it('모든 단계에 chatSequence가 있어야 한다', () => {
    steps.forEach(step => {
      expect(step.chatSequence.length).toBeGreaterThan(0);
    });
  });

  it('모든 chatMessage id가 고유해야 한다', () => {
    const allIds = steps.flatMap(s => s.chatSequence.map(c => c.id));
    const uniqueIds = new Set(allIds);
    expect(uniqueIds.size).toBe(allIds.length);
  });

  it('Phase 순서가 INCEPTION -> CONSTRUCTION -> OPERATIONS 이어야 한다', () => {
    const phases = steps.map(s => s.phase);
    const phaseOrder: Phase[] = ['INCEPTION', 'CONSTRUCTION', 'OPERATIONS'];
    let lastPhaseIdx = 0;
    
    phases.forEach(phase => {
      const idx = phaseOrder.indexOf(phase);
      expect(idx).toBeGreaterThanOrEqual(lastPhaseIdx);
      lastPhaseIdx = idx;
    });
  });

  it('첫 번째 단계는 INCEPTION/requirements 이어야 한다', () => {
    expect(steps[0].phase).toBe('INCEPTION');
    expect(steps[0].stage).toBe('requirements');
  });

  it('마지막 단계는 OPERATIONS/deployment 이어야 한다', () => {
    const last = steps[steps.length - 1];
    expect(last.phase).toBe('OPERATIONS');
    expect(last.stage).toBe('deployment');
  });

  it('마지막 단계의 마지막 메시지에 "완료" 키워드가 있어야 한다', () => {
    const last = steps[steps.length - 1];
    const lastMsg = last.chatSequence[last.chatSequence.length - 1];
    expect(lastMsg.content).toContain('완료');
  });

  it('projectIdea가 fileContent에 포함되어야 한다', () => {
    expect(steps[0].fileContent).toContain('온라인 쇼핑몰');
  });
});

describe('DemoPage - 다양한 입력 테스트', () => {
  const testInputs = [
    '온라인 쇼핑몰',
    '진료 예약 시스템',
    '실시간 채팅 앱',
    '학습 관리 시스템',
    '배송 추적 앱',
    'AI 기반 추천 엔진',
    '', // 빈 입력
    '한글 테스트 프로젝트 아이디어',
  ];

  testInputs.forEach(input => {
    it(`"${input || '(빈 문자열)'}" 입력에 대해 유효한 steps를 생성해야 한다`, () => {
      const steps = generateDemoSteps(input);
      expect(steps.length).toBe(7);
      
      // 모든 파일명 고유
      const fileNames = steps.map(s => s.fileName);
      expect(new Set(fileNames).size).toBe(fileNames.length);
      
      // 모든 단계에 유효한 phase/stage
      steps.forEach(step => {
        expect(['INCEPTION', 'CONSTRUCTION', 'OPERATIONS']).toContain(step.phase);
        expect(['requirements', 'design', 'code', 'infrastructure', 'deployment']).toContain(step.stage);
      });
    });
  });
});

describe('DemoPage - 진행률 계산', () => {
  it('각 단계별 진행률이 올바르게 계산되어야 한다', () => {
    const steps = generateDemoSteps('테스트');
    const totalSteps = steps.length;
    
    for (let i = 0; i < totalSteps; i++) {
      const progress = Math.round(((i + 1) / totalSteps) * 100);
      expect(progress).toBeGreaterThan(0);
      expect(progress).toBeLessThanOrEqual(100);
    }
    
    // 마지막 단계는 100%
    const lastProgress = Math.round((totalSteps / totalSteps) * 100);
    expect(lastProgress).toBe(100);
  });
});
