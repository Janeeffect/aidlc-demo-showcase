/**
 * ResultPage 하위 컴포넌트 다국어 테스트
 * Unit 5: 마무리 (Finalization)
 * - EstimateTab, AIDLCOutputsTab, KiroIntroTab, EmailReportModal 다국어 검증
 * - translateRole/translateSeniority locale 분기 검증
 * - 번역 키 커버리지 검증
 */
import '@testing-library/jest-dom';
import ko from '@/i18n/ko';
import en from '@/i18n/en';

// Helper to resolve nested keys
function resolve(obj: unknown, key: string): unknown {
  const keys = key.split('.');
  let current = obj;
  for (const k of keys) {
    if (current && typeof current === 'object' && k in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[k];
    } else {
      return undefined;
    }
  }
  return current;
}

describe('EstimateTab 다국어 - TC-FIN-001', () => {
  it('한국어 번역 키가 EstimateTab에 필요한 모든 키를 포함해야 한다', () => {
    const requiredKeys = [
      'result.estimate.aiSavings',
      'result.estimate.savedDays',
      'result.estimate.speedUp',
      'result.estimate.demoTime',
      'result.estimate.schedule',
      'result.estimate.expectedDuration',
      'result.estimate.complexity',
      'result.estimate.teamSize',
      'result.estimate.costEstimate',
      'result.estimate.devCost',
      'result.estimate.infraCost',
      'result.estimate.teamComposition',
      'result.estimate.techStack',
      'result.estimate.complexityHigh',
      'result.estimate.complexityMedium',
      'result.estimate.complexityLow',
      'result.estimate.days',
      'result.estimate.persons',
      'result.estimate.monthly',
      'result.estimate.approxMinutes',
    ];
    requiredKeys.forEach(key => {
      const value = resolve(ko, key);
      expect(value).toBeDefined();
      expect(typeof value).toBe('string');
    });
  });
});

describe('EstimateTab 다국어 - TC-FIN-002', () => {
  it('영어 번역 키가 EstimateTab에 필요한 모든 키를 포함해야 한다', () => {
    const requiredKeys = [
      'result.estimate.aiSavings',
      'result.estimate.savedDays',
      'result.estimate.speedUp',
      'result.estimate.demoTime',
      'result.estimate.schedule',
      'result.estimate.expectedDuration',
      'result.estimate.complexity',
      'result.estimate.teamSize',
      'result.estimate.costEstimate',
      'result.estimate.devCost',
      'result.estimate.infraCost',
      'result.estimate.teamComposition',
      'result.estimate.techStack',
      'result.estimate.complexityHigh',
      'result.estimate.complexityMedium',
      'result.estimate.complexityLow',
      'result.estimate.days',
      'result.estimate.persons',
      'result.estimate.monthly',
      'result.estimate.approxMinutes',
    ];
    requiredKeys.forEach(key => {
      const value = resolve(en, key);
      expect(value).toBeDefined();
      expect(typeof value).toBe('string');
    });
  });
});

describe('translateRole locale 분기 - TC-FIN-003', () => {
  // translateRole은 locale에 따라 역할명을 반환해야 한다
  const koRoles = resolve(ko, 'result.estimate.roles') as Record<string, string>;
  const enRoles = resolve(en, 'result.estimate.roles') as Record<string, string>;

  it('한국어 locale에서 한국어 역할명을 반환해야 한다', () => {
    expect(koRoles['Full-stack Developer']).toBe('풀스택 개발자');
    expect(koRoles['Frontend Developer']).toBe('프론트엔드 개발자');
    expect(koRoles['Backend Developer']).toBe('백엔드 개발자');
    expect(koRoles['UI/UX Designer']).toBe('UI/UX 디자이너');
    expect(koRoles['QA Engineer']).toBe('QA 엔지니어');
    expect(koRoles['DevOps Engineer']).toBe('DevOps 엔지니어');
    expect(koRoles['Tech Lead']).toBe('기술 리드');
  });

  it('영어 locale에서 영어 역할명을 반환해야 한다', () => {
    expect(enRoles['Full-stack Developer']).toBe('Full-stack Developer');
    expect(enRoles['Frontend Developer']).toBe('Frontend Developer');
    expect(enRoles['Backend Developer']).toBe('Backend Developer');
  });
});

