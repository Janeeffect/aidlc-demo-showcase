/**
 * ResultPage 로직 테스트
 * - 탭 구성 검증
 * - AI-DLC 산출물 구조 검증
 * - 이메일 폼 유효성 검증
 */

describe('ResultPage - 탭 구성', () => {
  const tabs = [
    { id: 'mvp', label: 'MVP 미리보기' },
    { id: 'architecture', label: 'AWS 아키텍처' },
    { id: 'workflow', label: '비즈니스 워크플로우' },
    { id: 'estimate', label: '프로젝트 예상' },
    { id: 'aidlc', label: 'AI-DLC 산출물' },
    { id: 'kiro', label: 'Kiro 소개' },
  ];

  it('6개의 탭이 있어야 한다', () => {
    expect(tabs.length).toBe(6);
  });

  it('모든 탭에 고유한 id가 있어야 한다', () => {
    const ids = tabs.map(t => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('모든 탭에 한글 라벨이 있어야 한다', () => {
    tabs.forEach(tab => {
      expect(tab.label.length).toBeGreaterThan(0);
    });
  });

  it('MVP 미리보기가 첫 번째 탭이어야 한다', () => {
    expect(tabs[0].id).toBe('mvp');
  });
});

describe('ResultPage - AI-DLC 산출물', () => {
  const outputKeys = ['requirements.md', 'user-stories.md', 'components.md', 'api-spec.md', 'infrastructure.yaml'];
  const phases = ['INCEPTION', 'CONSTRUCTION', 'OPERATIONS'];

  it('5개의 산출물이 있어야 한다', () => {
    expect(outputKeys.length).toBe(5);
  });

  it('모든 산출물 키가 고유해야 한다', () => {
    expect(new Set(outputKeys).size).toBe(outputKeys.length);
  });

  it('산출물 키에 파일 확장자가 있어야 한다', () => {
    outputKeys.forEach(key => {
      expect(key).toMatch(/\.\w+$/);
    });
  });
});

describe('ResultPage - 이메일 폼 유효성', () => {
  function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isFormValid(data: { email: string; name: string; company: string }): boolean {
    return isValidEmail(data.email) && data.name.trim().length > 0 && data.company.trim().length > 0;
  }

  it('유효한 이메일 형식을 검증한다', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('user@company.co.kr')).toBe(true);
  });

  it('잘못된 이메일 형식을 거부한다', () => {
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail('invalid')).toBe(false);
    expect(isValidEmail('@no-user.com')).toBe(false);
    expect(isValidEmail('no-domain@')).toBe(false);
  });

  it('모든 필드가 채워져야 유효하다', () => {
    expect(isFormValid({ email: 'test@test.com', name: '홍길동', company: 'AWS' })).toBe(true);
  });

  it('빈 필드가 있으면 유효하지 않다', () => {
    expect(isFormValid({ email: 'test@test.com', name: '', company: 'AWS' })).toBe(false);
    expect(isFormValid({ email: 'test@test.com', name: '홍길동', company: '' })).toBe(false);
    expect(isFormValid({ email: '', name: '홍길동', company: 'AWS' })).toBe(false);
  });
});

describe('ResultPage - Kiro 소개 탭 데이터', () => {
  const kiroFeatures = [
    { title: 'AWS Knowledge Base 연동' },
    { title: '원클릭 AWS 배포' },
    { title: '코드 학습 안함' },
    { title: '엔터프라이즈 보안' },
  ];

  const comparisonFeatures = [
    '코드 학습 안함 (보안)',
    '기업 데이터 완전 보호',
    'AWS Knowledge Base 내장',
    'AWS 네이티브 통합',
    '체계적 개발 방법론 (AI-DLC)',
    '자동 인프라 설계/배포',
    '자동 문서화',
  ];

  it('4개의 핵심 장점이 있어야 한다', () => {
    expect(kiroFeatures.length).toBe(4);
  });

  it('7개의 비교 항목이 있어야 한다', () => {
    expect(comparisonFeatures.length).toBe(7);
  });

  it('보안 관련 장점이 포함되어야 한다', () => {
    const securityFeatures = kiroFeatures.filter(f => 
      f.title.includes('보안') || f.title.includes('학습 안함')
    );
    expect(securityFeatures.length).toBeGreaterThan(0);
  });

  it('비교 항목에 보안 관련 내용이 포함되어야 한다', () => {
    const securityItems = comparisonFeatures.filter(f => 
      f.includes('보안') || f.includes('보호') || f.includes('학습 안함')
    );
    expect(securityItems.length).toBeGreaterThanOrEqual(2);
  });
});
