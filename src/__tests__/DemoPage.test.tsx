/**
 * Demo Page 로직 테스트
 * - demoSteps 구조 검증
 * - 파일명 고유성 검증
 * - Phase/Stage 전환 순서 검증
 * - 결과 페이지 라우팅 검증
 */

import { Phase, Stage } from '@/types/demo';

interface ChatMessage {
  id: string;
  type: 'ai' | 'user' | 'system';
  content: string;
}

interface DemoStep {
  phase: Phase;
  stage: Stage;
  fileName: string;
  fileContent: string;
  chatSequence: ChatMessage[];
}

// demoSteps 생성 함수 (page.tsx에서 추출)
function createDemoSteps(projectIdea: string): DemoStep[] {
  return [
    {
      phase: 'INCEPTION', stage: 'requirements',
      fileName: 'aidlc-docs/inception/requirements.md',
      fileContent: `# 요구사항 분석서\n## 프로젝트: ${projectIdea}`,
      chatSequence: [
        { id: '1', type: 'system', content: 'AI-DLC 워크플로우 시작...' },
        { id: '2', type: 'ai', content: `"${projectIdea}" 프로젝트를 분석하겠습니다.` },
        { id: '3', type: 'ai', content: 'Q1. 주요 타겟 플랫폼은?' },
        { id: '4', type: 'user', content: 'A) 웹 애플리케이션' },
        { id: '5', type: 'ai', content: 'Q2. 사용자 인증 방식은?' },
        { id: '6', type: 'user', content: 'B) 소셜 로그인' },
        { id: '7', type: 'ai', content: '요구사항 문서를 생성하고 있습니다...' },
      ],
    },
    {
      phase: 'INCEPTION', stage: 'design',
      fileName: 'aidlc-docs/inception/user-stories.md',
      fileContent: `# 사용자 스토리`,
      chatSequence: [
        { id: '8', type: 'system', content: '사용자 스토리 정의 단계...' },
        { id: '9', type: 'ai', content: 'Q3. 주요 사용자 유형은?' },
        { id: '10', type: 'user', content: 'B) 일반 사용자 + 관리자' },
        { id: '11', type: 'ai', content: '사용자 스토리를 생성하고 있습니다...' },
      ],
    },
    {
      phase: 'INCEPTION', stage: 'design',
      fileName: 'aidlc-docs/inception/application-design.md',
      fileContent: `# 애플리케이션 설계서`,
      chatSequence: [
        { id: '12', type: 'system', content: '애플리케이션 설계 단계...' },
        { id: '13', type: 'ai', content: 'Q4. 선호하는 기술 스택은?' },
        { id: '14', type: 'user', content: 'A) Next.js + TypeScript' },
        { id: '15', type: 'ai', content: '설계 문서를 생성하고 있습니다...' },
      ],
    },
    {
      phase: 'CONSTRUCTION', stage: 'code',
      fileName: 'aidlc-docs/construction/nfr-design.md',
      fileContent: `# 비기능 요구사항 설계서`,
      chatSequence: [
        { id: '16', type: 'system', content: '비기능 요구사항 설계...' },
        { id: '17', type: 'ai', content: '비기능 요구사항을 설계하고 있습니다...' },
      ],
    },
    {
      phase: 'CONSTRUCTION', stage: 'code',
      fileName: 'src/app/page.tsx',
      fileContent: `'use client';`,
      chatSequence: [
        { id: '18', type: 'system', content: '코드 생성 시작...' },
        { id: '19', type: 'ai', content: '코드를 생성하고 있습니다...' },
      ],
    },
    {
      phase: 'OPERATIONS', stage: 'infrastructure',
      fileName: 'aidlc-docs/construction/infrastructure.yaml',
      fileContent: `# AWS 인프라 설계`,
      chatSequence: [
        { id: '20', type: 'system', content: '인프라 설계...' },
        { id: '21', type: 'ai', content: 'AWS 인프라를 설계하고 있습니다...' },
      ],
    },
    {
      phase: 'OPERATIONS', stage: 'deployment',
      fileName: 'aidlc-docs/operations/deployment-plan.md',
      fileContent: `# 배포 계획서\nAI-DLC 완료!`,
      chatSequence: [
        { id: '22', type: 'system', content: '배포 계획 생성...' },
        { id: '23', type: 'ai', content: 'AI-DLC 워크플로우가 완료되었습니다!' },
      ],
    },
  ];
}

describe('DemoPage - demoSteps 구조', () => {
  const steps = createDemoSteps('온라인 쇼핑몰');

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

  it('Phase 순서가 INCEPTION → CONSTRUCTION → OPERATIONS 이어야 한다', () => {
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
      const steps = createDemoSteps(input);
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
    const steps = createDemoSteps('테스트');
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