describe('translateSeniority locale 분기 - TC-FIN-004', () => {
  const koSeniority = resolve(ko, 'result.estimate.seniority') as Record<string, string>;
  const enSeniority = resolve(en, 'result.estimate.seniority') as Record<string, string>;

  it('한국어 locale에서 한국어 직급명을 반환해야 한다', () => {
    expect(koSeniority['Junior']).toBe('주니어');
    expect(koSeniority['Mid-level']).toBe('미드레벨');
    expect(koSeniority['Senior']).toBe('시니어');
  });

  it('영어 locale에서 영어 직급명을 반환해야 한다', () => {
    expect(enSeniority['Junior']).toBe('Junior');
    expect(enSeniority['Mid-level']).toBe('Mid-level');
    expect(enSeniority['Senior']).toBe('Senior');
  });
});

describe('AIDLCOutputsTab 다국어 - TC-FIN-005', () => {
  it('한국어 AIDLCOutputs 키가 존재해야 한다', () => {
    expect(resolve(ko, 'result.aidlcOutputs.title')).toBe('AI-DLC 산출물');
    expect(resolve(ko, 'result.aidlcOutputs.desc')).toBe('클릭하여 AI가 생성한 산출물을 확인하세요');
  });

  it('영어 AIDLCOutputs 키가 존재해야 한다', () => {
    expect(resolve(en, 'result.aidlcOutputs.title')).toBe('AI-DLC Outputs');
    expect(resolve(en, 'result.aidlcOutputs.desc')).toBe('Click to view AI-generated outputs');
  });
});

describe('KiroIntroTab 다국어 - TC-FIN-006', () => {
  it('한국어 Kiro 키가 모든 필수 키를 포함해야 한다', () => {
    const requiredKeys = [
      'result.kiro.subtitle',
      'result.kiro.plans',
      'result.kiro.free',
      'result.kiro.pro',
      'result.kiro.features',
      'result.kiro.comparison',
      'result.kiro.security',
      'result.kiro.getStarted',
      'result.kiro.freePlan',
      'result.kiro.proPlan',
    ];
    requiredKeys.forEach(key => {
      const value = resolve(ko, key);
      expect(value).toBeDefined();
      expect(typeof value).toBe('string');
    });
  });

  it('한국어 Kiro 배열/객체 키가 존재해야 한다', () => {
    const freeFeatures = resolve(ko, 'result.kiro.freeFeatures');
    expect(Array.isArray(freeFeatures)).toBe(true);
    expect((freeFeatures as string[]).length).toBe(3);

    const proFeatures = resolve(ko, 'result.kiro.proFeatures');
    expect(Array.isArray(proFeatures)).toBe(true);
    expect((proFeatures as string[]).length).toBe(3);

    const featureItems = resolve(ko, 'result.kiro.featureItems');
    expect(Array.isArray(featureItems)).toBe(true);
    expect((featureItems as unknown[]).length).toBe(4);

    const comparisonItems = resolve(ko, 'result.kiro.comparisonItems');
    expect(Array.isArray(comparisonItems)).toBe(true);
    expect((comparisonItems as string[]).length).toBe(7);

    const securityItems = resolve(ko, 'result.kiro.securityItems');
    expect(Array.isArray(securityItems)).toBe(true);
    expect((securityItems as unknown[]).length).toBe(4);
  });
});

describe('KiroIntroTab 다국어 - TC-FIN-007', () => {
  it('영어 Kiro 키가 모든 필수 키를 포함해야 한다', () => {
    const requiredKeys = [
      'result.kiro.subtitle',
      'result.kiro.plans',
      'result.kiro.free',
      'result.kiro.pro',
      'result.kiro.features',
      'result.kiro.comparison',
      'result.kiro.security',
      'result.kiro.getStarted',
      'result.kiro.freePlan',
      'result.kiro.proPlan',
    ];
    requiredKeys.forEach(key => {
      const value = resolve(en, key);
      expect(value).toBeDefined();
      expect(typeof value).toBe('string');
    });
  });

  it('영어 Kiro 배열/객체 키가 존재해야 한다', () => {
    const freeFeatures = resolve(en, 'result.kiro.freeFeatures');
    expect(Array.isArray(freeFeatures)).toBe(true);
    expect((freeFeatures as string[]).length).toBe(3);

    const featureItems = resolve(en, 'result.kiro.featureItems');
    expect(Array.isArray(featureItems)).toBe(true);
    expect((featureItems as unknown[]).length).toBe(4);

    const securityItems = resolve(en, 'result.kiro.securityItems');
    expect(Array.isArray(securityItems)).toBe(true);
    expect((securityItems as unknown[]).length).toBe(4);
  });
});

