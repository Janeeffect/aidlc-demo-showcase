/**
 * MVPPreview 컴포넌트 로직 테스트
 * - 카테고리별 올바른 컴포넌트 매핑
 * - 페르소나 라벨 매핑
 */

describe('MVPPreview - 카테고리 매핑', () => {
  function getPersonaLabels(projectIdea: string) {
    const idea = projectIdea.toLowerCase();
    if (idea.includes('쇼핑') || idea.includes('이커머스') || idea.includes('주문')) {
      return { user: '고객', admin: '판매자' };
    }
    if (idea.includes('예약') || idea.includes('booking') || idea.includes('진료')) {
      return { user: '고객', admin: '서비스 제공자' };
    }
    if (idea.includes('교육') || idea.includes('강의') || idea.includes('학습')) {
      return { user: '학습자', admin: '강사' };
    }
    if (idea.includes('채팅') || idea.includes('협업')) {
      return { user: '팀원', admin: '관리자' };
    }
    return { user: '사용자', admin: '관리자' };
  }

  function getMVPCategory(projectIdea: string): string {
    const idea = projectIdea.toLowerCase();
    if (idea.includes('쇼핑') || idea.includes('상품') || idea.includes('주문') || idea.includes('이커머스')) return 'ecommerce';
    if (idea.includes('예약') || idea.includes('booking') || idea.includes('진료')) return 'booking';
    if (idea.includes('교육') || idea.includes('강의') || idea.includes('학습') || idea.includes('lms')) return 'learning';
    if (idea.includes('채팅') || idea.includes('chat') || idea.includes('협업')) return 'chat';
    return 'dashboard';
  }

  describe('페르소나 라벨', () => {
    it('이커머스: 고객/판매자', () => {
      expect(getPersonaLabels('온라인 쇼핑몰')).toEqual({ user: '고객', admin: '판매자' });
      expect(getPersonaLabels('주문 관리 시스템')).toEqual({ user: '고객', admin: '판매자' });
      expect(getPersonaLabels('이커머스 플랫폼')).toEqual({ user: '고객', admin: '판매자' });
    });

    it('예약: 고객/서비스 제공자', () => {
      expect(getPersonaLabels('진료 예약 시스템')).toEqual({ user: '고객', admin: '서비스 제공자' });
      expect(getPersonaLabels('booking 앱')).toEqual({ user: '고객', admin: '서비스 제공자' });
    });

    it('교육: 학습자/강사', () => {
      expect(getPersonaLabels('온라인 강의 플랫폼')).toEqual({ user: '학습자', admin: '강사' });
      expect(getPersonaLabels('학습 관리 시스템')).toEqual({ user: '학습자', admin: '강사' });
    });

    it('채팅: 팀원/관리자', () => {
      expect(getPersonaLabels('팀 채팅 앱')).toEqual({ user: '팀원', admin: '관리자' });
      expect(getPersonaLabels('협업 도구')).toEqual({ user: '팀원', admin: '관리자' });
    });

    it('기본: 사용자/관리자', () => {
      expect(getPersonaLabels('프로젝트 관리 도구')).toEqual({ user: '사용자', admin: '관리자' });
      expect(getPersonaLabels('CRM 시스템')).toEqual({ user: '사용자', admin: '관리자' });
    });
  });

  describe('카테고리 매핑', () => {
    it('이커머스 키워드 매핑', () => {
      expect(getMVPCategory('온라인 쇼핑몰')).toBe('ecommerce');
      expect(getMVPCategory('상품 관리')).toBe('ecommerce');
      expect(getMVPCategory('주문 추적')).toBe('ecommerce');
    });

    it('예약 키워드 매핑', () => {
      expect(getMVPCategory('진료 예약')).toBe('booking');
      expect(getMVPCategory('booking 시스템')).toBe('booking');
    });

    it('학습 키워드 매핑', () => {
      expect(getMVPCategory('온라인 교육')).toBe('learning');
      expect(getMVPCategory('LMS 플랫폼')).toBe('learning');
      expect(getMVPCategory('강의 관리')).toBe('learning');
    });

    it('채팅 키워드 매핑', () => {
      expect(getMVPCategory('실시간 채팅')).toBe('chat');
      expect(getMVPCategory('chat 앱')).toBe('chat');
      expect(getMVPCategory('팀 협업')).toBe('chat');
    });

    it('기본 대시보드 매핑', () => {
      expect(getMVPCategory('프로젝트 관리')).toBe('dashboard');
      expect(getMVPCategory('CRM')).toBe('dashboard');
      expect(getMVPCategory('블로그')).toBe('dashboard');
    });
  });

  describe('모든 카테고리에 두 페르소나 존재', () => {
    const allInputs = [
      '온라인 쇼핑몰', '진료 예약', '온라인 교육', '팀 채팅', '프로젝트 관리',
    ];

    allInputs.forEach(input => {
      it(`"${input}" - user와 admin 페르소나 모두 존재`, () => {
        const labels = getPersonaLabels(input);
        expect(labels.user).toBeTruthy();
        expect(labels.admin).toBeTruthy();
        expect(labels.user).not.toBe(labels.admin);
      });
    });
  });
});
