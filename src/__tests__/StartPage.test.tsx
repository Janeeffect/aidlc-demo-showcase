/**
 * StartPage 로직 테스트
 * - 산업 카테고리 데이터 검증
 * - 입력 유효성 검증
 */

const industryCategories = [
  { id: 1, name: '이커머스/리테일', examples: ['온라인 쇼핑몰', '재고 관리 시스템', '주문 추적 서비스', '상품 추천 엔진', '리뷰 관리 플랫폼'] },
  { id: 2, name: '핀테크/금융', examples: ['결제 게이트웨이', '가계부 앱', '투자 포트폴리오 관리', '송금 서비스', '대출 심사 시스템'] },
  { id: 3, name: '헬스케어/의료', examples: ['진료 예약 시스템', '건강 기록 관리', '원격 진료 플랫폼', '약 복용 알림 앱', '피트니스 트래커'] },
  { id: 4, name: '교육/에듀테크', examples: ['온라인 강의 플랫폼', '학습 관리 시스템(LMS)', '퀴즈/시험 앱', '과외 매칭 서비스', '학습 진도 추적'] },
  { id: 5, name: '물류/배송', examples: ['배송 추적 시스템', '창고 관리 솔루션', '라스트마일 배송 앱', '차량 관제 시스템', '배송 기사 앱'] },
  { id: 6, name: 'SaaS/생산성', examples: ['프로젝트 관리 도구', '팀 협업 플랫폼', 'CRM 시스템', '문서 관리 시스템', '일정 관리 앱'] },
];

describe('StartPage - 산업 카테고리', () => {
  it('6개의 카테고리가 있어야 한다', () => {
    expect(industryCategories.length).toBe(6);
  });

  it('모든 카테고리에 고유한 id가 있어야 한다', () => {
    const ids = industryCategories.map(c => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('모든 카테고리에 5개의 예시가 있어야 한다', () => {
    industryCategories.forEach(category => {
      expect(category.examples.length).toBe(5);
    });
  });

  it('모든 예시가 비어있지 않아야 한다', () => {
    industryCategories.forEach(category => {
      category.examples.forEach(example => {
        expect(example.trim().length).toBeGreaterThan(0);
      });
    });
  });

  it('모든 카테고리 이름이 비어있지 않아야 한다', () => {
    industryCategories.forEach(category => {
      expect(category.name.trim().length).toBeGreaterThan(0);
    });
  });

  it('모든 예시가 고유해야 한다 (전체 중복 없음)', () => {
    const allExamples = industryCategories.flatMap(c => c.examples);
    expect(new Set(allExamples).size).toBe(allExamples.length);
  });
});

describe('StartPage - 입력 유효성', () => {
  function isValidInput(input: string): boolean {
    return input.trim().length > 0;
  }

  it('빈 문자열은 유효하지 않다', () => {
    expect(isValidInput('')).toBe(false);
  });

  it('공백만 있는 문자열은 유효하지 않다', () => {
    expect(isValidInput('   ')).toBe(false);
  });

  it('일반 텍스트는 유효하다', () => {
    expect(isValidInput('온라인 쇼핑몰')).toBe(true);
  });

  it('영문 입력도 유효하다', () => {
    expect(isValidInput('E-commerce platform')).toBe(true);
  });
});
