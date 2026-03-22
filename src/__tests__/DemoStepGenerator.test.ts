import { generateDemoSteps } from '@/utils/demoStepGenerator';
import { Phase } from '@/types/demo';

describe('DemoStepGenerator', () => {
  describe('generateDemoSteps()', () => {
    it('TC-CU-010: 항상 7개 단계 생성', () => {
      const steps = generateDemoSteps('온라인 쇼핑몰');
      expect(steps.length).toBe(7);
    });

    it('TC-CU-011: Phase 순서 INCEPTION -> CONSTRUCTION -> OPERATIONS', () => {
      const steps = generateDemoSteps('온라인 쇼핑몰');
      const phases = steps.map(s => s.phase);
      const phaseOrder: Phase[] = ['INCEPTION', 'CONSTRUCTION', 'OPERATIONS'];
      let lastIdx = 0;
      phases.forEach(phase => {
        const idx = phaseOrder.indexOf(phase);
        expect(idx).toBeGreaterThanOrEqual(lastIdx);
        lastIdx = idx;
      });
    });

    it('TC-CU-012: 모든 파일명 고유성', () => {
      const steps = generateDemoSteps('온라인 쇼핑몰');
      const fileNames = steps.map(s => s.fileName);
      expect(new Set(fileNames).size).toBe(fileNames.length);
    });

    it('TC-CU-013: 모든 chatMessage ID 고유성', () => {
      const steps = generateDemoSteps('온라인 쇼핑몰');
      const allIds = steps.flatMap(s => s.chatSequence.map(c => c.id));
      expect(new Set(allIds).size).toBe(allIds.length);
    });

    it('TC-CU-014: 시나리오 데이터가 fileContent에 반영', () => {
      const steps = generateDemoSteps('온라인 쇼핑몰');
      // 이커머스 시나리오의 domain이 첫 번째 단계 fileContent에 포함
      expect(steps[0].fileContent).toContain('이커머스');
    });

    it('TC-CU-015: 빈 입력에도 유효한 단계 생성', () => {
      const steps = generateDemoSteps('');
      expect(steps.length).toBe(7);
      steps.forEach(step => {
        expect(['INCEPTION', 'CONSTRUCTION', 'OPERATIONS']).toContain(step.phase);
        expect(step.chatSequence.length).toBeGreaterThan(0);
      });
    });
  });
});
