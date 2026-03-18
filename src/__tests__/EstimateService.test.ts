import { calculateEstimate, ProjectEstimate } from '@/services/EstimateService';

describe('EstimateService', () => {
  describe('calculateEstimate', () => {
    it('should return a valid estimate object', () => {
      const result = calculateEstimate('온라인 쇼핑몰');
      expect(result).toHaveProperty('developmentDays');
      expect(result).toHaveProperty('teamSize');
      expect(result).toHaveProperty('teamComposition');
      expect(result).toHaveProperty('estimatedCost');
      expect(result).toHaveProperty('techStack');
      expect(result).toHaveProperty('complexity');
      expect(result).toHaveProperty('aiSavedDays');
      expect(result).toHaveProperty('aiSavedPercentage');
    });

    it('should return positive development days', () => {
      const result = calculateEstimate('블로그');
      expect(result.developmentDays).toBeGreaterThan(0);
    });

    it('should return team size matching team composition', () => {
      const result = calculateEstimate('프로젝트 관리 도구');
      const compositionTotal = result.teamComposition.reduce((sum, m) => sum + m.count, 0);
      expect(result.teamSize).toBe(compositionTotal);
    });

    it('should return AI saved percentage between 30 and 50', () => {
      const result = calculateEstimate('CRM 시스템');
      expect(result.aiSavedPercentage).toBeGreaterThanOrEqual(30);
      expect(result.aiSavedPercentage).toBeLessThanOrEqual(50);
    });

    it('should classify simple projects as low complexity', () => {
      const result = calculateEstimate('블로그');
      expect(result.complexity).toBe('low');
    });

    it('should classify medium projects correctly', () => {
      const result = calculateEstimate('채팅 앱');
      expect(['medium', 'high']).toContain(result.complexity);
    });

    it('should classify complex projects as high complexity', () => {
      const result = calculateEstimate('실시간 결제 AI 추천 대규모 시스템');
      expect(result.complexity).toBe('high');
    });

    it('should include WebSocket in tech stack for real-time projects', () => {
      const result = calculateEstimate('실시간 채팅 앱');
      expect(result.techStack).toContain('WebSocket');
    });

    it('should include Bedrock for AI projects', () => {
      const result = calculateEstimate('AI 기반 분석 시스템');
      expect(result.techStack).toContain('Amazon Bedrock');
    });

    it('should include Stripe for payment projects', () => {
      const result = calculateEstimate('결제 게이트웨이');
      expect(result.techStack).toContain('Stripe');
    });

    it('should always include base tech stack', () => {
      const result = calculateEstimate('간단한 앱');
      expect(result.techStack).toContain('Next.js');
      expect(result.techStack).toContain('TypeScript');
      expect(result.techStack).toContain('AWS Lambda');
      expect(result.techStack).toContain('DynamoDB');
    });

    it('should have valid cost estimates', () => {
      const result = calculateEstimate('온라인 쇼핑몰');
      expect(result.estimatedCost.development.min).toBeLessThanOrEqual(result.estimatedCost.development.max);
      expect(result.estimatedCost.monthly.min).toBeLessThanOrEqual(result.estimatedCost.monthly.max);
      expect(result.estimatedCost.currency).toBe('USD');
    });

    it('should have higher costs for complex projects', () => {
      const simple = calculateEstimate('블로그');
      const complex = calculateEstimate('실시간 결제 AI 대규모 시스템');
      expect(complex.estimatedCost.monthly.max).toBeGreaterThanOrEqual(simple.estimatedCost.monthly.max);
    });

    it('should have larger teams for complex projects', () => {
      const simple = calculateEstimate('블로그');
      const complex = calculateEstimate('실시간 결제 AI 대규모 시스템');
      expect(complex.teamSize).toBeGreaterThanOrEqual(simple.teamSize);
    });

    // 다양한 카테고리 입력 테스트
    const categories = [
      '온라인 쇼핑몰', '진료 예약 시스템', '온라인 강의 플랫폼',
      '팀 협업 채팅', '배송 추적 시스템', '가계부 앱',
    ];

    categories.forEach(idea => {
      it(`should generate valid estimate for "${idea}"`, () => {
        const result = calculateEstimate(idea);
        expect(result.developmentDays).toBeGreaterThan(0);
        expect(result.teamSize).toBeGreaterThan(0);
        expect(result.techStack.length).toBeGreaterThan(0);
        expect(result.teamComposition.length).toBeGreaterThan(0);
      });
    });
  });
});