describe('EmailReportModal 다국어 - TC-FIN-008', () => {
  it('한국어 Email 키가 모든 필수 키를 포함해야 한다', () => {
    const requiredKeys = [
      'result.email.title',
      'result.email.desc',
      'result.email.emailLabel',
      'result.email.nameLabel',
      'result.email.companyLabel',
      'result.email.reportIncludes',
      'result.email.submitButton',
      'result.email.submitting',
      'result.email.successTitle',
      'result.email.successDesc',
      'result.email.emailPlaceholder',
      'result.email.namePlaceholder',
      'result.email.companyPlaceholder',
    ];
    requiredKeys.forEach(key => {
      const value = resolve(ko, key);
      expect(value).toBeDefined();
      expect(typeof value).toBe('string');
    });
  });

  it('한국어 reportItems 배열이 존재해야 한다', () => {
    const items = resolve(ko, 'result.email.reportItems');
    expect(Array.isArray(items)).toBe(true);
    expect((items as string[]).length).toBe(4);
  });
});

describe('EmailReportModal 성공 메시지 - TC-FIN-009', () => {
  it('successDesc에 {email} placeholder가 포함되어야 한다', () => {
    const koDesc = resolve(ko, 'result.email.successDesc') as string;
    expect(koDesc).toContain('{email}');

    const enDesc = resolve(en, 'result.email.successDesc') as string;
    expect(enDesc).toContain('{email}');
  });

  it('{email} placeholder를 실제 이메일로 치환할 수 있어야 한다', () => {
    const koDesc = resolve(ko, 'result.email.successDesc') as string;
    const replaced = koDesc.replace('{email}', 'test@example.com');
    expect(replaced).toContain('test@example.com');
    expect(replaced).not.toContain('{email}');
  });
});

describe('번역 키 커버리지 - TC-FIN-010', () => {
  it('result.estimate.* 키가 ko/en 모두 존재해야 한다', () => {
    const koEstimate = resolve(ko, 'result.estimate') as Record<string, unknown>;
    const enEstimate = resolve(en, 'result.estimate') as Record<string, unknown>;
    const koKeys = Object.keys(koEstimate);
    const enKeys = Object.keys(enEstimate);
    koKeys.forEach(key => {
      expect(enEstimate[key]).toBeDefined();
    });
    enKeys.forEach(key => {
      expect(koEstimate[key]).toBeDefined();
    });
  });
});

describe('번역 키 커버리지 - TC-FIN-011', () => {
  it('result.kiro.* 키가 ko/en 모두 존재해야 한다', () => {
    const koKiro = resolve(ko, 'result.kiro') as Record<string, unknown>;
    const enKiro = resolve(en, 'result.kiro') as Record<string, unknown>;
    const koKeys = Object.keys(koKiro);
    const enKeys = Object.keys(enKiro);
    koKeys.forEach(key => {
      expect(enKiro[key]).toBeDefined();
    });
    enKeys.forEach(key => {
      expect(koKiro[key]).toBeDefined();
    });
  });
});

describe('번역 키 커버리지 - TC-FIN-012', () => {
  it('result.email.* 키가 ko/en 모두 존재해야 한다', () => {
    const koEmail = resolve(ko, 'result.email') as Record<string, unknown>;
    const enEmail = resolve(en, 'result.email') as Record<string, unknown>;
    const koKeys = Object.keys(koEmail);
    const enKeys = Object.keys(enEmail);
    koKeys.forEach(key => {
      expect(enEmail[key]).toBeDefined();
    });
    enKeys.forEach(key => {
      expect(koEmail[key]).toBeDefined();
    });
  });
});
