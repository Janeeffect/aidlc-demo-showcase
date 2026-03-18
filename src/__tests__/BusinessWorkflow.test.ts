/**
 * BusinessWorkflowDiagram - 시퀀스 다이어그램 생성 로직 테스트
 */

// BusinessWorkflowDiagram.tsx에서 추출한 로직
function getWorkflowCategory(idea: string): string {
  const ideaLower = idea.toLowerCase();
  if (ideaLower.includes('쇼핑') || ideaLower.includes('주문') || ideaLower.includes('이커머스')) return 'ecommerce';
  if (ideaLower.includes('예약') || ideaLower.includes('booking') || ideaLower.includes('진료')) return 'booking';
  if (ideaLower.includes('교육') || ideaLower.includes('학습') || ideaLower.includes('lms')) return 'learning';
  if (ideaLower.includes('채팅') || ideaLower.includes('chat') || ideaLower.includes('협업')) return 'chat';
  return 'default';
}

describe('BusinessWorkflowDiagram', () => {
  describe('카테고리 매핑', () => {
    it('이커머스 키워드', () => {
      expect(getWorkflowCategory('온라인 쇼핑몰')).toBe('ecommerce');
      expect(getWorkflowCategory('주문 관리')).toBe('ecommerce');
      expect(getWorkflowCategory('이커머스 플랫폼')).toBe('ecommerce');
    });

    it('예약 키워드', () => {
      expect(getWorkflowCategory('진료 예약')).toBe('booking');
      expect(getWorkflowCategory('booking 앱')).toBe('booking');
    });

    it('교육 키워드', () => {
      expect(getWorkflowCategory('온라인 교육')).toBe('learning');
      expect(getWorkflowCategory('LMS')).toBe('learning');
      expect(getWorkflowCategory('학습 관리')).toBe('learning');
    });

    it('채팅 키워드', () => {
      expect(getWorkflowCategory('팀 채팅')).toBe('chat');
      expect(getWorkflowCategory('chat 앱')).toBe('chat');
      expect(getWorkflowCategory('협업 도구')).toBe('chat');
    });

    it('기본 카테고리', () => {
      expect(getWorkflowCategory('블로그')).toBe('default');
      expect(getWorkflowCategory('CRM')).toBe('default');
    });
  });

  describe('모든 카테고리에 대해 유효한 결과', () => {
    const inputs = ['쇼핑몰', '예약 시스템', '교육 플랫폼', '채팅 앱', '프로젝트 관리'];
    
    inputs.forEach(input => {
      it(`"${input}" - 카테고리가 결정되어야 한다`, () => {
        const category = getWorkflowCategory(input);
        expect(['ecommerce', 'booking', 'learning', 'chat', 'default']).toContain(category);
      });
    });
  });
});
